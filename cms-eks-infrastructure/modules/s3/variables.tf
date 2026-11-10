
variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "bucket_name" {
  description = "Globally unique S3 bucket name for CMS uploads"
  type        = string
}

variable "force_destroy" {
  description = "Allow Terraform to delete a bucket containing objects"
  type        = bool
  default     = false
}
