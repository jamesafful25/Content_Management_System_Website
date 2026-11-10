
# --------------------------------------------------
# RDS DB Subnet Group
# --------------------------------------------------

resource "aws_db_subnet_group" "main" {
  name        = "${var.project_name}-${var.environment}-db-subnet-group"
  description = "Private subnet group for the CMS MySQL database"

  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "${var.project_name}-${var.environment}-db-subnet-group"
  }
}


# --------------------------------------------------
# RDS MySQL Database
# --------------------------------------------------

resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-${var.environment}-mysql"

  engine         = "mysql"
  engine_version = var.engine_version
  instance_class = var.instance_class

  allocated_storage = var.allocated_storage
  storage_type      = "gp3"
  storage_encrypted = true

  db_name  = var.database_name
  username = var.master_username

  # AWS generates and manages the database master password.
  manage_master_user_password = true

  port = 3306

  # Private network configuration.
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.rds_security_group_id]
  publicly_accessible    = false

  # Development database availability and backup settings.
  multi_az                = false
  backup_retention_period = var.backup_retention_period
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"

  # Protect the database from accidental deletion.
  deletion_protection = true

  # Do not create a final snapshot automatically on deletion.
  # Deletion protection must first be disabled explicitly.
  skip_final_snapshot = true

  # Avoid unnecessary minor-version changes.
  auto_minor_version_upgrade = false

  tags = {
    Name = "${var.project_name}-${var.environment}-mysql"
  }
}
