output "aws_region" {
  description = "AWS region where the CMS infrastructure is deployed"
  value       = var.aws_region
}

output "vpc_id" {
  description = "ID of the CMS VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr" {
  description = "CIDR block of the CMS VPC"
  value       = module.vpc.vpc_cidr
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = module.vpc.private_subnet_ids
}

output "internet_gateway_id" {
  description = "ID of the CMS Internet Gateway"
  value       = module.vpc.internet_gateway_id
}

output "nat_gateway_ids" {
  description = "IDs of NAT Gateways, if enabled"
  value       = module.vpc.nat_gateway_ids
}

# --------------------------------------------------
# EKS Outputs
# --------------------------------------------------

output "eks_cluster_name" {
  description = "Name of the CMS EKS cluster"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "API endpoint of the CMS EKS cluster"
  value       = module.eks.cluster_endpoint
}

output "eks_node_group_name" {
  description = "Name of the CMS EKS worker node group"
  value       = module.eks.node_group_name
}

output "eks_cluster_security_group_id" {
  description = "Security group ID created for the EKS cluster"
  value       = module.eks.cluster_security_group_id
}


# --------------------------------------------------
# ECR Outputs
# --------------------------------------------------

output "backend_ecr_repository_name" {
  description = "Name of the CMS backend ECR repository"
  value       = module.ecr.backend_repository_name
}

output "backend_ecr_repository_url" {
  description = "URL of the CMS backend ECR repository"
  value       = module.ecr.backend_repository_url
}

output "backend_ecr_repository_arn" {
  description = "ARN of the CMS backend ECR repository"
  value       = module.ecr.backend_repository_arn
}

output "frontend_ecr_repository_name" {
  description = "Name of the CMS frontend ECR repository"
  value       = module.ecr.frontend_repository_name
}

output "frontend_ecr_repository_url" {
  description = "URL of the CMS frontend ECR repository"
  value       = module.ecr.frontend_repository_url
}

output "frontend_ecr_repository_arn" {
  description = "ARN of the CMS frontend ECR repository"
  value       = module.ecr.frontend_repository_arn
}


# --------------------------------------------------
# GitHub Actions IAM Outputs
# --------------------------------------------------

output "github_actions_role_name" {
  description = "Name of the CMS GitHub Actions IAM role"
  value       = module.iam.github_actions_role_name
}

output "github_actions_role_arn" {
  description = "ARN of the CMS GitHub Actions IAM role"
  value       = module.iam.github_actions_role_arn
}

output "ecr_push_policy_arn" {
  description = "ARN of the CMS ECR push policy"
  value       = module.iam.ecr_push_policy_arn
}


# --------------------------------------------------
# Security Groups Outputs
# --------------------------------------------------

output "alb_security_group_id" {
  description = "Security group ID for the CMS Application Load Balancer"
  value       = module.security_groups.alb_security_group_id
}

output "alb_security_group_name" {
  description = "Security group name for the CMS Application Load Balancer"
  value       = module.security_groups.alb_security_group_name
}

output "rds_security_group_id" {
  description = "Security group ID for the CMS RDS database"
  value       = module.security_groups.rds_security_group_id
}

output "rds_security_group_name" {
  description = "Security group name for the CMS RDS database"
  value       = module.security_groups.rds_security_group_name
}


# --------------------------------------------------
# RDS Outputs
# --------------------------------------------------

output "rds_db_instance_id" {
  description = "CMS RDS database instance identifier"
  value       = module.rds.db_instance_id
}

output "rds_db_endpoint" {
  description = "CMS RDS database connection endpoint"
  value       = module.rds.db_endpoint
}

output "rds_db_address" {
  description = "CMS RDS database hostname"
  value       = module.rds.db_address
}

output "rds_db_port" {
  description = "CMS RDS database port"
  value       = module.rds.db_port
}

output "rds_database_name" {
  description = "CMS application database name"
  value       = module.rds.database_name
}

output "rds_master_username" {
  description = "CMS RDS master username"
  value       = module.rds.master_username
}

output "rds_master_user_secret_arn" {
  description = "ARN of the AWS-managed RDS master password secret"
  value       = module.rds.master_user_secret_arn
}


# --------------------------------------------------
# S3 Upload Bucket Outputs
# --------------------------------------------------

output "s3_bucket_id" {
  description = "CMS uploads S3 bucket name"
  value       = module.s3.bucket_id
}

output "s3_bucket_arn" {
  description = "CMS uploads S3 bucket ARN"
  value       = module.s3.bucket_arn
}

output "s3_bucket_domain_name" {
  description = "Regional domain name of the CMS uploads bucket"
  value       = module.s3.bucket_domain_name
}

output "s3_bucket_region" {
  description = "AWS region containing the CMS uploads bucket"
  value       = module.s3.bucket_region
}

# --------------------------------------------------
# CI/CD Deployment Artifacts Bucket Outputs
# --------------------------------------------------

output "deployment_artifacts_bucket_id" {
  description = "S3 bucket name for CI/CD deployment artifacts"
  value       = module.deployment_artifacts_s3.bucket_id
}

output "deployment_artifacts_bucket_arn" {
  description = "S3 bucket ARN for CI/CD deployment artifacts"
  value       = module.deployment_artifacts_s3.bucket_arn
}