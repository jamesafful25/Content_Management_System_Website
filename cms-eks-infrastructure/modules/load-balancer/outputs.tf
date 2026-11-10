
# --------------------------------------------------
# Pod Identity Agent
# --------------------------------------------------

output "pod_identity_agent_addon_arn" {
  description = "ARN of the EKS Pod Identity Agent add-on"
  value       = aws_eks_addon.pod_identity_agent.arn
}


# --------------------------------------------------
# Controller IAM Policy
# --------------------------------------------------

output "load_balancer_controller_policy_arn" {
  description = "ARN of the AWS Load Balancer Controller IAM policy"
  value       = aws_iam_policy.load_balancer_controller.arn
}


# --------------------------------------------------
# Controller IAM Role
# --------------------------------------------------

output "load_balancer_controller_role_arn" {
  description = "ARN of the AWS Load Balancer Controller IAM role"
  value       = aws_iam_role.load_balancer_controller.arn
}


# --------------------------------------------------
# Pod Identity Association
# --------------------------------------------------

output "load_balancer_controller_pod_identity_association_id" {
  description = "ID of the AWS Load Balancer Controller Pod Identity association"
  value       = aws_eks_pod_identity_association.load_balancer_controller.association_id
}
