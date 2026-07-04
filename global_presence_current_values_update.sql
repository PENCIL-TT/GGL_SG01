-- ====================================================================
-- LIVE VALUES pulled from the DB on 2026-07-03.
-- Edit the values below, then run the statements you need in phpMyAdmin
-- (or via `mysql` CLI) to update content directly, bypassing the admin panel.
-- ====================================================================


-- ============================================================
-- 1. GLOBAL PRESENCE PAGE CONTENT (title / paragraph / button / link / map)
--    Table: global_presence_content
--    One row per country_code. Edit the VALUES and run the one row you need.
-- ============================================================

UPDATE `global_presence_content` SET
  `title` = 'Global Presence',
  `content_paragraph` = 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
  `button_text` = 'Explore Our Global Network',
  `link_path` = '/global-presence',
  `map_iframe_url` = 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'
WHERE `country_code` = 'SG';

UPDATE `global_presence_content` SET
  `title` = 'Global Presence',
  `content_paragraph` = 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
  `button_text` = 'Explore Our Global Network',
  `link_path` = '/bangladesh/global-presence',
  `map_iframe_url` = 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'
WHERE `country_code` = 'BD';

UPDATE `global_presence_content` SET
  `title` = 'Global Network, Local Expertise',
  `content_paragraph` = 'From our hubs in Malaysia, we connect you to GGL''s extensive global network, ensuring your cargo reaches any corner of the world with the same reliability and care.',
  `button_text` = 'Explore Our Global Presence',
  `link_path` = '/malaysia/global-presence',
  `map_iframe_url` = 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'
WHERE `country_code` = 'MY';

UPDATE `global_presence_content` SET
  `title` = 'Global Presence',
  `content_paragraph` = 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
  `button_text` = 'Explore Our Global Network',
  `link_path` = '/uk/global-presence',
  `map_iframe_url` = 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'
WHERE `country_code` = 'UK';

UPDATE `global_presence_content` SET
  `title` = 'Global Presence',
  `content_paragraph` = 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
  `button_text` = 'Explore Our Global Network',
  `link_path` = '/india/global-presence',
  `map_iframe_url` = 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'
WHERE `country_code` = 'IN';

UPDATE `global_presence_content` SET
  `title` = 'Global Presence',
  `content_paragraph` = 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
  `button_text` = 'Explore Our Global Network',
  `link_path` = '/ae/global-presence',
  `map_iframe_url` = 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'
WHERE `country_code` = 'AE';

UPDATE `global_presence_content` SET
  `title` = 'Global Presence',
  `content_paragraph` = 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
  `button_text` = 'Explore Our Global Network',
  `link_path` = '/sa/global-presence',
  `map_iframe_url` = 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'
WHERE `country_code` = 'SA';

UPDATE `global_presence_content` SET
  `title` = 'Global Presence',
  `content_paragraph` = 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
  `button_text` = 'Explore Our Global Network',
  `link_path` = '/qa/global-presence',
  `map_iframe_url` = 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'
WHERE `country_code` = 'QA';

UPDATE `global_presence_content` SET
  `title` = 'Global Presence',
  `content_paragraph` = 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
  `button_text` = 'Explore Our Global Network',
  `link_path` = '/lk/global-presence',
  `map_iframe_url` = 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'
WHERE `country_code` = 'LK';

UPDATE `global_presence_content` SET
  `title` = 'Global Presence',
  `content_paragraph` = 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
  `button_text` = 'Explore Our Global Network',
  `link_path` = '/au/global-presence',
  `map_iframe_url` = 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'
WHERE `country_code` = 'AU';

UPDATE `global_presence_content` SET
  `title` = 'Global Presence',
  `content_paragraph` = 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
  `button_text` = 'Explore Our Global Network',
  `link_path` = '/cn/global-presence',
  `map_iframe_url` = 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'
WHERE `country_code` = 'CN';

UPDATE `global_presence_content` SET
  `title` = 'Global Presence',
  `content_paragraph` = 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
  `button_text` = 'Explore Our Global Network',
  `link_path` = '/id/global-presence',
  `map_iframe_url` = 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'
WHERE `country_code` = 'ID';

