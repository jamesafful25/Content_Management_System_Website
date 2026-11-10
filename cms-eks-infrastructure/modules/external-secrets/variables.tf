# --------------------------------------------------
# General Configuration
# --------------------------------------------------

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}


# --------------------------------------------------
# EKS Configuration
# --------------------------------------------------

variable "cluster_name" {
  description = "Name of the existing EKS cluster"
  type        = string
}


# --------------------------------------------------
# External Secrets Operator Configuration
# --------------------------------------------------

variable "operator_namespace" {
  description = "Kubernetes namespace where External Secrets Operator runs"
  type        = string
  default     = "external-secrets"
}

variable "operator_service_account" {
  description = "Kubernetes ServiceAccount used by External Secrets Operator"
  type        = string
  default     = "external-secrets"
}


# --------------------------------------------------
# AWS Secrets Manager Configuration
# --------------------------------------------------

variable "secret_arns" {
  description = "List of approved AWS Secrets Manager secret ARNs accessible to External Secrets Operator"
  type        = list(string)

  validation {
    condition     = length(var.secret_arns) > 0
    error_message = "At least one approved Secrets Manager secret ARN must be supplied."
  }
}