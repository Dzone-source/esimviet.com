-- eSIM Global Database Setup
-- Run this on your MariaDB server before running Prisma migrations

CREATE DATABASE IF NOT EXISTS esim_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'esim_user'@'localhost'
  IDENTIFIED BY 'change_this_password';

GRANT ALL PRIVILEGES ON esim_db.*
  TO 'esim_user'@'localhost';

FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES LIKE 'esim_db';
