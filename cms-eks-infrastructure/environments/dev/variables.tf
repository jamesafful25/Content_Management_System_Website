variable "aws_region" {
  description = "AWS region for the CMS infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the CMS project"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the CMS VPC"
  type        = string
}

variable "availability_zones" {
  description = "Availability Zones for the CMS network"
  type        = list(string)
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
}

variable "enable_nat_gateway" {
  description = "Whether to create a NAT Gateway"
  type        = bool
  default     = false
}

# --------------------------------------------------
# EKS Configuration
# --------------------------------------------------

variable "cluster_name" {
  description = "Name of the CMS EKS cluster"
  type        = string
}

variable "cluster_version" {
  description = "Kubernetes version for the EKS cluster"
  type        = string
}

variable "node_instance_types" {
  description = "EC2 instance types for EKS worker nodes"
  type        = list(string)
}

variable "desired_size" {
  description = "Desired number of EKS worker nodes"
  type        = number
}

variable "min_size" {
  description = "Minimum number of EKS worker nodes"
  type        = number
}

variable "max_size" {
  description = "Maximum number of EKS worker nodes"
  type        = number
}

variable "public_access_cidrs" {
  description = "Trusted public IP CIDRs allowed to access the EKS API"
  type        = list(string)
}

# --------------------------------------------------
# EKS Pod Identity Agent
# --------------------------------------------------

variable "pod_identity_agent_version" {
  description = "Version of the EKS Pod Identity Agent add-on"
  type        = string
}