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
VALUES
  -- Ocean Freight
  ('SG', 'ocean-freight', 'Ocean Freight Solutions', 'Connecting you globally with comprehensive ocean freight services', '/lovable-uploads/2505b196-c548-4e6f-b9af-68ce9c9dff10.png', 'Comprehensive Ocean Freight Services', 'GGL’s dedicated ocean freight department specializes in complete freight management services for LCL and FCL loads, supported by a reliable global partner network, offering efficient collection, storage, and delivery from shipper to consignee with customs brokerage.\n\nGGL provides scheduled and multiple services connecting global economies. Our dedicated carrier pricing team offers customized solutions based on client-specific transit and pricing needs.\n\nClients receive shipment milestone notifications through a customizable notification system, reducing unnecessary communication.', '/lovable-uploads/oceanfrieght.jpg', 'Key Features', '["Full Container Load (FCL)","Less than Container Load (LCL)","Customs Brokerage & Clearance","Weekly Scheduled Sailings","End-to-End Tracking"]', 'Ready to Ship Your Cargo?', 'Get a Quote', '/contact'),
  
  -- Air Freight
  ('SG', 'air-freight', 'Air Freight Solutions', 'Fast and reliable global air cargo services for time-critical shipments', '/lovable-uploads/4fca88b2-3d5c-4588-809c-5d8429ca3bfe.png', 'Premium Air Freight Services', 'At GGL, we provide a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams offer seamless air import, export, and express options, all on a convenient door-to-door basis.', '/lovable-uploads/4fca88b2-3d5c-4588-809c-5d8429ca3bfe.png', 'Key Features', '["Time-Definite Deliveries","Cargo Consolidation","Specialized Handling","Real-Time Shipment Tracking","Customs Clearance Support"]', 'Need Fast Shipping?', 'Get a Quote', '/contact'),
  
  -- Transportation
  ('SG', 'transportation', 'Transportation & Distribution', 'Efficient domestic transport and fleet logistics solutions', '/trucks.png', 'Reliable Ground Transportation', 'GGL boasts a dedicated fleet of vehicles to ensure timely domestic distribution and deliveries. Our efficient operational infrastructure provides our clients with high productivity, frequent services, and fast, reliable distribution operations. GGL is committed to delivering excellence in every aspect of transportation and distribution, making us the dependable choice for your logistics needs.', '/trucks.png', 'Key Features', '["Dedicated Fleet Logistics","GPS Tracking & Monitoring","Last-Mile Delivery","Scheduled Distribution","Cross-Border Trucking"]', 'Optimize Your Distribution?', 'Get a Quote', '/contact'),
  
  -- Warehousing
  ('SG', 'warehousing', 'Warehousing Solutions', 'Secure storage, fulfillment, and 3PL supply chain services', '/lovable-uploads/warehouse.jpg', 'Secure Storage & 3PL Logistics', 'GGL is a premier supply chain solutions provider, addressing the full spectrum of logistics needs for our clients. We facilitate the movement of goods from suppliers to manufacturers (for parts and components), from manufacturers and brand owners to resellers and consumers (for finished products), and from consumers back to original equipment manufacturers (for spares and returns).\n\nOur state-of-the-art warehouses are tailored to meet clients\' specific requirements and are supported by cutting-edge WMS systems. These systems offer complete visibility and advanced features such as online picking and reorder cycle notifications.\n\nOur skilled warehouse team is highly experienced and trained to accommodate the unique needs of each client. They are backed by dedicated teams specializing in forwarding and land transportation.', '/lovable-uploads/warehouse.jpg', 'Key Features', '["Inventory Management","Climate Control","Order Fulfillment","Security Systems","Location Tracking","Fast Processing"]', 'Need Warehousing Space?', 'Get a Quote', '/contact'),
  
  -- LCL Consolidation
  ('SG', 'lcl-consolidation', 'LCL Consolidation', 'Global groupage cargo solutions at competitive rates', '/lovable-uploads/lcl.png', 'Neutral LCL Consolidation', 'GGL is a LCL Consolidator with global presence covering North America, UK, Middle East, Indian Sub Continent, South East Asia and Far East. Our LCL Groupage services is backed by very efficient customer support at competitive prices.\n\nThe GGL Group is strategically located in the cargo transhipment hubs of Singapore, Malaysia, Srilanka and Dubai offering direct weekly sailings to all major destinations worldwide.\n\nGGL announces the commencement of its operations in India with the launch of its first office in Mumbai. Offices in Chennai and strategic ICD’s like New Delhi, Pune and Bangalore will follow soon. With this significant development GGL will offer in India a wide spectrum of logistics services including LCL Consolidation, Dangerous Cargo transportation, FCL, Airfreight, Warehousing/3 PL logistics and land transport solutions.\n\nGGL with its internet based software platform offers unmatched shipment visibility from origin to final destination thereby delivering a truly differentiated customer experience.', '/lovable-uploads/lcl.png', 'Key Features', '["Global Network","Container Options","Documentation","Customs Clearance","Cargo Tracking","Specialized Cargo"]', 'Have Smaller Consignments?', 'Get a Quote', '/contact'),
  
  -- Project Cargo
  ('SG', 'project-cargo', 'Project Cargo Logistics', 'Specialized handling and transport of heavy, complex, or high-value shipments', '/lovable-uploads/f06a44a6-0386-4dc9-841d-459b274bf96f.png', 'Complex Project Logistics', 'At GGL, we specialize in managing project cargo—the transportation of large, heavy, high-value, or complex pieces of equipment and materials essential to major infrastructure, engineering, or industrial projects. Our expertise ensures that these shipments receive the customized handling, multimodal transport solutions, and precise coordination needed to meet strict timelines and safety standards.', '/lovable-uploads/f06a44a6-0386-4dc9-841d-459b274bf96f.png', 'Key Features', '["Heavy Lift Transportation","Route Surveys & Feasibility","Custom Clearance Handling","On-site Project Supervision","Risk Management Planning"]', 'Running a Complex Project?', 'Get a Quote', '/contact'),

  -- Customs Clearance
  ('SG', 'customs-clearance', 'Customs Clearance Services', 'Expert solutions for seamless border crossings', '/lovable-uploads/cc.jpg', 'Seamless Customs Clearance Solutions', 'Navigating the complexities of global trade is simplified with our expert customs clearance services. We ensure your shipments move smoothly across borders, handling all aspects of the process from accurate documentation and tariff classification to regulatory compliance and specialized cargo handling.\n\nOur experienced team stays abreast of evolving regulations, leverages advanced technology for expedited clearance, and maintains strong relationships with customs authorities worldwide. We prioritize transparency and open communication, providing real-time updates and peace of mind, allowing you to focus on your core business. Trust us to manage your import and export needs, minimizing delays and ensuring your shipments reach their destinations efficiently and compliantly.', '/lovable-uploads/cc.jpg', 'Key Features', '["Documentation Expertise","Regulatory Compliance","Expert Consultation"]', 'Need Customs Clearance Services?', 'Get a Quote', '/contact'),

  -- Liquid Transportation
  ('SG', 'liquid-transportation', 'Liquid Transportation', 'Specialized solutions for the safe and efficient delivery of liquid cargo', '/lovable-uploads/liquid.jpg', 'Specialized Expertise in Liquid Transportation', 'Transporting liquid cargo demands specialized expertise, and we provide comprehensive solutions ensuring the safe and efficient delivery of your valuable cargo. Understanding the unique challenges of liquid transport, whether chemicals, food-grade products, or other bulk items, we utilize a specialized fleet and equipment, including ISO tanks, flexitanks, and specialized tankers, managed by a team trained in strict safety protocols.\n\nWe offer end-to-end logistics, encompassing pre-shipment planning, route optimization, regulatory compliance, temperature-controlled transportation for sensitive cargo, secure loading/unloading, and real-time tracking. Our commitment to safety and reliability guarantees your cargo arrives in perfect condition and on time, making us a trusted partner for both domestic and international transportation needs.', '/lovable-uploads/liquid.jpg', 'Key Features', '["Specialized Equipment","End-to-End Logistics","Temperature Control","Safety First"]', 'Ready to Transport Your Liquid Cargo?', 'Get a Quote', '/contact')
ON DUPLICATE KEY UPDATE
  `hero_title` = VALUES(`hero_title`),
  `hero_subtitle` = VALUES(`hero_subtitle`),
  `hero_image_url` = VALUES(`hero_image_url`),
  `section1_title` = VALUES(`section1_title`),
  `section1_content` = VALUES(`section1_content`),
  `section1_image_url` = VALUES(`section1_image_url`),
  `features_title` = VALUES(`features_title`),
  `features_list` = VALUES(`features_list`),
  `cta_title` = VALUES(`cta_title`),
  `cta_button_text` = VALUES(`cta_button_text`),
  `cta_button_link` = VALUES(`cta_button_link`);
