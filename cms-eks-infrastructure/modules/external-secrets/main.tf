
# --------------------------------------------------
# AWS Account and Region Information
# --------------------------------------------------

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

data "aws_partition" "current" {}


# --------------------------------------------------
# External Secrets Operator IAM Policy
# --------------------------------------------------

data "aws_iam_policy_document" "external_secrets" {
  statement {
    sid    = "ReadApprovedApplicationSecrets"
    effect = "Allow"

    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret"
    ]

    resources = var.secret_arns
  }
}


resource "aws_iam_policy" "external_secrets" {
  name        = "${var.project_name}-${var.environment}-external-secrets"
  description = "Allow External Secrets Operator to read approved CMS application secrets"

  policy = data.aws_iam_policy_document.external_secrets.json
}


# --------------------------------------------------
# IAM Trust Policy for EKS Pod Identity
# --------------------------------------------------

data "aws_iam_policy_document" "external_secrets_assume_role" {
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


# --------------------------------------------------
# External Secrets Operator IAM Role
# --------------------------------------------------

resource "aws_iam_role" "external_secrets" {
  name        = "${var.project_name}-${var.environment}-external-secrets"
  description = "Pod Identity role for External Secrets Operator"

  assume_role_policy = data.aws_iam_policy_document.external_secrets_assume_role.json

  tags = {
    Name        = "${var.project_name}-${var.environment}-external-secrets"
    Project     = var.project_name
    Environment = var.environment
  }
}


# --------------------------------------------------
# Attach External Secrets IAM Policy
# --------------------------------------------------

resource "aws_iam_role_policy_attachment" "external_secrets" {
  role       = aws_iam_role.external_secrets.name
  policy_arn = aws_iam_policy.external_secrets.arn
}


# --------------------------------------------------
# EKS Pod Identity Association
# --------------------------------------------------

resource "aws_eks_pod_identity_association" "external_secrets" {
  cluster_name    = var.cluster_name
  namespace       = var.operator_namespace
  service_account = var.operator_service_account
  role_arn        = aws_iam_role.external_secrets.arn

  depends_on = [
    aws_iam_role_policy_attachment.external_secrets
  ]
}
