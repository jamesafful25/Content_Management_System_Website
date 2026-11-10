

# --------------------------------------------------
# AWS Account and Region Information
# --------------------------------------------------

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

data "aws_partition" "current" {}


# --------------------------------------------------
# EKS Pod Identity Agent
# --------------------------------------------------

resource "aws_eks_addon" "pod_identity_agent" {
  cluster_name  = var.cluster_name
  addon_name    = "eks-pod-identity-agent"
  addon_version = var.pod_identity_agent_version

  tags = {
    Name        = "${var.project_name}-${var.environment}-pod-identity-agent"
    Project     = var.project_name
    Environment = var.environment
  }
}


# --------------------------------------------------
# AWS Load Balancer Controller IAM Policy
# --------------------------------------------------

resource "aws_iam_policy" "load_balancer_controller" {
  name        = "${var.project_name}-${var.environment}-aws-load-balancer-controller"
  description = "IAM permissions for the AWS Load Balancer Controller"

  policy = file("${path.module}/iam_policy.json")
}


# --------------------------------------------------
# IAM Trust Policy for EKS Pod Identity
# --------------------------------------------------

data "aws_iam_policy_document" "load_balancer_controller_assume_role" {
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
# AWS Load Balancer Controller IAM Role
# --------------------------------------------------

resource "aws_iam_role" "load_balancer_controller" {
  name        = "${var.project_name}-${var.environment}-aws-load-balancer-controller"
  description = "Pod Identity role for the AWS Load Balancer Controller"

  assume_role_policy = data.aws_iam_policy_document.load_balancer_controller_assume_role.json

  tags = {
    Name        = "${var.project_name}-${var.environment}-aws-load-balancer-controller"
    Project     = var.project_name
    Environment = var.environment
  }
}


# --------------------------------------------------
# Attach Controller IAM Policy
# --------------------------------------------------

resource "aws_iam_role_policy_attachment" "load_balancer_controller" {
  role       = aws_iam_role.load_balancer_controller.name
  policy_arn = aws_iam_policy.load_balancer_controller.arn
}


# --------------------------------------------------
# EKS Pod Identity Association
# --------------------------------------------------

resource "aws_eks_pod_identity_association" "load_balancer_controller" {
  cluster_name    = var.cluster_name
  namespace       = var.controller_namespace
  service_account = var.controller_service_account
  role_arn        = aws_iam_role.load_balancer_controller.arn

  depends_on = [
    aws_eks_addon.pod_identity_agent,
    aws_iam_role_policy_attachment.load_balancer_controller
  ]
}
