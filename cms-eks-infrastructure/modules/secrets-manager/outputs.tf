output "jwt_secret_arn" {
  description = "ARN of the CMS application JWT secret"
  value       = aws_secretsmanager_secret.jwt_secret.arn
}

output "jwt_secret_name" {
  description = "Name of the CMS application JWT secret"
  value       = aws_secretsmanager_secret.jwt_secret.name
}

output "runtime_db_secret_arn" {
  description = "ARN of the CMS runtime database secret"
  value       = aws_secretsmanager_secret.runtime_db.arn
}

output "migration_db_secret_arn" {
  description = "ARN of the CMS migration database secret"
  value       = aws_secretsmanager_secret.migration_db.arn
}