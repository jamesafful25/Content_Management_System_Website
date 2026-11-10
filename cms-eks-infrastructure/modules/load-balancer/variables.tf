
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

variable "pod_identity_agent_version" {
  description = "Version of the EKS Pod Identity Agent add-on"
  type        = string
}


# --------------------------------------------------
# AWS Load Balancer Controller Configuration
# --------------------------------------------------

variable "controller_namespace" {
  description = "Kubernetes namespace for AWS Load Balancer Controller"
  type        = string
  default     = "kube-system"
}

variable "controller_service_account" {
  description = "Kubernetes ServiceAccount used by AWS Load Balancer Controller"
  type        = string
  default     = "aws-load-balancer-controller"
}