UPDATE `global_presence_content` SET
  `title` = 'Global Presence',
  `content_paragraph` = 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
  `button_text` = 'Explore Our Global Network',
  `link_path` = '/mm/global-presence',
  `map_iframe_url` = 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'
WHERE `country_code` = 'MM';

UPDATE `global_presence_content` SET
  `title` = 'Global Presence',
  `content_paragraph` = 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
  `button_text` = 'Explore Our Global Network',
  `link_path` = '/th/global-presence',
  `map_iframe_url` = 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'
WHERE `country_code` = 'TH';

UPDATE `global_presence_content` SET
  `title` = 'Global Presence',
  `content_paragraph` = 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
  `button_text` = 'Explore Our Global Network',
  `link_path` = '/us/global-presence',
  `map_iframe_url` = 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'
WHERE `country_code` = 'US';


-- ============================================================
-- 2. NAVIGATION BAR LABELS
--    Table: navigation_bar (single global row, id = 1)
-- ============================================================

UPDATE `navigation_bar` SET
  `home_label` = 'Home',
  `info_label` = 'Info',
  `about_label` = 'About Us',
  `careers_label` = 'Careers',
  `services_label` = 'Services',
  `global_presence_label` = 'Global Presence',
  `contact_label` = 'Contact / Quote'
WHERE `id` = 1;


-- ============================================================
-- 3. MAP MARKERS & OFFICE ADDRESSES (per office, used on the Global Presence map)
--    Table: global_presence_offices
--    One row per office. Edit the row for the office you need, matched by id.
-- ============================================================

UPDATE `global_presence_offices` SET
  `country_code` = 'sg', `office_country` = 'Singapore', `city_name` = 'Singapore',
  `office_name` = 'GGL (Singapore) Pte Ltd.',
  `address` = 'Blk 511 Kampong Bahru Road #03-01 Keppel Distripark, Singapore - 099447',
  `phone` = '+65 69080838', `email` = 'june@ggl.sg',
  `latitude` = 1.27660000, `longitude` = 103.82900000
WHERE `id` = 1;

UPDATE `global_presence_offices` SET
  `country_code` = 'my', `office_country` = 'Malaysia', `city_name` = 'PASIRGUDANG',
  `office_name` = 'GGL (Malaysia) Pasir Gudang',
  `address` = 'Unit 20-03A, Level 20 Menara Zurich, 15 Jalan Dato Abdullah Tahir, 80300 Johor Bahru',
  `phone` = '+603-3319 2778 / 74 / 75, 79', `email` = 'info@oecl.sg',
  `latitude` = 1.48420000, `longitude` = 103.76290000
WHERE `id` = 2;

UPDATE `global_presence_offices` SET
  `country_code` = 'my', `office_country` = 'Malaysia', `city_name` = 'PORTKLANG',
  `office_name` = 'GGL (Malaysia) Port Klang',
  `address` = 'MTBBT 2, 3A-5, Jalan Batu Nilam 16, The Landmark (Behind AEON Mall), Bandar Bukit Tinggi 2, 41200 Klang, Selangor D.E',
  `phone` = '+603-3319 2778 / 74 / 75', `email` = 'info@oecl.sg',
  `latitude` = 2.99820000, `longitude` = 101.38310000
WHERE `id` = 3;

UPDATE `global_presence_offices` SET
  `country_code` = 'ae', `office_country` = 'United Arab Emirates (UAE)', `city_name` = 'Dubai',
  `office_name` = 'GGL (UAE) Dubai',
  `address` = 'Office # 509, Al Nazar Plaza, Oud Metha, Dubai, U.A.E',
  `phone` = '+971 4 3433388', `email` = 'info.dubai@ggl.sg',
  `latitude` = 25.20480000, `longitude` = 55.27080000
WHERE `id` = 4;

UPDATE `global_presence_offices` SET
  `country_code` = 'in', `office_country` = 'India', `city_name` = 'Kochi',
  `office_name` = 'GGL (India) Kochi',
  `address` = 'CC 59/801A Elizabeth Memorial Building, Thevara Ferry Jn, Cochin 682013, Kerala.',
  `phone` = '+91 484 4019192 / 93', `email` = 'info.india@ggl.sg',
  `latitude` = 9.93230000, `longitude` = 76.29960000
