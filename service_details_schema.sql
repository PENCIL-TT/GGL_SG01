-- ====================================================================
-- SQL SCHEMA AND DEFAULT SEED DATA FOR SERVICES DETAILED PAGES
-- ====================================================================

-- 1. Create table for Service Details page settings
CREATE TABLE IF NOT EXISTS `service_details` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `country_code` VARCHAR(10) NOT NULL,
  `service_slug` VARCHAR(100) NOT NULL,
  `hero_title` VARCHAR(255) NULL,
  `hero_subtitle` TEXT NULL,
  `hero_image_url` VARCHAR(255) NULL,
  `section1_title` VARCHAR(255) NULL,
  `section1_content` TEXT NULL,
  `section1_image_url` VARCHAR(255) NULL,
  `features_title` VARCHAR(255) NULL,
  `features_list` TEXT NULL, -- Stored as a JSON stringified array of features
  `cta_title` VARCHAR(255) NULL,
  `cta_button_text` VARCHAR(255) NULL,
  `cta_button_link` VARCHAR(255) NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `country_service` (`country_code`, `service_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default Service details if empty
INSERT INTO `service_details` (
  `country_code`, 
  `service_slug`, 
  `hero_title`, 
  `hero_subtitle`, 
  `hero_image_url`, 
  `section1_title`, 
  `section1_content`, 
  `section1_image_url`, 
  `features_title`, 
  `features_list`, 
  `cta_title`, 
  `cta_button_text`, 
  `cta_button_link`
)
SELECT * FROM (
  -- Singapore (SG) / Global
  SELECT 'SG' AS country_code, 'ocean-freight' AS service_slug, 'Ocean Freight Solutions' AS hero_title, 'Connecting you globally with comprehensive ocean freight services' AS hero_subtitle, '/lovable-uploads/2505b196-c548-4e6f-b9af-68ce9c9dff10.png' AS hero_image_url, 'Comprehensive Ocean Freight Services' AS section1_title, 'GGL’s dedicated ocean freight department specializes in complete freight management services for LCL and FCL loads, supported by a reliable global partner network, offering efficient collection, storage, and delivery from shipper to consignee with customs brokerage.' AS section1_content, '/lovable-uploads/oceanfrieght.jpg' AS section1_image_url, 'Key Features' AS features_title, '["Full Container Load (FCL)","Less than Container Load (LCL)","Customs Brokerage & Clearance","Weekly Scheduled Sailings","End-to-End Tracking"]' AS features_list, 'Ready to Ship Your Cargo?' AS cta_title, 'Get a Quote' AS cta_button_text, '/contact' AS cta_button_link UNION ALL
  SELECT 'SG', 'air-freight', 'Air Freight Solutions', 'Fast and reliable global air cargo services for time-critical shipments', '/cargoplane.png', 'Premium Air Freight Services', 'At GGL, we provide a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams offer seamless air import, export, and express options, all on a convenient door-to-door basis.', '/cargoplane.png', 'Key Features', '["Priority Air Freight","Door-to-Door Delivery","Express Air Courier","Temperature-Controlled Shipping","Dangerous Goods Handling"]', 'Need Fast Shipping?', 'Get a Quote', '/contact' UNION ALL
  SELECT 'SG', 'transportation', 'Transportation & Distribution', 'Efficient domestic transport and fleet logistics solutions', '/truck12.png', 'Reliable Ground Transportation', 'GGL boasts a dedicated fleet of vehicles to ensure timely domestic distribution and deliveries. Our efficient operational infrastructure provides our clients with high productivity, frequent services, and fast, reliable distribution operations.', '/truck12.png', 'Key Features', '["Dedicated Fleet Logistics","GPS Tracking & Monitoring","Last-Mile Delivery","Scheduled Distribution","Cross-Border Trucking"]', 'Optimize Your Distribution?', 'Get a Quote', '/contact' UNION ALL
  SELECT 'SG', 'warehousing', 'Warehousing Solutions', 'Secure storage, fulfillment, and 3PL supply chain services', '/lovable-uploads/warehouse.jpg', 'Secure Storage & 3PL Logistics', 'GGL is a premier supply chain solutions provider, addressing the full spectrum of logistics needs for our clients. We facilitate the movement of goods from suppliers to manufacturers, resellers, and distributors.', '/lovable-uploads/warehouse.jpg', 'Key Features', '["Secure Storage & Vaults","Inventory Management","Pick and Pack Fulfillment","3PL & 4PL Logistics","Cross-Docking Services"]', 'Need Warehousing Space?', 'Get a Quote', '/contact' UNION ALL
  SELECT 'SG', 'lcl-consolidation', 'LCL Consolidation', 'Global groupage cargo solutions at competitive rates', '/lcl.png', 'Neutral LCL Consolidation', 'GGL is a leading LCL Consolidator with a robust global presence. We compile weekly consolidation services to key transshipment hubs, providing reliable groupage options with full support.', '/lcl.png', 'Key Features', '["Direct Weekly Departures","Neutral Consolidation","Global Network Hubs","Competitive Freight Pricing","Cargo Care & Security"]', 'Have Smaller Consignments?', 'Get a Quote', '/contact' UNION ALL
  SELECT 'SG', 'project-cargo', 'Project Cargo Logistics', 'Specialized handling and transport of heavy, complex, or high-value shipments', '/projectcargo3.png', 'Complex Project Logistics', 'Project cargo refers to the specialized transportation of large, heavy, high-value, or complex equipment, often associated with large-scale infrastructure, energy, or construction projects.', '/projectcargo3.png', 'Key Features', '["Heavy Lift Transportation","Route Surveys & Feasibility","Custom Clearance Handling","On-site Project Supervision","Risk Management Planning"]', 'Running a Complex Project?', 'Get a Quote', '/contact'
) x
WHERE NOT EXISTS (SELECT 1 FROM `service_details` WHERE `country_code` = 'SG');
