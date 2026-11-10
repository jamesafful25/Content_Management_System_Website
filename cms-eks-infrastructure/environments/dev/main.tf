
# --------------------------------------------------
# VPC
# --------------------------------------------------

module "vpc" {
  source = "../../modules/vpc"

  project_name         = var.project_name
  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  enable_nat_gateway   = var.enable_nat_gateway
}


# --------------------------------------------------
# EKS Cluster
# --------------------------------------------------

module "eks" {
  source = "../../modules/eks"

  project_name = var.project_name
  environment  = var.environment

  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version

  # EKS control plane uses both public and private subnets.
  cluster_subnet_ids = concat(
    module.vpc.public_subnet_ids,
    module.vpc.private_subnet_ids
  )

  # Worker nodes use public subnets only.
  node_subnet_ids = module.vpc.public_subnet_ids

  public_access_cidrs = var.public_access_cidrs

  node_instance_types = var.node_instance_types

  desired_size = var.desired_size
  min_size     = var.min_size
  max_size     = var.max_size
}


# --------------------------------------------------
# ECR Repositories
# --------------------------------------------------

module "ecr" {
  source = "../../modules/ecr"

  project_name = var.project_name
  environment  = var.environment

  image_scan_on_push   = true
  image_tag_mutability = "IMMUTABLE"
}


# --------------------------------------------------
# GitHub Actions IAM Role
# --------------------------------------------------

module "iam" {
  source = "../../modules/iam"

  project_name = var.project_name
  environment  = var.environment

  github_repository = "jamesafful25/Content_Management_System_Website"
  github_branch     = "main"

  backend_ecr_repository_arn  = module.ecr.backend_repository_arn
  frontend_ecr_repository_arn = module.ecr.frontend_repository_arn
  eks_cluster_arn             = module.eks.cluster_arn
}


# --------------------------------------------------
# Security Groups
# --------------------------------------------------

module "security_groups" {
  source = "../../modules/security-groups"

  project_name = var.project_name
  environment  = var.environment

  vpc_id = module.vpc.vpc_id

  eks_cluster_security_group_id = module.eks.cluster_security_group_id

  allowed_http_cidrs  = ["0.0.0.0/0"]
  allowed_https_cidrs = ["0.0.0.0/0"]

  frontend_port = 80
  database_port = 3306
}


# --------------------------------------------------
# RDS MySQL Database
# --------------------------------------------------

module "rds" {
  source = "../../modules/rds"

  project_name = var.project_name
  environment  = var.environment

  private_subnet_ids = module.vpc.private_subnet_ids

  rds_security_group_id = module.security_groups.rds_security_group_id

  database_name   = "cms_db"
  master_username = "cms_admin"

  engine_version = "8.0.46-rds.20260908"
  instance_class = "db.t3.micro"

  allocated_storage       = 20
  backup_retention_period = 1
}


# --------------------------------------------------
# S3 Bucket for CMS Uploads
# --------------------------------------------------

module "s3" {
  source = "../../modules/s3"

  project_name = var.project_name
  environment  = var.environment

  bucket_name = "cms-dev-uploads-448161422880"

  force_destroy = false
}


# --------------------------------------------------
# Secrets Manager
# --------------------------------------------------

module "secrets_manager" {
  source = "../../modules/secrets-manager"

  project_name = var.project_name
  environment  = var.environment
}


# --------------------------------------------------
# Monitoring
# --------------------------------------------------

module "monitoring" {
  source = "../../modules/monitoring"

  project_name           = var.project_name
  environment            = var.environment
  cluster_name           = module.eks.cluster_name
  db_instance_identifier = module.rds.db_instance_id

  log_retention_days = 7
}


# --------------------------------------------------
# AWS Load Balancer Controller and Pod Identity
# --------------------------------------------------

module "load_balancer" {
  source = "../../modules/load-balancer"

  project_name = var.project_name
  environment  = var.environment

  cluster_name               = module.eks.cluster_name
  pod_identity_agent_version = var.pod_identity_agent_version
}


