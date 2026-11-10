
variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "github_repository" {
  description = "GitHub repository allowed to assume the deployment role"
  type        = string
}

variable "github_branch" {
  description = "GitHub branch allowed to assume the deployment role"
  type        = string
  default     = "main"
}

variable "backend_ecr_repository_arn" {
  description = "ARN of the CMS backend ECR repository"
  type        = string
}

variable "frontend_ecr_repository_arn" {
  description = "ARN of the CMS frontend ECR repository"
  type        = string
}

variable "eks_cluster_arn" {
  description = "ARN of the CMS EKS cluster"
  type        = string
}