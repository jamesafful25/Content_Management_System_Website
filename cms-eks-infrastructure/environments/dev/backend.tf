terraform {
  backend "s3" {
    bucket       = "jamesafful25-portfolio-tf-state"
    key          = "cms/dev/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}