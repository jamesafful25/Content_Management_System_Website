
output "bucket_id" {
  description = "Name of the CMS S3 uploads bucket"
  value       = aws_s3_bucket.main.id
}

output "bucket_arn" {
  description = "ARN of the CMS S3 uploads bucket"
  value       = aws_s3_bucket.main.arn
}

output "bucket_domain_name" {
  description = "Regional domain name of the CMS S3 bucket"
  value       = aws_s3_bucket.main.bucket_regional_domain_name
}

output "bucket_region" {
  description = "AWS region containing the CMS S3 bucket"
  value       = aws_s3_bucket.main.region
}
