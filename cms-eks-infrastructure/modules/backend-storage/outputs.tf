# --------------------------------------------------
# Backend IAM Policy
# --------------------------------------------------

output "backend_storage_policy_arn" {
  description = "ARN of the backend S3 storage IAM policy"
  value       = aws_iam_policy.backend_storage.arn
}


# --------------------------------------------------
# Backend IAM Role
# --------------------------------------------------

output "backend_storage_role_arn" {
  description = "ARN of the CMS backend Pod Identity IAM role"
  value       = aws_iam_role.backend_storage.arn
}


# --------------------------------------------------
# Pod Identity Association
# --------------------------------------------------

output "backend_storage_pod_identity_association_id" {
  description = "ID of the CMS backend Pod Identity association"
  value       = aws_eks_pod_identity_association.backend_storage.association_id
}