WHERE `id` = 5;

UPDATE `global_presence_offices` SET
  `country_code` = 'in', `office_country` = 'India', `city_name` = 'Mumbai',
  `office_name` = 'GGL (India) Mumbai',
  `address` = '803 / 804, Shelton Cubix, Plot No. 87, Sector-15, CBD Belapur, Navi Mumbai, Maharashtra - 400614.',
  `phone` = '022-35131688 / 35113475 / 35082586', `email` = 'info.india@ggl.sg',
  `latitude` = 19.01123000, `longitude` = 73.03715000
WHERE `id` = 6;

UPDATE `global_presence_offices` SET
  `country_code` = 'in', `office_country` = 'India', `city_name` = 'Mumbai-Andheri',
  `office_name` = 'GGL (India) Mumbai-Andheri',
  `address` = '503, Midas, Sahar Plaza Complex, Sir M.V Road, Andheri East, Mumbai 400059',
  `phone` = '+91 8879756838', `email` = 'info.india@ggl.sg',
  `latitude` = 19.11303000, `longitude` = 72.86848000
WHERE `id` = 7;

UPDATE `global_presence_offices` SET
  `country_code` = 'in', `office_country` = 'India', `city_name` = 'Ludhiana',
  `office_name` = 'GGL (India) Ludhiana',
  `address` = 'No. 7A, G K Estate, Hari Nagar, Mundian Kalan, Chandigarh Road, Ludhiana, Punjab - 141015',
  `phone` = '+91 62845 49881', `email` = 'navjot.kohli@ggl.sg',
  `latitude` = 30.89135000, `longitude` = 75.93255000
WHERE `id` = 8;

UPDATE `global_presence_offices` SET
  `country_code` = 'in', `office_country` = 'India', `city_name` = 'Delhi',
  `office_name` = 'GGL (India) Delhi',
  `address` = '903, Surya Kiran Building K.G Marg, Connaught Place, New Delhi - 110001',
  `phone` = '+91 11 493224477 / 48 / 49', `email` = 'info.india@ggl.sg',
  `latitude` = 28.62748000, `longitude` = 77.22210000
WHERE `id` = 9;

UPDATE `global_presence_offices` SET
  `country_code` = 'in', `office_country` = 'India', `city_name` = 'Bangalore',
  `office_name` = 'GGL (India) Bangalore',
  `address` = '3C-964 IIIrd Cross Street, HRBR LAYOUT 1st Block, Kalyan Nagar Bannaswadi, Bengaluru - 560043.',
  `phone` = '+91 9841676259', `email` = 'info.india@ggl.sg',
  `latitude` = 13.01855000, `longitude` = 77.64191000
WHERE `id` = 10;

UPDATE `global_presence_offices` SET
  `country_code` = 'in', `office_country` = 'India', `city_name` = 'Kolkata',
  `office_name` = 'GGL (India) Kolkata',
  `address` = 'Merlin Matrix, 3rd floor, Room No. 303 10, D. N. BLOCK, SECTOR - V SALT LAKE CITY, Kolkata - 700091',
  `phone` = '+91 33 46025458 / 59 / 60 / 61', `email` = 'info.india@ggl.sg',
  `latitude` = 22.57690000, `longitude` = 88.43410000
WHERE `id` = 11;

UPDATE `global_presence_offices` SET
  `country_code` = 'bd', `office_country` = 'Bangladesh', `city_name` = 'Dhaka',
  `office_name` = 'GGL (Bangladesh) Ltd.',
  `address` = 'ID #9-N (New), 9-M(Old-N), 9th floor, Tower 1, Police Plaza Concord No.2, Road # 144, Gulshan Model Town, Dhaka 1215, Bangladesh',
  `phone` = '+880 1716 620989', `email` = 'info.bd@ggl.sg',
  `latitude` = 23.77880000, `longitude` = 90.41960000
WHERE `id` = 12;

