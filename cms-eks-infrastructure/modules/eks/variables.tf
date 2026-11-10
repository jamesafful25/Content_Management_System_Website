variable "project_name" {
  description = "Name of the CMS project"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}

variable "cluster_version" {
  description = "Kubernetes version for EKS"
  type        = string
}

variable "cluster_subnet_ids" {
  description = "Public and private subnet IDs for the EKS control plane"
  type        = list(string)
}

variable "node_subnet_ids" {
  description = "Public subnet IDs for EKS worker nodes"
  type        = list(string)
}

variable "public_access_cidrs" {
  description = "Trusted public IP CIDRs allowed to access the EKS API"
  type        = list(string)
}

variable "node_instance_types" {
  description = "EC2 instance types for EKS worker nodes"
  type        = list(string)
}

variable "desired_size" {
  description = "Desired number of worker nodes"
  type        = number
}

variable "min_size" {
  description = "Minimum number of worker nodes"
  type        = number
}

variable "max_size" {
  description = "Maximum number of worker nodes"
  type        = number
}