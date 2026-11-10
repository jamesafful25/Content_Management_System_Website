
# ==================================================
# General Configuration
# ==================================================

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}


# ==================================================
# EKS Configuration
# ==================================================

variable "cluster_name" {
  description = "Name of the existing EKS cluster"
  type        = string
}

variable "backend_namespace" {
  description = "Kubernetes namespace for the CMS backend"
  type        = string
  default     = "cms"
}

variable "backend_service_account" {
  description = "Kubernetes ServiceAccount used by the CMS backend"
  type        = string
  default     = "cms-backend-sa"
}


# ==================================================
# S3 Configuration
# ==================================================

variable "bucket_arn" {
  description = "ARN of the existing private S3 uploads bucket"
  type        = string
}


# ==================================================
# AWS Secrets Manager Configuration
# ==================================================

variable "jwt_secret_arn" {
  description = "ARN of the CMS application JWT secret in AWS Secrets Manager"
  type        = string
}
