output "eks_log_group_name" {
  description = "CloudWatch log group for EKS control plane logs"
  value       = aws_cloudwatch_log_group.eks_control_plane.name
}

output "eks_log_group_arn" {
  description = "ARN of the EKS control plane CloudWatch log group"
  value       = aws_cloudwatch_log_group.eks_control_plane.arn
}