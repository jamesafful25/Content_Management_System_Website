
variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "vpc_id" {
  description = "ID of the existing CMS VPC"
  type        = string
}

variable "allowed_http_cidrs" {
  description = "CIDR ranges allowed to access the public application load balancer over HTTP"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "allowed_https_cidrs" {
  description = "CIDR ranges allowed to access the public application load balancer over HTTPS"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "backend_port" {
  description = "Port exposed by the CMS backend"
  type        = number
  default     = 5000
}

variable "frontend_port" {
  description = "Port exposed by the CMS frontend"
  type        = number
  default     = 80
}

variable "database_port" {
  description = "Port used by the CMS MySQL database"
  type        = number
  default     = 3306
}

variable "eks_cluster_security_group_id" {
  description = "Security group ID of the existing CMS EKS cluster"
  type        = string
}