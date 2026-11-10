
# --------------------------------------------------
# AWS Account, Region and Partition Data Sources
# --------------------------------------------------

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

data "aws_partition" "current" {}


# --------------------------------------------------
# GitHub Actions OIDC Trust Policy
# --------------------------------------------------

data "aws_iam_policy_document" "github_actions_trust" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type = "Federated"

      identifiers = [
        "arn:${data.aws_partition.current.partition}:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
      ]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"

      values = [
        "repo:${var.github_repository}:ref:refs/heads/${var.github_branch}"
      ]
    }
  }
}


# --------------------------------------------------
# GitHub Actions IAM Role
# --------------------------------------------------

resource "aws_iam_role" "github_actions" {
  name               = "${var.project_name}-${var.environment}-github-actions"
  description        = "GitHub Actions deployment role for CMS ECR image publishing"
  assume_role_policy = data.aws_iam_policy_document.github_actions_trust.json

  tags = {
    Project     = "CMS"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }
}


# --------------------------------------------------
# ECR Push Policy
# --------------------------------------------------

data "aws_iam_policy_document" "ecr_push" {
  statement {
    sid    = "ECRAuthentication"
    effect = "Allow"

    actions = [
      "ecr:GetAuthorizationToken"
    ]

    resources = ["*"]
  }

  statement {
    sid    = "PushImagesToCMSRepositories"
    effect = "Allow"

    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
      "ecr:PutImage"
    ]

    resources = [
      var.backend_ecr_repository_arn,
      var.frontend_ecr_repository_arn
    ]
  }
}


resource "aws_iam_policy" "ecr_push" {
  name        = "${var.project_name}-${var.environment}-ecr-push"
  description = "Allow GitHub Actions to push images to CMS ECR repositories"
  policy      = data.aws_iam_policy_document.ecr_push.json

  tags = {
    Project     = "CMS"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }
}


# --------------------------------------------------
# EKS Describe Policy
# --------------------------------------------------

data "aws_iam_policy_document" "eks_describe" {
  statement {
    sid    = "DescribeCMSEKSCluster"
    effect = "Allow"

    actions = [
      "eks:DescribeCluster"
    ]

    resources = [
      var.eks_cluster_arn
    ]
  }
}


resource "aws_iam_policy" "eks_describe" {
  name        = "${var.project_name}-${var.environment}-eks-describe"
  description = "Allow GitHub Actions to retrieve CMS EKS cluster connection details"
  policy      = data.aws_iam_policy_document.eks_describe.json

  tags = {
    Project     = "CMS"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }
}


# --------------------------------------------------
# Attach ECR Push Policy
# --------------------------------------------------

resource "aws_iam_role_policy_attachment" "ecr_push" {
  role       = aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.ecr_push.arn
}


# --------------------------------------------------
# Attach EKS Describe Policy
# --------------------------------------------------

resource "aws_iam_role_policy_attachment" "eks_describe" {
  role       = aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.eks_describe.arn
}


# --------------------------------------------------
# CodeBuild Service Role Trust Policy
# --------------------------------------------------

data "aws_iam_policy_document" "codebuild_trust" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["codebuild.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }
  }
}


# --------------------------------------------------
# CodeBuild Deployment Role
# --------------------------------------------------

resource "aws_iam_role" "codebuild" {
  name               = "${var.project_name}-${var.environment}-codebuild-deployment"
  description        = "CodeBuild role for deploying CMS applications to private EKS"
  assume_role_policy = data.aws_iam_policy_document.codebuild_trust.json

  tags = {
    Project     = "CMS"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }
}


# --------------------------------------------------
# CodeBuild Deployment Artifacts S3 and CloudWatch Logs Policy
# --------------------------------------------------

data "aws_iam_policy_document" "codebuild_s3" {
  statement {
    sid    = "ListDeploymentArtifactsBucket"
    effect = "Allow"

    actions = [
      "s3:ListBucket",
      "s3:GetBucketLocation"
    ]

    resources = [
      var.deployment_artifacts_bucket_arn
    ]
  }

  statement {
    sid    = "ReadDeploymentSourceAndWriteBuildLogs"
    effect = "Allow"

    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:AbortMultipartUpload"
    ]

    resources = [
      "${var.deployment_artifacts_bucket_arn}/*"
    ]
  }

  statement {
    sid    = "AllowCodeBuildCloudWatchLogs"
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]

    resources = [
      "arn:${data.aws_partition.current.partition}:logs:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/codebuild/${var.project_name}-${var.environment}-eks-deployment",
      "arn:${data.aws_partition.current.partition}:logs:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/codebuild/${var.project_name}-${var.environment}-eks-deployment:*"
    ]
  }
}


resource "aws_iam_policy" "codebuild_s3" {
  name        = "${var.project_name}-${var.environment}-codebuild-s3"
  description = "Allow CodeBuild to read deployment sources and write build logs"
  policy      = data.aws_iam_policy_document.codebuild_s3.json

  tags = {
    Project     = "CMS"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }
}


