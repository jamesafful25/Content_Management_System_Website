
output "alb_security_group_id" {
  description = "Security group ID for the CMS Application Load Balancer"
  value       = aws_security_group.alb.id
}

output "alb_security_group_name" {
  description = "Security group name for the CMS Application Load Balancer"
  value       = aws_security_group.alb.name
}

output "rds_security_group_id" {
  description = "Security group ID for the CMS RDS database"
  value       = aws_security_group.rds.id
}

output "rds_security_group_name" {
  description = "Security group name for the CMS RDS database"
  value       = aws_security_group.rds.name
}

output "codebuild_security_group_id" {
  description = "Security group ID for private CMS CodeBuild deployments"
  value       = aws_security_group.codebuild.id
}

output "codebuild_security_group_name" {
  description = "Security group name for private CMS CodeBuild deployments"
  value       = aws_security_group.codebuild.name
}