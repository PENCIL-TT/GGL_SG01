-- ====================================================================
-- SQL SCHEMA AND MIGRATION FOR GLOBAL PRESENCE (MAP & OFFICE ADDRESSES)
-- ====================================================================

-- 1. Create global_presence_content table and support dynamic map iframe link
CREATE TABLE IF NOT EXISTS `global_presence_content` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `country_code` VARCHAR(10) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `content_paragraph` TEXT NOT NULL,
  `button_text` VARCHAR(100) NOT NULL,
  `link_path` VARCHAR(255) NOT NULL,
  `map_iframe_url` TEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Truncate content records for clean rebuild
TRUNCATE TABLE `global_presence_content`;

-- Populate global presence content for the 15 requested countries
INSERT INTO `global_presence_content` 
  (`country_code`, `title`, `content_paragraph`, `button_text`, `link_path`, `map_iframe_url`)
VALUES
  ('SG', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('BD', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/bangladesh/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('MY', 'Global Network, Local Expertise', 'From our hubs in Malaysia, we connect you to GGL\'s extensive global network, ensuring your cargo reaches any corner of the world with the same reliability and care.', 'Explore Our Global Presence', '/malaysia/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('UK', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/uk/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('IN', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/india/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('AE', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/ae/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('SA', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/sa/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('QA', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/qa/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('LK', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/lk/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('AU', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/au/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('CN', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/cn/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('ID', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/id/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('MM', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/mm/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('TH', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/th/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('US', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/us/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1');

-- 2. Create table for Global Presence Offices / Map markers
CREATE TABLE IF NOT EXISTS `global_presence_offices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `country_code` VARCHAR(10) NOT NULL,
  `office_country` VARCHAR(100) NOT NULL,
  `city_name` VARCHAR(100) NOT NULL,
  `office_name` VARCHAR(255) NOT NULL,
  `address` TEXT NOT NULL,
  `phone` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `latitude` DECIMAL(10, 8) NOT NULL DEFAULT 0.00000000,
  `longitude` DECIMAL(11, 8) NOT NULL DEFAULT 0.00000000,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Truncate offices records for clean rebuild
TRUNCATE TABLE `global_presence_offices`;

-- Populate 28 global presence office markers representing the 15 countries
INSERT INTO `global_presence_offices`
  (`id`, `country_code`, `office_country`, `city_name`, `office_name`, `address`, `phone`, `email`, `latitude`, `longitude`)
VALUES
  (1, 'sg', 'Singapore', 'Singapore', 'GGL (Singapore) Pte Ltd.', 'Blk 511 Kampong Bahru Road #03-01 Keppel Distripark, Singapore - 099447', '+65 69080838', 'june@ggl.sg', 1.27660000, 103.82900000),
  (2, 'my', 'Malaysia', 'PASIRGUDANG', 'GGL (Malaysia) Pasir Gudang', 'Unit 20-03A, Level 20 Menara Zurich, 15 Jalan Dato Abdullah Tahir, 80300 Johor Bahru', '+603-3319 2778 / 74 / 75, 79', 'info@oecl.sg', 1.48420000, 103.76290000),
  (3, 'my', 'Malaysia', 'PORTKLANG', 'GGL (Malaysia) Port Klang', 'MTBBT 2, 3A-5, Jalan Batu Nilam 16, The Landmark (Behind AEON Mall), Bandar Bukit Tinggi 2, 41200 Klang, Selangor D.E', '+603-3319 2778 / 74 / 75', 'info@oecl.sg', 2.99820000, 101.38310000),
  (4, 'ae', 'United Arab Emirates (UAE)', 'Dubai', 'GGL (UAE) Dubai', 'Office # 509, Al Nazar Plaza, Oud Metha, Dubai, U.A.E', '+971 4 3433388', 'info.dubai@ggl.sg', 25.20480000, 55.27080000),
  (5, 'in', 'India', 'Kochi', 'GGL (India) Kochi', 'CC 59/801A Elizabeth Memorial Building, Thevara Ferry Jn, Cochin 682013, Kerala.', '+91 484 4019192 / 93', 'info.india@ggl.sg', 9.93230000, 76.29960000),
  (6, 'in', 'India', 'Mumbai', 'GGL (India) Mumbai', '803 / 804, Shelton Cubix, Plot No. 87, Sector-15, CBD Belapur, Navi Mumbai, Maharashtra - 400614.', '022-35131688 / 35113475 / 35082586', 'info.india@ggl.sg', 19.01123000, 73.03715000),
  (7, 'in', 'India', 'Mumbai-Andheri', 'GGL (India) Mumbai-Andheri', '503, Midas, Sahar Plaza Complex, Sir M.V Road, Andheri East, Mumbai 400059', '+91 8879756838', 'info.india@ggl.sg', 19.11303000, 72.86848000),
  (8, 'in', 'India', 'Ludhiana', 'GGL (India) Ludhiana', 'No. 7A, G K Estate, Hari Nagar, Mundian Kalan, Chandigarh Road, Ludhiana, Punjab - 141015', '+91 62845 49881', 'navjot.kohli@ggl.sg', 30.89135000, 75.93255000),
  (9, 'in', 'India', 'Delhi', 'GGL (India) Delhi', '903, Surya Kiran Building K.G Marg, Connaught Place, New Delhi - 110001', '+91 11 493224477 / 48 / 49', 'info.india@ggl.sg', 28.62748000, 77.22210000),
  (10, 'in', 'India', 'Bangalore', 'GGL (India) Bangalore', '3C-964 IIIrd Cross Street, HRBR LAYOUT 1st Block, Kalyan Nagar Bannaswadi, Bengaluru - 560043.', '+91 9841676259', 'info.india@ggl.sg', 13.01855000, 77.64191000),
  (11, 'in', 'India', 'Kolkata', 'GGL (India) Kolkata', 'Merlin Matrix, 3rd floor, Room No. 303 10, D. N. BLOCK, SECTOR - V SALT LAKE CITY, Kolkata - 700091', '+91 33 46025458 / 59 / 60 / 61', 'info.india@ggl.sg', 22.57690000, 88.43410000),
  (12, 'bd', 'Bangladesh', 'Dhaka', 'GGL (Bangladesh) Ltd.', 'ID #9-N (New), 9-M(Old-N), 9th floor, Tower 1, Police Plaza Concord No.2, Road # 144, Gulshan Model Town, Dhaka 1215, Bangladesh', '+880 1716 620989', 'info.bd@ggl.sg', 23.77880000, 90.41960000),
  (13, 'gb', 'United Kingdom', 'London', 'GGL (UK) Ltd. London', '167-169 Great Portland Street 5th Floor, London W1W 5PF, United Kingdom', '+44 (0) 203 393 9508', 'Sukant@ggl.sg', 51.50740000, -0.12780000),
  (14, 'gb', 'United Kingdom', 'Newcastle', 'GGL (UK) Ltd. Newcastle', '15 Woodlands Park Villas, North Gosforth, NE136PR, Newcastle Upon Tyne, United Kingdom.', '+44(0)7305 856 612', 'Sukant@ggl.sg', 55.00840000, -1.61740000),
  (15, 'us', 'United States (USA)', 'Chicago', 'GGL (USA) Chicago', '939 W. North Avenue, Suite 750, Chicago, IL 60642', '+1 847 254 7320', 'info@gglusa.us', 41.86220000, -87.72090000),
  (16, 'us', 'United States (USA)', 'New York', 'GGL (USA) New York', 'New Jersey Branch, 33 Wood Avenue South Suite 600, Iselin, NJ 08830', '+1 732 456 6780', 'info@gglusa.us', 37.45450000, -122.18180000),
  (17, 'us', 'United States (USA)', 'Los Angeles', 'GGL (USA) Los Angeles', '2250 South Central Avenue Compton, CA 90220', '+1 310 928 3903', 'info@gglusa.us', 34.05220000, -118.24370000),
  (18, 'qa', 'Qatar', 'Doha', 'GGL (Qatar) - Doha', 'Office no: 48, 2nd Floor, Al matar Centre, Old Airport Road Doha', '0974 33622555', 'info.qa@ggl.sg', 25.27698700, 51.52000800),
  (19, 'cn', 'China', 'Shenzhen', 'GGL (China) Shenzhen', '13C02, Block A, Zhaoxin Huijin Plaza 3085 Shennan East Road, Luohu, Shenzhen.', '+86 75582222447', 'helen@haixun.co', 22.54262000, 114.11696000),
  (20, 'sa', 'Saudi Arabia', 'Dammam', 'GGL (Saudi Arabia) - Dammam', 'Building No.2817, Secondary No9403, King Faisal Road, Al Tubebayshi Dist, Dammam, KSA 32233', '+966 13 343 0003', 'info.sa@ggl.sg', 26.42070000, 50.08880000),
  (21, 'sa', 'Saudi Arabia', 'Riyadh', 'GGL (Saudi Arabia) - Riyadh', 'Room No. T18, Rail Business Centre, Bldg No. 3823, Omar Aimukhtar St, Thulaim, Riyadh 11332', '+966 11295 0020', 'info.sa@ggl.sg', 24.71360000, 46.67530000),
  (22, 'sa', 'Saudi Arabia', 'Jeddah', 'GGL (Saudi Arabia) - Jeddah', 'Al-Madinah Al-Munawarah Road, Al Sharafeyah, Jeddah 4542 -22234, Kingdom of Saudi Arabia', '+966 12 578 0874', 'info.sa@ggl.sg', 21.48580000, 39.19250000),
  (23, 'id', 'Indonesia', 'Jakarta', 'GGL (Indonesia) - Jakarta', '408, Lina Building, JL.HR Rasuna Said kav B7, Jakarta', '+62 21 529 20292, 522 4887', 'logistics.jkt@oecl.sg', -6.20880000, 106.84560000),
  (24, 'id', 'Indonesia', 'Surabaya', 'GGL (Indonesia) - Surabaya', 'Japfa Indoland Center, Japfa Tower 1, Lantai 4/401-A JL Jend, Basuki Rahmat 129-137, Surabaya 60271', '+62 21 529 20292, 522 4887', 'logistics.jkt@oecl.sg', -7.25750000, 112.75210000),
  (25, 'lk', 'Sri Lanka', 'Colombo', 'GGL (Sri Lanka) - Colombo', 'Ceylinco House, 9th Floor, No. 69, Janadhipathi Mawatha, Colombo 01, Sri Lanka', '+94 114477499 / +94 114477494 / 98', 'info.cmb@globalconsol.com', 6.92710000, 79.86120000),
  (26, 'th', 'Thailand', 'Bangkok', 'GGL (Thailand) - Bangkok', '109 CCT Building, 3rd Floor, Rm.3, Surawong Road, Suriyawongse, Bangrak, Bangkok 10500 109', '+662-634-3240 / +662-634-3942', 'info@oecl.sg', 13.72957000, 100.53095000),
  (27, 'mm', 'Myanmar', 'Yangon', 'GGL (Myanmar) - Yangon', 'No.608, Room 8B, Bo Soon Pat Tower, Merchant Street, Pabedan Township, Yangon, Myanmar', '+951 243158 / +951 377985, 243101', 'info@globalconsol.com', 16.84090000, 96.17350000),
  (28, 'au', 'Australia', 'Melbourne', 'GGL (Australia) - Melbourne', 'Suite 5, 7-9 Mallet Road, Tullamarine, Victoria, 3043', 'Mob: +61 432254969 / Tel: +61 388205157', 'info@gglaustralia.com', -37.81360000, 144.96310000);

-- 3. Create contact_page_content table and support dynamic map iframe link
CREATE TABLE IF NOT EXISTS `contact_page_content` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `country_code` VARCHAR(10) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL DEFAULT 'Get in Touch',
  `subtitle` TEXT NOT NULL,
  `email_recipient` VARCHAR(255) NOT NULL DEFAULT 'june@ggl.sg',
  `phone` VARCHAR(255) NOT NULL DEFAULT '+65 69080838',
  `address` TEXT NOT NULL,
  `map_iframe_url` TEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Truncate content records for clean rebuild
TRUNCATE TABLE `contact_page_content`;

-- Seed default contact_page_content records for the 15 requested countries
INSERT INTO `contact_page_content` 
  (`country_code`, `title`, `subtitle`, `email_recipient`, `phone`, `address`, `map_iframe_url`) 
VALUES 
  ('SG', 'Get in Touch', 'We\'re here to help and answer any questions you might have.', 'June@ggl.sg', '+65 69080838', 'GGL (Singapore) Pte Ltd. Blk 511 Kampong Bahru Road #03-01 Keppel Distripark, Singapore - 099447', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('BD', 'Get in Touch', 'We\'re here to help and answer any questions you might have.', 'info.bd@ggl.sg', '+880 1716 620989', 'ID #9-N (New), 9-M(Old-N), 9th floor, Tower 1, Police Plaza Concord No.2, Road # 144, Gulshan Model Town, Dhaka 1215, Bangladesh', 'https://www.google.com/maps/d/embed?mid=1n4WqX2KvVrDhYom0GMJ0FxbmZsRY8aQ&ehbc=2E312F&noprof=1'),
  ('MY', 'Contact Us - Malaysia', 'Get in touch with our Malaysia branches.', 'jayesh@ggl.sg', '+603 - 3319 2778 / 74 / 75', 'Port Klang Office: MTBBT 2, 3A-5, Jalan Batu Nilam 16, The Landmark (Behind AEON Mall), Bandar Bukit Tinggi 2, 41200 Klang, Selangor D.E', 'https://www.google.com/maps?q=The+Landmark+Bandar+Bukit+Tinggi+2+Klang&output=embed'),
  ('UK', 'Contact Us - UK', 'Get in touch with our UK branches.', 'Sukant@ggl.sg', '+44(0)7305 856 612', '15 Woodlands Park Villas, North Gosforth , NE136PR , Newcastle Upon Tyne, United Kingdom.', 'https://www.google.com/maps?q=167-169+Great+Portland+Street+London+W1W+5PF&output=embed'),
  ('IN', 'Contact Us - India', 'Get in touch with our India offices.', 'info.india@ggl.sg', '+91 484 4019192 / 93', 'CC 59/801A Elizabeth Memorial Building, Thevara Ferry Jn, Cochin 682013, Kerala.', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('AE', 'Contact Us - UAE', 'Get in touch with our UAE office.', 'info.dubai@ggl.sg', '+971 4 3433388', 'Office # 509, Al Nazar Plaza, Oud Metha, Dubai, U.A.E', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('SA', 'Contact Us - Saudi Arabia', 'Get in touch with our Saudi Arabia offices.', 'info.sa@ggl.sg', '+966 13 343 0003', 'Building No.2817, Secondary No9403, King Faisal Road, Al Tubebayshi Dist, Dammam, KSA 32233', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('QA', 'Contact Us - Qatar', 'Get in touch with our Qatar office.', 'info.qa@ggl.sg', '0974 33622555', 'Office no: 48, 2nd Floor, Al matar Centre, Old Airport Road Doha', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('LK', 'Contact Us - Sri Lanka', 'Get in touch with our Sri Lanka office.', 'info.cmb@globalconsol.com', '+94 114477499', 'Ceylinco House, 9th Floor, No. 69, Janadhipathi Mawatha, Colombo 01, Sri Lanka', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('AU', 'Contact Us - Australia', 'Get in touch with our Australia office.', 'info@gglaustralia.com', 'Mob: +61 432254969 / Tel: +61 388205157', 'Suite 5, 7-9 Mallet Road, Tullamarine, Victoria, 3043', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('CN', 'Contact Us - China', 'Get in touch with our China office.', 'helen@haixun.co', '+86 75582222447', '13C02, Block A, Zhaoxin Huijin Plaza 3085 Shennan East Road, Luohu, Shenzhen.', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('ID', 'Contact Us - Indonesia', 'Get in touch with our Indonesia office.', 'logistics.jkt@oecl.sg', '+62 21 529 20292, 522 4887', '408, Lina Building, JL.HR Rasuna Said kav B7, Jakarta', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('MM', 'Contact Us - Myanmar', 'Get in touch with our Myanmar office.', 'info@globalconsol.com', '+951 243158', 'No.608, Room 8B, Bo Soon Pat Tower, Merchant Street, Pabedan Township, Yangon, Myanmar', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('TH', 'Contact Us - Thailand', 'Get in touch with our Thailand office.', 'info@oecl.sg', '+662-634-3240', '109 CCT Building, 3rd Floor, Rm.3, Surawong Road, Suriyawongse, Bangrak, Bangkok 10500 109', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
  ('US', 'Contact Us - USA', 'Get in touch with our USA offices.', 'info@gglusa.us', '+1 847 254 7320', '939 W. North Avenue, Suite 750, Chicago, IL 60642');