UPDATE `global_presence_offices` SET
  `country_code` = 'gb', `office_country` = 'United Kingdom', `city_name` = 'London',
  `office_name` = 'GGL (UK) Ltd. London',
  `address` = '167-169 Great Portland Street 5th Floor, London W1W 5PF, United Kingdom',
  `phone` = '+44 (0) 203 393 9508', `email` = 'Sukant@ggl.sg',
  `latitude` = 51.50740000, `longitude` = -0.12780000
WHERE `id` = 13;

UPDATE `global_presence_offices` SET
  `country_code` = 'gb', `office_country` = 'United Kingdom', `city_name` = 'Newcastle',
  `office_name` = 'GGL (UK) Ltd. Newcastle',
  `address` = '15 Woodlands Park Villas, North Gosforth, NE136PR, Newcastle Upon Tyne, United Kingdom.',
  `phone` = '+44(0)7305 856 612', `email` = 'Sukant@ggl.sg',
  `latitude` = 55.00840000, `longitude` = -1.61740000
WHERE `id` = 14;

UPDATE `global_presence_offices` SET
  `country_code` = 'us', `office_country` = 'United States (USA)', `city_name` = 'Chicago',
  `office_name` = 'GGL (USA) Chicago',
  `address` = '939 W. North Avenue, Suite 750, Chicago, IL 60642',
  `phone` = '+1 847 254 7320', `email` = 'info@gglusa.us',
  `latitude` = 41.86220000, `longitude` = -87.72090000
WHERE `id` = 15;

UPDATE `global_presence_offices` SET
  `country_code` = 'us', `office_country` = 'United States (USA)', `city_name` = 'New York',
  `office_name` = 'GGL (USA) New York',
  `address` = 'New Jersey Branch, 33 Wood Avenue South Suite 600, Iselin, NJ 08830',
  `phone` = '+1 732 456 6780', `email` = 'info@gglusa.us',
  `latitude` = 37.45450000, `longitude` = -122.18180000
WHERE `id` = 16;

UPDATE `global_presence_offices` SET
  `country_code` = 'us', `office_country` = 'United States (USA)', `city_name` = 'Los Angeles',
  `office_name` = 'GGL (USA) Los Angeles',
  `address` = '2250 South Central Avenue Compton, CA 90220',
  `phone` = '+1 310 928 3903', `email` = 'info@gglusa.us',
  `latitude` = 34.05220000, `longitude` = -118.24370000
WHERE `id` = 17;

UPDATE `global_presence_offices` SET
  `country_code` = 'qa', `office_country` = 'Qatar', `city_name` = 'Doha',
  `office_name` = 'GGL (Qatar) - Doha',
  `address` = 'Office no: 48, 2nd Floor, Al matar Centre, Old Airport Road Doha',
  `phone` = '0974 33622555', `email` = 'info.qa@ggl.sg',
  `latitude` = 25.27698700, `longitude` = 51.52000800
WHERE `id` = 18;

UPDATE `global_presence_offices` SET
  `country_code` = 'cn', `office_country` = 'China', `city_name` = 'Shenzhen',
  `office_name` = 'GGL (China) Shenzhen',
  `address` = '13C02, Block A, Zhaoxin Huijin Plaza 3085 Shennan East Road, Luohu, Shenzhen.',
  `phone` = '+86 75582222447', `email` = 'helen@haixun.co',
  `latitude` = 22.54262000, `longitude` = 114.11696000
WHERE `id` = 19;

UPDATE `global_presence_offices` SET
  `country_code` = 'sa', `office_country` = 'Saudi Arabia', `city_name` = 'Dammam',
  `office_name` = 'GGL (Saudi Arabia) - Dammam',
  `address` = 'Building No.2817, Secondary No9403, King Faisal Road, Al Tubebayshi Dist, Dammam, KSA 32233',
  `phone` = '+966 13 343 0003', `email` = 'info.sa@ggl.sg',
  `latitude` = 26.42070000, `longitude` = 50.08880000
WHERE `id` = 20;

UPDATE `global_presence_offices` SET
  `country_code` = 'sa', `office_country` = 'Saudi Arabia', `city_name` = 'Riyadh',
  `office_name` = 'GGL (Saudi Arabia) - Riyadh',
  `address` = 'Room No. T18, Rail Business Centre, Bldg No. 3823, Omar Aimukhtar St, Thulaim, Riyadh 11332',
  `phone` = '+966 11295 0020', `email` = 'info.sa@ggl.sg',
  `latitude` = 24.71360000, `longitude` = 46.67530000