resource "aws_iam_role_policy_attachment" "codebuild_s3" {
  role       = aws_iam_role.codebuild.name
  policy_arn = aws_iam_policy.codebuild_s3.arn
}


# --------------------------------------------------
# CodeBuild EKS Describe Policy
# --------------------------------------------------

data "aws_iam_policy_document" "codebuild_eks_describe" {
  statement {
    sid    = "DescribeCMSEKSCluster"
    effect = "Allow"

    actions = [
      "eks:DescribeCluster"
    ]

    resources = [
      var.eks_cluster_arn
    ]
  }
}


resource "aws_iam_policy" "codebuild_eks_describe" {
  name        = "${var.project_name}-${var.environment}-codebuild-eks-describe"
  description = "Allow CodeBuild to retrieve CMS EKS cluster details"
  policy      = data.aws_iam_policy_document.codebuild_eks_describe.json

  tags = {
    Project     = "CMS"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }
}


resource "aws_iam_role_policy_attachment" "codebuild_eks_describe" {
  role       = aws_iam_role.codebuild.name
  policy_arn = aws_iam_policy.codebuild_eks_describe.arn
}


# --------------------------------------------------
# GitHub Actions CodeBuild Deployment Permissions
# --------------------------------------------------

data "aws_iam_policy_document" "github_deployment" {
  statement {
    sid    = "UploadDeploymentPackages"
    effect = "Allow"

    actions = [
      "s3:PutObject",
      "s3:AbortMultipartUpload"
    ]

    resources = [
      "${var.deployment_artifacts_bucket_arn}/deployments/*"
    ]
  }

  statement {
    sid    = "AccessDeploymentArtifactsBucket"
    effect = "Allow"

    actions = [
      "s3:ListBucket",
      "s3:GetBucketLocation"
    ]

    resources = [
      var.deployment_artifacts_bucket_arn
    ]

    condition {
      test     = "StringLike"
      variable = "s3:prefix"
      values   = ["deployments/*"]
    }
  }

  statement {
    sid    = "StartAndMonitorCMSCodeBuild"
    effect = "Allow"

    actions = [
      "codebuild:StartBuild",
      "codebuild:BatchGetBuilds"
    ]

    resources = [
      "arn:${data.aws_partition.current.partition}:codebuild:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:project/${var.project_name}-${var.environment}-eks-deployment"
    ]
  }
}


resource "aws_iam_policy" "github_deployment" {
  name        = "${var.project_name}-${var.environment}-github-deployment"
  description = "Allow GitHub Actions to upload CMS deployment packages and start CodeBuild"
  policy      = data.aws_iam_policy_document.github_deployment.json

  tags = {
    Project     = "CMS"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }
}


resource "aws_iam_role_policy_attachment" "github_deployment" {
  role       = aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.github_deployment.arn
}


# --------------------------------------------------
# CodeBuild VPC Network Interface Permissions
# --------------------------------------------------

data "aws_iam_policy_document" "codebuild_vpc" {
  statement {
    sid    = "DescribeVPCResources"
    effect = "Allow"

    actions = [
      "ec2:DescribeDhcpOptions",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeSubnets",
      "ec2:DescribeVpcs"
    ]

    resources = ["*"]
  }

  statement {
    sid    = "CreateNetworkInterfaces"
    effect = "Allow"

    actions = [
      "ec2:CreateNetworkInterface"
    ]

    resources = [
      "arn:${data.aws_partition.current.partition}:ec2:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:network-interface/*",
      "arn:${data.aws_partition.current.partition}:ec2:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:subnet/*",
      "arn:${data.aws_partition.current.partition}:ec2:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:security-group/*"
    ]
  }

  statement {
    sid    = "DeleteNetworkInterfaces"
    effect = "Allow"

    actions = [
      "ec2:DeleteNetworkInterface"
    ]

    resources = ["*"]
  }

  statement {
    sid    = "AllowCodeBuildNetworkInterfacePermission"
    effect = "Allow"

    actions = [
      "ec2:CreateNetworkInterfacePermission"
    ]

    resources = [
      "arn:${data.aws_partition.current.partition}:ec2:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:network-interface/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "ec2:AuthorizedService"
      values   = ["codebuild.amazonaws.com"]
    }
  }
}


resource "aws_iam_policy" "codebuild_vpc" {
  name        = "${var.project_name}-${var.environment}-codebuild-vpc"
  description = "Allow CodeBuild to manage VPC network interfaces"
  policy      = data.aws_iam_policy_document.codebuild_vpc.json

  tags = {
    Project     = "CMS"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }
}


resource "aws_iam_role_policy_attachment" "codebuild_vpc" {
  role       = aws_iam_role.codebuild.name
  policy_arn = aws_iam_policy.codebuild_vpc.arn
}
