
# --------------------------------------------------
# CMS Private EKS Deployment - CodeBuild Project
# --------------------------------------------------

resource "aws_codebuild_project" "cms_deployment" {
  name          = "${var.project_name}-${var.environment}-eks-deployment"
  description   = "Deploy CMS applications to the private EKS cluster"
  service_role  = module.iam.codebuild_role_arn
  build_timeout = 60

  source {
    type      = "S3"
    location  = "${module.deployment_artifacts_s3.bucket_id}/deployments/source.zip"
    buildspec = "buildspec-deploy.yml"
  }

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    type                        = "LINUX_CONTAINER"
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:7.0"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode             = false

    environment_variable {
      name  = "AWS_DEFAULT_REGION"
      value = var.aws_region
    }

    environment_variable {
      name  = "EKS_CLUSTER_NAME"
      value = module.eks.cluster_name
    }

    environment_variable {
      name  = "EKS_CLUSTER_ENDPOINT"
      value = module.eks.cluster_endpoint
    }

    environment_variable {
      name  = "EKS_CLUSTER_CA"
      value = module.eks.cluster_certificate_authority_data
    }

    environment_variable {
      name  = "DEPLOYMENT_NAMESPACE"
      value = "cms"
    }
  }

  vpc_config {
    vpc_id = module.vpc.vpc_id

    subnets = module.vpc.private_subnet_ids

    security_group_ids = [
      module.security_groups.codebuild_security_group_id
    ]
  }

  logs_config {
    s3_logs {
      status   = "ENABLED"
      location = "${module.deployment_artifacts_s3.bucket_id}/codebuild-logs"
    }
  }

  tags = {
    Project     = "CMS"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }
}
