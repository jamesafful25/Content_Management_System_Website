
output "github_actions_role_name" {
  description = "Name of the CMS GitHub Actions IAM role"
  value       = aws_iam_role.github_actions.name
}

output "github_actions_role_arn" {
  description = "ARN of the CMS GitHub Actions IAM role"
  value       = aws_iam_role.github_actions.arn
}

output "ecr_push_policy_arn" {
  description = "ARN of the CMS ECR push policy"
  value       = aws_iam_policy.ecr_push.arn
}
