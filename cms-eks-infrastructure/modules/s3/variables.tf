variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "bucket_name" {
  description = "Globally unique S3 bucket name"
  type        = string
}

variable "bucket_purpose" {
  description = "Purpose used in the S3 bucket Name tag"
  type        = string
  default     = "uploads"
}

variable "force_destroy" {
  description = "Allow Terraform to delete a bucket containing objects"
  type        = bool
  default     = false
}
