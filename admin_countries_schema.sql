-- ====================================================================
-- SQL SCHEMA AND SEED DATA FOR DYNAMIC ADMIN COUNTRIES SWITCHER
-- ====================================================================

-- 1. Create table for registered countries / edit contexts
CREATE TABLE IF NOT EXISTS `admin_countries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(10) NOT NULL UNIQUE, -- E.g. 'SG', 'BD', 'MY', 'PK', 'UK', 'IN', 'AE', 'SA', 'BH', 'OM', 'QA', 'KW', 'KE', 'TZ', 'UG', 'LK'
  `name` VARCHAR(100) NOT NULL, -- E.g. 'Singapore', 'Bangladesh'
  `flag` VARCHAR(10) NOT NULL, -- Flag emoji character
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default countries if empty
INSERT IGNORE INTO `admin_countries` (`id`, `code`, `name`, `flag`)
VALUES
  (1, 'SG', 'Singapore', '🇸🇬'),
  (2, 'BD', 'Bangladesh', '🇧🇩'),
  (3, 'MY', 'Malaysia', '🇲🇾'),
  (4, 'PK', 'Pakistan', '🇵🇰'),
  (5, 'UK', 'United Kingdom', '🇬🇧'),
  (6, 'IN', 'India', '🇮🇳'),
  (7, 'AE', 'United Arab Emirates', '🇦🇪'),
  (8, 'SA', 'Saudi Arabia', '🇸🇦'),
  (9, 'BH', 'Bahrain', '🇧🇭'),
  (10, 'OM', 'Oman', '🇴🇲'),
  (11, 'QA', 'Qatar', '🇶🇦'),
  (12, 'KW', 'Kuwait', '🇰🇼'),
  (13, 'KE', 'Kenya', '🇰🇪'),
  (14, 'TZ', 'Tanzania', '🇹🇿'),
  (15, 'UG', 'Uganda', '🇺🇬'),
  (16, 'LK', 'Sri Lanka', '🇱🇰');
