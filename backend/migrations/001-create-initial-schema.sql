-- =====================================================
-- CMS INITIAL DATABASE SCHEMA
-- MySQL 8
-- =====================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'editor', 'author') DEFAULT 'author',
    isActive TINYINT(1) DEFAULT 1,
    avatar VARCHAR(255) DEFAULT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY unique_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    description VARCHAR(300) DEFAULT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY unique_categories_name (name),
    UNIQUE KEY unique_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 3. POSTS TABLE
CREATE TABLE IF NOT EXISTS posts (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL,
    summary VARCHAR(400) DEFAULT NULL,
    content LONGTEXT NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    isFeatured TINYINT(1) DEFAULT 0,
    isPublished TINYINT(1) DEFAULT 0,
    publishedAt DATETIME DEFAULT NULL,
    views INT DEFAULT 0,
    authorId INT DEFAULT NULL,
    categoryId INT DEFAULT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY unique_posts_slug (slug),

    KEY idx_posts_authorId (authorId),
    KEY idx_posts_categoryId (categoryId),

    CONSTRAINT fk_posts_author
        FOREIGN KEY (authorId)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_posts_category
        FOREIGN KEY (categoryId)
        REFERENCES categories(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;