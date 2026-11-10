
# --------------------------------------------------
# External Secrets Operator IAM Policy
# --------------------------------------------------

output "external_secrets_policy_arn" {
  description = "ARN of the External Secrets Operator IAM policy"
  value       = aws_iam_policy.external_secrets.arn
}


# --------------------------------------------------
# External Secrets Operator IAM Role
# --------------------------------------------------

output "external_secrets_role_arn" {
  description = "ARN of the External Secrets Operator IAM role"
  value       = aws_iam_role.external_secrets.arn
}


# --------------------------------------------------
# EKS Pod Identity Association
# --------------------------------------------------

output "external_secrets_pod_identity_association_id" {
  description = "ID of the External Secrets Operator Pod Identity association"
  value       = aws_eks_pod_identity_association.external_secrets.association_id
}
