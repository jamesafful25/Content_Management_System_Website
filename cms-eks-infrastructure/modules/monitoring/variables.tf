variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
}

variable "log_retention_days" {
  description = "Number of days to retain EKS control plane logs"
  type        = number
  default     = 7
}

variable "db_instance_identifier" {
  description = "RDS database instance identifier"
  type        = string
}

variable "rds_cpu_threshold" {
  description = "CPU utilization threshold for the RDS alarm"
  type        = number
  default     = 80
}

variable "rds_free_storage_threshold_bytes" {
  description = "Minimum free RDS storage in bytes"
  type        = number
  default     = 2147483648
}