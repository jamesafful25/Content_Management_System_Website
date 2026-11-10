
output "db_instance_id" {
  description = "RDS database instance identifier"
  value       = aws_db_instance.main.id
}

output "db_instance_arn" {
  description = "ARN of the RDS database instance"
  value       = aws_db_instance.main.arn
}

output "db_endpoint" {
  description = "RDS database connection endpoint"
  value       = aws_db_instance.main.endpoint
}

output "db_address" {
  description = "RDS database hostname"
  value       = aws_db_instance.main.address
}

output "db_port" {
  description = "RDS database port"
  value       = aws_db_instance.main.port
}

output "database_name" {
  description = "Name of the application database"
  value       = aws_db_instance.main.db_name
}

output "master_username" {
  description = "RDS master username"
  value       = aws_db_instance.main.username
}

output "master_user_secret_arn" {
  description = "ARN of the AWS-managed master user secret"
  value       = aws_db_instance.main.master_user_secret[0].secret_arn
}
