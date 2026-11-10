# --------------------------------------------------
# CMS Application JWT Secret
# --------------------------------------------------

resource "aws_secretsmanager_secret" "jwt_secret" {
  name        = "${var.project_name}/${var.environment}/application/jwt-secret"
  description = "JWT signing secret for the CMS backend application"

  recovery_window_in_days = 7

  tags = {
    Name        = "${var.project_name}-${var.environment}-jwt-secret"
    Project     = var.project_name
    Environment = var.environment
  }
}

# --------------------------------------------------
# CMS Migration Database Secret
# --------------------------------------------------

resource "aws_secretsmanager_secret" "migration_db" {
  name        = "${var.project_name}/${var.environment}/database/migration"
  description = "Database migration credentials for the CMS"

  recovery_window_in_days = 7

  tags = {
    Name        = "${var.project_name}-${var.environment}-migration-db-secret"
    Project     = var.project_name
    Environment = var.environment
  }
}

# --------------------------------------------------
# CMS Runtime Database Secret
# --------------------------------------------------

resource "aws_secretsmanager_secret" "runtime_db" {
  name        = "${var.project_name}/${var.environment}/database/runtime"
  description = "Runtime database credentials for the CMS backend"

  recovery_window_in_days = 7

  tags = {
    Name        = "${var.project_name}-${var.environment}-runtime-db-secret"
    Project     = var.project_name
    Environment = var.environment
  }
}
