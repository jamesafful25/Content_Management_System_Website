
variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "image_scan_on_push" {
  description = "Whether to scan container images for vulnerabilities when pushed"
  type        = bool
  default     = true
}

variable "image_tag_mutability" {
  description = "Whether image tags can be overwritten"
  type        = string
  default     = "IMMUTABLE"

  validation {
    condition = contains(
      ["MUTABLE", "IMMUTABLE"],
      var.image_tag_mutability
    )

    error_message = "Image tag mutability must be MUTABLE or IMMUTABLE."
  }
}