# --------------------------------------------------
# External Secrets Operator and Pod Identity
# --------------------------------------------------

module "external_secrets" {
  source = "../../modules/external-secrets"

  project_name = var.project_name
  environment  = var.environment

  cluster_name = module.eks.cluster_name

  secret_arns = [
    module.secrets_manager.jwt_secret_arn,
    module.secrets_manager.runtime_db_secret_arn,
    module.secrets_manager.migration_db_secret_arn
  ]

  operator_namespace       = "external-secrets"
  operator_service_account = "external-secrets"

  depends_on = [
    module.load_balancer
  ]
}


# --------------------------------------------------
# CMS Backend S3 Storage and Pod Identity
# --------------------------------------------------

module "backend_storage" {
  source = "../../modules/backend-storage"

  project_name = var.project_name
  environment  = var.environment

  cluster_name = module.eks.cluster_name

  bucket_arn     = module.s3.bucket_arn
  jwt_secret_arn = module.secrets_manager.jwt_secret_arn

  backend_namespace       = "cms"
  backend_service_account = "cms-backend-sa"

  depends_on = [
    module.load_balancer
  ]
}


# --------------------------------------------------
# Temporary Database Administration IAM and Pod Identity
# --------------------------------------------------

data "aws_caller_identity" "db_admin" {}

data "aws_region" "db_admin" {}

data "aws_partition" "db_admin" {}


# --------------------------------------------------
# Database Administration IAM Policy
# --------------------------------------------------

data "aws_iam_policy_document" "db_admin" {

  # Read the RDS master credentials.
  statement {
    sid    = "ReadRDSMasterSecret"
    effect = "Allow"

    actions = [
      "secretsmanager:GetSecretValue"
    ]

    resources = [
      module.rds.master_user_secret_arn
    ]
  }

  # Create and update only the two CMS database secrets.
  statement {
    sid    = "ManageCMSDatabaseSecrets"
    effect = "Allow"

    actions = [
      "secretsmanager:PutSecretValue",
      "secretsmanager:DescribeSecret"
    ]

    resources = [
      module.secrets_manager.runtime_db_secret_arn,
      module.secrets_manager.migration_db_secret_arn
    ]
  }
}


resource "aws_iam_policy" "db_admin" {
  name = "${var.project_name}-${var.environment}-db-admin"

  # Keep the existing description to avoid replacing the IAM policy.
  description = "Temporary permission to retrieve the RDS master secret for database administration"

  policy = data.aws_iam_policy_document.db_admin.json
}


# --------------------------------------------------
# Database Administration IAM Role
# --------------------------------------------------

resource "aws_iam_role" "db_admin" {
  name        = "${var.project_name}-${var.environment}-db-admin"
  description = "Temporary EKS Pod Identity role for CMS database administration"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "pods.eks.amazonaws.com"
        }

        Action = [
          "sts:AssumeRole",
          "sts:TagSession"
        ]

        Condition = {
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.db_admin.account_id
          }

          ArnEquals = {
            "aws:SourceArn" = "arn:${data.aws_partition.db_admin.partition}:eks:${data.aws_region.db_admin.region}:${data.aws_caller_identity.db_admin.account_id}:cluster/${module.eks.cluster_name}"
          }
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-${var.environment}-db-admin"
    Project     = var.project_name
    Environment = var.environment
  }
}


# --------------------------------------------------
# Attach Database Administration Policy
# --------------------------------------------------

resource "aws_iam_role_policy_attachment" "db_admin" {
  role       = aws_iam_role.db_admin.name
  policy_arn = aws_iam_policy.db_admin.arn
}


# --------------------------------------------------
# EKS Pod Identity Association
# --------------------------------------------------

resource "aws_eks_pod_identity_association" "db_admin" {
  cluster_name    = module.eks.cluster_name
  namespace       = "cms-db-admin"
  service_account = "cms-db-admin-sa"

  role_arn = aws_iam_role.db_admin.arn

  depends_on = [
    aws_iam_role_policy_attachment.db_admin
  ]
}
