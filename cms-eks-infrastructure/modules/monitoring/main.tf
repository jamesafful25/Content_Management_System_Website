# --------------------------------------------------
# EKS Control Plane CloudWatch Log Group
# --------------------------------------------------

resource "aws_cloudwatch_log_group" "eks_control_plane" {
  name              = "/aws/eks/${var.cluster_name}/cluster"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "${var.project_name}-${var.environment}-eks-logs"
    Project     = var.project_name
    Environment = var.environment
  }
}

# --------------------------------------------------
# RDS High CPU Utilization Alarm
# --------------------------------------------------

resource "aws_cloudwatch_metric_alarm" "rds_high_cpu" {
  alarm_name        = "${var.project_name}-${var.environment}-rds-high-cpu"
  alarm_description = "RDS CPU utilization has exceeded the configured threshold."

  namespace   = "AWS/RDS"
  metric_name = "CPUUtilization"
  statistic   = "Average"
  period      = 300

  evaluation_periods  = 2
  datapoints_to_alarm = 2

  comparison_operator = "GreaterThanThreshold"
  threshold           = var.rds_cpu_threshold

  treat_missing_data = "notBreaching"

  dimensions = {
    DBInstanceIdentifier = var.db_instance_identifier
  }

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

# --------------------------------------------------
# RDS Low Free Storage Alarm
# --------------------------------------------------

resource "aws_cloudwatch_metric_alarm" "rds_low_storage" {
  alarm_name        = "${var.project_name}-${var.environment}-rds-low-storage"
  alarm_description = "RDS free storage has fallen below the configured threshold."

  namespace   = "AWS/RDS"
  metric_name = "FreeStorageSpace"
  statistic   = "Average"
  period      = 300

  evaluation_periods  = 2
  datapoints_to_alarm = 2

  comparison_operator = "LessThanThreshold"
  threshold           = var.rds_free_storage_threshold_bytes

  treat_missing_data = "notBreaching"

  dimensions = {
    DBInstanceIdentifier = var.db_instance_identifier
  }

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}