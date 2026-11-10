provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "CMS"
      Environment = "dev"
      ManagedBy   = "Terraform"
    }
  }
}