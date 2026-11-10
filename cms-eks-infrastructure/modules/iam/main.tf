
# --------------------------------------------------
# GitHub Actions OIDC IAM Role
# --------------------------------------------------

data "aws_iam_policy_document" "github_actions_trust" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type = "Federated"

      identifiers = [
        "arn:aws:iam::448161422880:oidc-provider/token.actions.githubusercontent.com"
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

resource "aws_iam_role" "github_actions" {
  name                 = "${var.project_name}-${var.environment}-github-actions"
  description          = "GitHub Actions deployment role for CMS ECR image publishing"
  assume_role_policy   = data.aws_iam_policy_document.github_actions_trust.json
  max_session_duration = 3600
}

# --------------------------------------------------
# GitHub Actions ECR Permissions
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

# --------------------------------------------------
# GitHub Actions EKS Permissions
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
}

resource "aws_iam_role_policy_attachment" "eks_describe" {
  role       = aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.eks_describe.arn
}

resource "aws_iam_policy" "ecr_push" {
  name        = "${var.project_name}-${var.environment}-ecr-push"
  description = "Allow GitHub Actions to push images to CMS ECR repositories"
  policy      = data.aws_iam_policy_document.ecr_push.json
}

resource "aws_iam_role_policy_attachment" "ecr_push" {
  role       = aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.ecr_push.arn
}
