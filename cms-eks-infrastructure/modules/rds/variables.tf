
variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for the RDS DB subnet group"
  type        = list(string)
}

variable "rds_security_group_id" {
  description = "Security group ID controlling access to RDS"
  type        = string
}

variable "database_name" {
  description = "Initial database name"
  type        = string
  default     = "cms_db"
}

variable "master_username" {
  description = "RDS master database username"
  type        = string
  default     = "cms_admin"
}

variable "engine_version" {
  description = "MySQL engine version"
  type        = string
  default     = "8.0.46-rds.20260908"
}

variable "instance_class" {
  description = "RDS database instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "allocated_storage" {
  description = "Initial allocated database storage in GB"
  type        = number
  default     = 20
}

variable "backup_retention_period" {
  description = "Number of days to retain automated backups"
  type        = number
  default     = 1
}