WHERE `id` = 21;

UPDATE `global_presence_offices` SET
  `country_code` = 'sa', `office_country` = 'Saudi Arabia', `city_name` = 'Jeddah',
  `office_name` = 'GGL (Saudi Arabia) - Jeddah',
  `address` = 'Al-Madinah Al-Munawarah Road, Al Sharafeyah, Jeddah 4542 -22234, Kingdom of Saudi Arabia',
  `phone` = '+966 12 578 0874', `email` = 'info.sa@ggl.sg',
  `latitude` = 21.48580000, `longitude` = 39.19250000
WHERE `id` = 22;

UPDATE `global_presence_offices` SET
  `country_code` = 'id', `office_country` = 'Indonesia', `city_name` = 'Jakarta',
  `office_name` = 'GGL (Indonesia) - Jakarta',
  `address` = '408, Lina Building, JL.HR Rasuna Said kav B7, Jakarta',
  `phone` = '+62 21 529 20292, 522 4887', `email` = 'logistics.jkt@oecl.sg',
  `latitude` = -6.20880000, `longitude` = 106.84560000
WHERE `id` = 23;

UPDATE `global_presence_offices` SET
  `country_code` = 'id', `office_country` = 'Indonesia', `city_name` = 'Surabaya',
  `office_name` = 'GGL (Indonesia) - Surabaya',
  `address` = 'Japfa Indoland Center, Japfa Tower 1, Lantai 4/401-A JL Jend, Basuki Rahmat 129-137, Surabaya 60271',
  `phone` = '+62 21 529 20292, 522 4887', `email` = 'logistics.jkt@oecl.sg',
  `latitude` = -7.25750000, `longitude` = 112.75210000
WHERE `id` = 24;

UPDATE `global_presence_offices` SET
  `country_code` = 'lk', `office_country` = 'Sri Lanka', `city_name` = 'Colombo',
  `office_name` = 'GGL (Sri Lanka) - Colombo',
  `address` = 'Ceylinco House, 9th Floor, No. 69, Janadhipathi Mawatha, Colombo 01, Sri Lanka',
  `phone` = '+94 114477499 / +94 114477494 / 98', `email` = 'info.cmb@globalconsol.com',
  `latitude` = 6.92710000, `longitude` = 79.86120000
WHERE `id` = 25;

UPDATE `global_presence_offices` SET
  `country_code` = 'th', `office_country` = 'Thailand', `city_name` = 'Bangkok',
  `office_name` = 'GGL (Thailand) - Bangkok',
  `address` = '109 CCT Building, 3rd Floor, Rm.3, Surawong Road, Suriyawongse, Bangrak, Bangkok 10500 109',
  `phone` = '+662-634-3240 / +662-634-3942', `email` = 'info@oecl.sg',
  `latitude` = 13.72957000, `longitude` = 100.53095000
WHERE `id` = 26;

UPDATE `global_presence_offices` SET
  `country_code` = 'mm', `office_country` = 'Myanmar', `city_name` = 'Yangon',
  `office_name` = 'GGL (Myanmar) - Yangon',
  `address` = 'No.608, Room 8B, Bo Soon Pat Tower, Merchant Street, Pabedan Township, Yangon, Myanmar',
  `phone` = '+951 243158 / +951 377985, 243101', `email` = 'info@globalconsol.com',
  `latitude` = 16.84090000, `longitude` = 96.17350000
WHERE `id` = 27;

UPDATE `global_presence_offices` SET
  `country_code` = 'au', `office_country` = 'Australia', `city_name` = 'Melbourne',
  `office_name` = 'GGL (Australia) - Melbourne',
  `address` = 'Suite 5, 7-9 Mallet Road, Tullamarine, Victoria, 3043',
  `phone` = 'Mob: +61 432254969 / Tel: +61 388205157', `email` = 'info@gglaustralia.com',
  `latitude` = -37.81360000, `longitude` = 144.96310000
WHERE `id` = 28;
