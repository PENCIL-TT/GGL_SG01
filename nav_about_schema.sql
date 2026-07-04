-- ====================================================================
-- SQL SCHEMA AND DEFAULT SEED DATA FOR NAVIGATION BAR & ABOUT US PAGES
-- ====================================================================

-- 1. Create table for Navigation Bar settings (Header labels)
CREATE TABLE IF NOT EXISTS `navigation_bar` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `home_label` VARCHAR(100) NOT NULL DEFAULT 'Home',
  `info_label` VARCHAR(100) NOT NULL DEFAULT 'Info',
  `about_label` VARCHAR(100) NOT NULL DEFAULT 'About Us',
  `careers_label` VARCHAR(100) NOT NULL DEFAULT 'Careers',
  `services_label` VARCHAR(100) NOT NULL DEFAULT 'Services',
  `global_presence_label` VARCHAR(100) NOT NULL DEFAULT 'Global Presence',
  `contact_label` VARCHAR(100) NOT NULL DEFAULT 'Contact / Quote',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default navigation bar labels if empty
INSERT INTO `navigation_bar` (`home_label`, `info_label`, `about_label`, `careers_label`, `services_label`, `global_presence_label`, `contact_label`)
SELECT 'Home', 'Info', 'About Us', 'Careers', 'Services', 'Global Presence', 'Contact / Quote'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `navigation_bar`);


-- 2. Create table for country-specific About Us page contents
CREATE TABLE IF NOT EXISTS `about_us_page` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `country_code` VARCHAR(10) NOT NULL UNIQUE,
  `hero_title` VARCHAR(255) NOT NULL,
  `hero_subtitle` TEXT NULL,
  `about_title` VARCHAR(255) NOT NULL,
  `paragraph_1` TEXT NOT NULL,
  `paragraph_2` TEXT NOT NULL,
  `paragraph_3` TEXT NOT NULL,
  `paragraph_4` TEXT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `floating_card_title` VARCHAR(255) NULL,
  `floating_card_subtitle` VARCHAR(255) NULL,
  `final_paragraph` TEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default About Us page contents
INSERT INTO `about_us_page` (
  `country_code`, 
  `hero_title`, 
  `hero_subtitle`, 
  `about_title`, 
  `paragraph_1`, 
  `paragraph_2`, 
  `paragraph_3`, 
  `paragraph_4`, 
  `image_url`, 
  `floating_card_title`, 
  `floating_card_subtitle`, 
  `final_paragraph`
)
SELECT * FROM (
  -- Singapore (SG) / Global
  SELECT 
    'SG' AS country_code, 
    'About GGL' AS hero_title, 
    '' AS hero_subtitle, 
    'About GGL' AS about_title, 
    'GGL is a proud subsidiary of 1 Global Enterprises, a Singapore-based investment group with a robust and diverse portfolio spanning freight forwarding, supply chain management, and logistics technology. As part of this global network, GGL leverages strategic investments across multiple brands specializing in transportation, warehousing, and integrated supply chain solutions.' AS paragraph_1,
    'With a strong foundation backed by 1 Global Enterprises’ industry expertise and innovation-driven approach, GGL delivers seamless, technology-enabled logistics solutions. This affiliation ensures operational excellence, financial stability, and access to world-class infrastructure—positioning GGL as a leading provider of end-to-end global logistics services.' AS paragraph_2,
    'The 1 Global Group operates in 16 countries with a dedicated team of over 700 professionals. Its business verticals include Supply Chain Solutions, Renewable Energy, Information Technology, and Business Process Outsourcing, each managed by domain experts committed to delivering impactful results.' AS paragraph_3,
    NULL AS paragraph_4,
    '/lovable-uploads/41795fb5-562d-45d1-a8d3-f26724bc079b.png' AS image_url,
    '' AS floating_card_title,
    '' AS floating_card_subtitle,
    'With the support of our in-house IT company, we are making significant investments in cutting-edge technologies—including Artificial Intelligence, Automation, and Data Analytics—to optimize operations and enhance transparency, efficiency, and client satisfaction.' AS final_paragraph
  UNION ALL
  -- Bangladesh (BD)
  SELECT 
    'BD', 
    'GGL Bangladesh: Logistics Excellence in Dhaka', 
    'Local expertise powered by our global network to keep Bangladesh supply chains moving by sea, air, and road.', 
    'About Us', 
    'GGL Bangladesh blends global reach with Dhaka-based execution. Our team coordinates LCL consolidation, air freight, and domestic distribution tailored to the Bangladeshi market.', 
    'Strategically positioned in Dhaka with access to Chattogram and air gateways, we connect shippers to worldwide ports through direct weekly sailings and competitive air schedules.', 
    'We prioritize neutral LCL solutions for forwarders and NVOCCs, backed by transparent pricing, reliable cut-offs, and dedicated customer service.', 
    'With modern tracking and documentation support, GGL Bangladesh keeps your cargo visible from factory pickup to final delivery.', 
    '/oceanf.png',
    'Global Network',
    '50+ countries worldwide',
    ''
  UNION ALL
  -- Pakistan (PK)
  SELECT 
    'PK', 
    'GGL Pakistan: Gateway to Global Logistics', 
    'Leading end-to-end logistics solutions connecting Karachi and the world.', 
    'About Us', 
    'GGL Pakistan offers a comprehensive portfolio of supply chain services, integrating ocean freight, air cargo, and inland haulage across Pakistan.', 
    'Based in Karachi with strategic presence at key air and sea ports, we specialize in LCL consolidation and complex project logistics.', 
    'Our commitment is to deliver neutral consolidation solutions, giving local forwarders reliable weekly departures and competitive options.', 
    'We run a technology-driven network to ensure tracking transparency and smooth customs clearance for all imports and exports.', 
    '/oceanf.png',
    'Custom Solutions',
    'Tailored logistic plans',
    ''
  UNION ALL
  -- United Kingdom (UK)
  SELECT 
    'UK', 
    'About GGL UK', 
    'Dynamic logistics solutions supporting UK import, export, and distribution.', 
    'About Us', 
    'GGL UK provides flexible supply chain options that connect the British markets with international logistics hubs.', 
    'From our UK presence, we coordinate customs coordination, road transport, ocean freight, and premium air freight.', 
    'We partner with leading ocean carriers and airlines to secure space allocations, providing reliable schedules year-round.', 
    'Our proactive team is focused on delivering cost-effective and secure shipping solutions for business clients.', 
    '/lovable-uploads/41795fb5-562d-45d1-a8d3-f26724bc079b.png',
    'Global Standards',
    'Highest security & safety',
    ''
  UNION ALL
  -- Malaysia (MY)
  SELECT 
    'MY', 
    'GGL Malaysia: Connecting Port Klang & Pasir Gudang', 
    'Optimized distribution and freight services across Southeast Asia.', 
    'About Us', 
    'GGL Malaysia provides specialized supply chain solutions out of Port Klang and Pasir Gudang to keep cargo moving seamlessly.', 
    'Our local offices coordinate ocean imports/exports, bonded warehousing, customs brokerage, and local distribution.', 
    'We deliver neutral LCL consolidation services tailored to regional freight forwarders and international traders.', 
    'Supported by advanced digital tools, GGL Malaysia ensures full transparency, efficiency, and reliability.', 
    '/oceanf.png',
    'Strategic Locations',
    'Klang & Johor hubs',
    ''
) x
WHERE NOT EXISTS (SELECT 1 FROM `about_us_page`);
