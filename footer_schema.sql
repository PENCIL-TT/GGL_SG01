-- Footer Settings Schema & Seed Data
-- Run this SQL in your Hostinger MySQL database (e.g. via phpMyAdmin) to initialize the footer tables.

-- 1. Create table for general footer settings (About Text, Facebook, LinkedIn URLs)
CREATE TABLE IF NOT EXISTS `footer_general` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `about_text` TEXT NOT NULL,
  `facebook_url` VARCHAR(255) NULL,
  `linkedin_url` VARCHAR(255) NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default general settings if empty
INSERT INTO `footer_general` (`about_text`, `facebook_url`, `linkedin_url`)
SELECT 
  'At GGL, we are proud to be one of Singapore''s leading logistics companies. We offer specialized divisions in warehousing, forwarding (air and ocean), and transportation. Our mission is to deliver comprehensive end-to-end solutions in global freight forwarding, managed through a trusted network of partners who excel in all logistics segments.',
  'https://www.facebook.com/gglusa',
  'https://www.linkedin.com/company/gglus/'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `footer_general`);

-- 2. Create table for country-specific footer office locations
CREATE TABLE IF NOT EXISTS `footer_content` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `country_code` VARCHAR(10) NOT NULL,
  `office_index` INT NOT NULL DEFAULT 0,
  `title` VARCHAR(255) NOT NULL,
  `address` TEXT NOT NULL,
  `phone` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `country_office` (`country_code`, `office_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default office locations if empty
INSERT INTO `footer_content` (`country_code`, `office_index`, `title`, `address`, `phone`, `email`)
SELECT * FROM (
  SELECT 'SG' AS country_code, 0 AS office_index, 'GGL (Singapore) Pte Ltd.' AS title, 'Blk 511 Kampong Bahru Road\n#03-01 Keppel Distripark\nSingapore - 099447' AS address, '+65 69080838' AS phone, 'june@ggl.sg' AS email UNION ALL
  SELECT 'BD', 0, 'GGL (Bangladesh) Ltd.', 'ID #9-N (New), 9-M(Old-N), 9th floor, Tower 1, Police Plaza Concord No.2, Road # 144, Gulshan Model Town, Dhaka 1215, Bangladesh', '', 'info.bd@ggl.sg' UNION ALL
  SELECT 'PK', 0, 'GGL (Pakistan) - Karachi', 'Suite No. 507 & 508, 5th Floor Fortune Center, Block-6, P.E.C.H.S, Shahrah-e-Faisal, Karachi, Pakistan.', '+92 21 34542881 / +92 21 34542882 / +92 21 34542883 / +92 21 34542884', 'info.pk@ggl.sg' UNION ALL
  SELECT 'UK', 0, 'GGL (UK) Ltd.', '15 Woodlands Park Villas, North Gosforth , NE136PR , Newcastle Upon Tyne, United Kingdom.', '+44(0)7305 856 612', 'Sukant@ggl.sg' UNION ALL
  SELECT 'MY', 0, 'GGL (Malaysia) - Port Klang', 'MTBBT 2, 3A-5, Jalan Batu Nilam 16, The Landmark (Behind AEON Mall), Bandar Bukit Tinggi 2, 41200 Klang, Selangor D.E', '+603 - 3319 2778 / 74 / 75', 'jayesh@ggl.sg' UNION ALL
  SELECT 'MY', 1, 'GGL (Malaysia) - Pasir Gudang', 'Unit 20-03A, Level 20 Menara Zurich, 15 Jalan Dato Abdullah Tahir, 80300 Johor Bahru', '603-3319 2778 / 74 / 75, 79', 'jayesh@ggl.sg'
) x
WHERE NOT EXISTS (SELECT 1 FROM `footer_content`);
