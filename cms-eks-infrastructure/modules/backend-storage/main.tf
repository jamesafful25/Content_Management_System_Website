
# ==================================================
# AWS Account and Region Information
# ==================================================

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

data "aws_partition" "current" {}


# ==================================================
# Backend IAM Policy
# S3 Storage and AWS Secrets Manager
# ==================================================

data "aws_iam_policy_document" "backend_storage" {

  # ------------------------------------------------
  # S3 Image Upload, Download and Deletion
  # ------------------------------------------------

  statement {
    sid    = "AllowImageUploadDownloadAndDeletion"
    effect = "Allow"

    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject"
    ]

    resources = [
      "${var.bucket_arn}/*"
    ]
  }


  # ------------------------------------------------
  # AWS Secrets Manager JWT Secret Access
  # ------------------------------------------------

  statement {
    sid    = "AllowReadApplicationJWTSecret"
    effect = "Allow"

    actions = [
      "secretsmanager:GetSecretValue"
    ]

    resources = [
      var.jwt_secret_arn
    ]
  }
}


# ==================================================
# Backend IAM Policy Resource
# ==================================================

resource "aws_iam_policy" "backend_storage" {
  name        = "${var.project_name}-${var.environment}-backend-storage"
  description = "Allows the CMS backend to upload and delete objects in its S3 bucket"
  policy      = data.aws_iam_policy_document.backend_storage.json

  tags = {
    Name        = "${var.project_name}-${var.environment}-backend-storage"
    Project     = var.project_name
    Environment = var.environment
  }
}


# ==================================================
# IAM Trust Policy for EKS Pod Identity
# ==================================================

data "aws_iam_policy_document" "backend_assume_role" {

  statement {
    effect = "Allow"

    actions = [
      "sts:AssumeRole",
      "sts:TagSession"
    ]

    principals {
      type = "Service"

      identifiers = [
        "pods.eks.amazonaws.com"
      ]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"

      values = [
        data.aws_caller_identity.current.account_id
      ]
    }

    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"

      values = [
        "arn:${data.aws_partition.current.partition}:eks:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:cluster/${var.cluster_name}"
      ]
    }
  }
}


# ==================================================
# Backend IAM Role
# ==================================================

resource "aws_iam_role" "backend_storage" {
  name        = "${var.project_name}-${var.environment}-backend-storage"
  description = "EKS Pod Identity role for CMS backend S3 storage operations"

  assume_role_policy = data.aws_iam_policy_document.backend_assume_role.json

  tags = {
    Name        = "${var.project_name}-${var.environment}-backend-storage"
    Project     = var.project_name
    Environment = var.environment
  }
}


# ==================================================
# Attach Backend IAM Policy
# ==================================================

resource "aws_iam_role_policy_attachment" "backend_storage" {
  role       = aws_iam_role.backend_storage.name
  policy_arn = aws_iam_policy.backend_storage.arn
}


# ==================================================
# EKS Pod Identity Association
# ==================================================

resource "aws_eks_pod_identity_association" "backend_storage" {
  cluster_name    = var.cluster_name
  namespace       = var.backend_namespace
  service_account = var.backend_service_account
  role_arn        = aws_iam_role.backend_storage.arn

  depends_on = [
    aws_iam_role_policy_attachment.backend_storage
  ]
}
