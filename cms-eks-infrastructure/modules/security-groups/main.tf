
# --------------------------------------------------
# Application Load Balancer Security Group
# --------------------------------------------------

resource "aws_security_group" "alb" {
  name        = "${var.project_name}-${var.environment}-alb-sg"
  description = "Controls public access to the CMS Application Load Balancer"
  vpc_id      = var.vpc_id

  ingress {
    description = "Allow HTTP traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = var.allowed_http_cidrs
  }

  ingress {
    description = "Allow HTTPS traffic"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = var.allowed_https_cidrs
  }

  egress {
    description     = "Allow traffic to CMS frontend on EKS"
    from_port       = var.frontend_port
    to_port         = var.frontend_port
    protocol        = "tcp"
    security_groups = [var.eks_cluster_security_group_id]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-alb-sg"
  }
}

# --------------------------------------------------
# RDS MySQL Security Group
# --------------------------------------------------

resource "aws_security_group" "rds" {
  name        = "${var.project_name}-${var.environment}-rds-sg"
  description = "Allows MySQL access only from the CMS EKS cluster"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow MySQL from CMS EKS"
    from_port       = var.database_port
    to_port         = var.database_port
    protocol        = "tcp"
    security_groups = [var.eks_cluster_security_group_id]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-rds-sg"
  }
}

# --------------------------------------------------
# CodeBuild Security Group
# --------------------------------------------------

resource "aws_security_group" "codebuild" {
  name        = "${var.project_name}-${var.environment}-codebuild-sg"
  description = "Allows private CodeBuild deployments to reach required services"
  vpc_id      = var.vpc_id

  egress {
    description = "Allow HTTPS to AWS services and EKS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-codebuild-sg"
  }
}

# --------------------------------------------------
# Allow ALB Traffic Into EKS Frontend
# --------------------------------------------------

resource "aws_vpc_security_group_ingress_rule" "alb_to_eks_frontend" {
  security_group_id            = var.eks_cluster_security_group_id
  referenced_security_group_id = aws_security_group.alb.id

  description = "Allow CMS ALB traffic to reach the frontend"
  ip_protocol = "tcp"
  from_port   = var.frontend_port
  to_port     = var.frontend_port

  tags = {
    Name = "${var.project_name}-${var.environment}-alb-to-eks-frontend"
  }
}

# --------------------------------------------------
# Allow CodeBuild to Access Private EKS API
# --------------------------------------------------

resource "aws_vpc_security_group_ingress_rule" "codebuild_to_eks_api" {
  security_group_id            = var.eks_cluster_security_group_id
  referenced_security_group_id = aws_security_group.codebuild.id

  description = "Allow private CodeBuild deployments to access the EKS API"
  ip_protocol = "tcp"
  from_port   = 443
  to_port     = 443

  tags = {
    Name = "${var.project_name}-${var.environment}-codebuild-to-eks-api"
  }
}
