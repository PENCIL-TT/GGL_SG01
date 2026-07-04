const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Intercept database-dependent API calls to ensure remote MySQL connection is used
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  if (req.path === '/upload') {
    return next();
  }
  if (!pool) {
    return res.status(500).json({ error: "Hostinger MySQL database connection is offline. Local fallbacks are disabled." });
  }
  next();
});

// Disable local fallback file storage reading and writing
const originalExistsSync = fs.existsSync;
fs.existsSync = (filePath) => {
  if (typeof filePath === 'string' && path.basename(filePath).startsWith('fallback_')) {
    return false;
  }
  return originalExistsSync(filePath);
};

const originalWriteFileSync = fs.writeFileSync;
fs.writeFileSync = (filePath, data, options) => {
  if (typeof filePath === 'string' && path.basename(filePath).startsWith('fallback_')) {
    return;
  }
  return originalWriteFileSync(filePath, data, options);
};

// Database connection pool
let pool;

async function initDb() {
  const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? {} : undefined,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
  };

  console.log(`Connecting to MySQL database at ${dbConfig.host}:${dbConfig.port}...`);
  
  try {
    pool = mysql.createPool(dbConfig);
    
    await initializeDatabase(pool);

  } catch (error) {
    console.error('Database connection / initialization failed:', error.message);
    pool = null; // Ensure pool is null on failure
    console.error('Ensure that:');
    console.error('1. Your DB_HOST in the .env file is correct (Hostinger server IP or main-hosting hostname).');
    console.error('2. Remote connections are allowed in your Hostinger panel (Access host %).');
    console.error('3. Local firewall is not blocking port 3306.');
  }
}

async function initializeDatabase(dbPool) {
  let connection;
  try {
    connection = await dbPool.getConnection();
    console.log('Successfully connected to Hostinger MySQL Database for initialization!');

    const createSeoTableQuery = `
      CREATE TABLE IF NOT EXISTS \`seo_gglsingapore\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`path\` VARCHAR(255) NOT NULL UNIQUE,
        \`title\` VARCHAR(255) NULL,
        \`description\` TEXT NULL,
        \`keywords\` TEXT NULL,
        \`extra_meta\` TEXT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createSeoTableQuery);
    console.log('Table "seo_gglsingapore" initialized successfully.');

    // Auto-create the about_us_content table
    const createAboutUsTableQuery = `
      CREATE TABLE IF NOT EXISTS \`about_us_content\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`country_code\` VARCHAR(10) NOT NULL UNIQUE,
        \`title\` VARCHAR(255) NOT NULL,
        \`content_paragraph_1\` TEXT NOT NULL,
        \`content_paragraph_2\` TEXT NOT NULL,
        \`image_url\` VARCHAR(255) NOT NULL,
        \`button_text\` VARCHAR(50) NOT NULL DEFAULT 'Learn More',
        \`learn_more_path\` VARCHAR(255) NOT NULL,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createAboutUsTableQuery);
    console.log('Table "about_us_content" initialized successfully.');

    // Seed default About Us records
    const [aboutUsRows] = await connection.query('SELECT COUNT(*) as count FROM `about_us_content`');
    if (aboutUsRows[0].count === 0) {
      console.log('Seeding default "about_us_content" records...');
      const seedQuery = `
        INSERT INTO \`about_us_content\` 
          (\`country_code\`, \`title\`, \`content_paragraph_1\`, \`content_paragraph_2\`, \`image_url\`, \`button_text\`, \`learn_more_path\`) 
        VALUES 
          ('SG', 'About Us', 
           'At GGL, we are proud to be one of Singapore\\''s leading logistics companies. We offer specialized divisions in warehousing, forwarding (air and ocean), and transportation. Our mission is to deliver comprehensive end-to-end solutions in global freight forwarding, managed through a trusted network of partners who excel in all logistics segments.', 
           'We are dedicated to fostering deep, collaborative relationships with our clients, and creating genuine partnerships that drive mutual growth. Our work goes beyond forwarding and logistics; it\\''s about building trust with our customers by delivering world-class service and solutions.', 
           '/lovable-uploads/3c0c858f-8cb2-4284-b2f7-ea7bf2b6d6df.png', 'Learn More', '/about'),
          
          ('BD', 'About Us', 
           'GGL is a trusted global leader in LCL (Less-than-Container Load) consolidation. With a robust presence across North America, the UK, the Middle East, the Indian Subcontinent, Southeast Asia, and the Far East, we offer streamlined groupage services backed by strong customer support and competitive pricing.', 
           'We are Strategically positioned in major transshipment hubs like Singapore, Malaysia, Sri Lanka, and Dubai, GGL operates direct weekly sailings to key global ports. Our expansive network ensures fast, reliable, and cost-effective consolidation options for freight forwarders and logistics providers.', 
           '/lovable-uploads/14c89acc-9c64-4484-b520-f5142136ccc6.png', 'Learn More', '/bangladesh/about'),
          
          ('MY', 'About Us', 
           'GGL is a trusted global leader in LCL (Less-than-Container Load) consolidation. With a robust presence across North America, the UK, the Middle East, the Indian Subcontinent, Southeast Asia, and the Far East, we offer streamlined groupage services backed by strong customer support and competitive pricing.', 
           'We are Strategically positioned in major transshipment hubs like Singapore, Malaysia, Sri Lanka, and Dubai, GGL operates direct weekly sailings to key global ports. Our expansive network ensures fast, reliable, and cost-effective consolidation options for freight forwarders and logistics providers.', 
           '/lovable-uploads/14c89acc-9c64-4484-b520-f5142136ccc6.png', 'Learn More', '/malaysia/about'),
          
          ('PK', 'About Us', 
           'GGL is a trusted global leader in LCL (Less-than-Container Load) consolidation. With a robust presence across North America, the UK, the Middle East, the Indian Subcontinent, Southeast Asia, and the Far East, we offer streamlined groupage services backed by strong customer support and competitive pricing.', 
           'We are Strategically positioned in major transshipment hubs like Singapore, Malaysia, Sri Lanka, and Dubai, GGL operates direct weekly sailings to key global ports. Our expansive network ensures fast, reliable, and cost-effective consolidation options for freight forwarders and logistics providers.', 
           '/lovable-uploads/14c89acc-9c64-4484-b520-f5142136ccc6.png', 'Learn More', '/pakistan/about'),
          
          ('UK', 'About Us', 
           'GGL is a trusted global leader in logistics and consolidation. With a robust presence in the UK and across the globe, we offer streamlined services backed by strong customer support and competitive pricing.', 
           'Strategically positioned to serve the UK market, GGL connects businesses to key global ports and hubs. Our expansive network ensures fast, reliable, and cost-effective options for freight forwarders and logistics providers.', 
           '/Uabout.png', 'Learn More', '/uk/about')
      `;
      await connection.query(seedQuery);
      console.log('Seeded "about_us_content" records successfully.');
    }

    // Auto-create the services_content table
    const createServicesTableQuery = `
      CREATE TABLE IF NOT EXISTS \`services_content\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`country_code\` VARCHAR(10) NOT NULL,
        \`service_index\` INT NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`description\` TEXT NOT NULL,
        \`image_url\` VARCHAR(255) NOT NULL,
        \`link\` VARCHAR(255) NOT NULL,
        \`icon_type\` VARCHAR(50) NOT NULL DEFAULT 'Warehouse',
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY \`country_service\` (\`country_code\`, \`service_index\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createServicesTableQuery);
    console.log('Table "services_content" initialized successfully.');

    // Seed default Services records
    const [servicesRows] = await connection.query('SELECT COUNT(*) as count FROM `services_content`');
    if (servicesRows[0].count < 40) {
      console.log('Seeding default "services_content" records with 8 services per country...');
      await connection.query('DELETE FROM `services_content`');
      const seedServicesQuery = `
        INSERT INTO \`services_content\` 
          (\`country_code\`, \`service_index\`, \`title\`, \`description\`, \`image_url\`, \`link\`, \`icon_type\`) 
        VALUES 
          ('SG', 0, 'Ocean Freight', 'GGL\\'s dedicated ocean freight department specialize in the complete range freight management services for LCL and FCL loads, supported thru a well established and reliable partner network around the world, for efficient collection, storage & delivery from shippers door to door.', '/lovable-uploads/oceanfrieght.jpg', '/services/ocean-freight', 'Anchor'),
          ('SG', 1, 'Air Freight', 'At GGL, we provide a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams offer seamless air import, export, and express options, all on a convenient door-to-door basis. GGL stands out with competitive rates.', '/cargoplane.png', '/services/air-freight', 'Plane'),
          ('SG', 2, 'Transportation And Distribution', 'GGL boasts a dedicated fleet of vehicles to ensure timely domestic distribution and deliveries. Our efficient operational infrastructure provides our clients with high productivity, frequent services, and fast, reliable distribution operations. GGL is committed to delivering excellence.', '/truck12.png', '/services/transportation', 'Truck'),
          ('SG', 3, 'Warehousing', 'GGL is a premier supply chain solutions provider in Singapore, addressing the full spectrum of logistics needs for our clients. We facilitate the movement of goods from suppliers to manufacturers (for parts and components), from manufacturers and brand owners to resellers and distributors.', '/lovable-uploads/warehouse.jpg', '/services/warehousing', 'Warehouse'),
          ('SG', 4, 'LCL Consolidation', 'GGL is a LCL Consolidator with global presence covering North America, UK, Middle East, Indian Sub Continent, South East Asia and Far East. Our LCL Groupage services is backed by very efficient customer support at competitive prices.', '/lcl.png', '/services/lcl-consolidation', 'Warehouse'),
          ('SG', 5, 'Project Cargo', 'Project cargo refers to the specialized transportation of large, heavy, high-value, or complex equipment, often associated with large-scale infrastructure or construction projects.', '/projectcargo3.png', '/services/project-cargo', 'Package'),
          ('SG', 6, 'Liquid Transportation', 'We provide safe and reliable transport of liquid cargo, utilizing specialized tankers and equipment for chemical, food-grade, or hazardous liquids.', '/transports.png', '/services/liquid-transportation', 'Truck'),
          ('SG', 7, 'Customs Clearance', 'Our dedicated customs brokerage team ensures full compliance and fast clearance at all air, sea, and land border checkpoints.', '/lovable-uploads/cc.jpg', '/services/customs-clearance', 'Package'),

          ('BD', 0, 'Ocean Freight', 'At GGL India, we specialize in providing comprehensive ocean freight solutions that cater to the diverse needs of our clients. Whether you\\'re shipping large volumes or smaller consignments, our services are designed to ensure efficiency, reliability, and cost-effectiveness', '/hom1.png', '/bangladesh/services/ocean-freight', 'Anchor'),
          ('BD', 1, 'LCL Consolidation', 'We collect your goods from your location and prepare them for consolidation. This includes proper labelling, packaging, and documentation to ensure smooth transit.', '/hom4.png', '/bangladesh/services/lcl-consolidation', 'Warehouse'),
          ('BD', 2, 'Transportation And Distribution', 'At GGL India, we understand that efficient transportation and distribution are the backbone of a seamless supply chain. Our dedicated fleet and robust infrastructure ensure that your goods reach their destination on time, every time.', '/hom3.png', '/bangladesh/services/transportation', 'Truck'),
          ('BD', 3, 'Warehousing', 'At GGL India, we offer comprehensive warehousing and third-party logistics (3PL) solutions designed to streamline your supply chain operations. Our services are tailored to meet the diverse needs of businesses, ensuring efficiency, reliability, and scalability.', '/warehosing.png', '/bangladesh/services/warehousing', 'Warehouse'),
          ('BD', 4, 'Air Freight', 'At GGL India, we offer a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams provide seamless air import, export, and express options, all on a convenient door-to-door basis.', '/aircargo1.png', '/bangladesh/services/air-freight', 'Plane'),
          ('BD', 5, 'Project Cargo', 'At GGL, we specialize in managing project cargo—the transportation of large, heavy, high-value, or complex pieces of equipment and materials essential to major infrastructure, engineering, or industrial projects.', '/cargoh1.png', '/bangladesh/services/project-cargo', 'Warehouse'),
          ('BD', 6, 'Liquid Transportation', 'At GGL, we provide safe, compliant, and efficient transport of liquid cargo, utilizing specialized tankers and equipment for chemical, food-grade, or hazardous liquids.', '/transports.png', '/bangladesh/services/liquid-transportation', 'Truck'),
          ('BD', 7, 'Customs Clearance', 'Our dedicated customs brokerage team ensures full compliance and fast clearance at all air, sea, and land border checkpoints across Bangladesh.', '/lovable-uploads/cc.jpg', '/bangladesh/services/customs-clearance', 'Package'),

          ('MY', 0, 'Ocean Freight', 'At GGL, we specialize in providing comprehensive ocean freight solutions that cater to the diverse needs of our clients. Whether you\\'re shipping large volumes or smaller consignments, our services are designed to ensure efficiency, reliability, and cost-effectiveness', '/mocean.png', '/malaysia/services/ocean-freight', 'Anchor'),
          ('MY', 1, 'LCL Consolidation', 'We collect your goods from your location and prepare them for consolidation. This includes proper labelling, packaging, and documentation to ensure smooth transit.', '/mlcl.png', '/malaysia/services/lcl-consolidation', 'Warehouse'),
          ('MY', 2, 'Transportation And Distribution', 'At GGL, we understand that efficient transportation and distribution are the backbone of a seamless supply chain. Our dedicated fleet and robust infrastructure ensure that your goods reach their destination on time, every time.', '/mtransport.png', '/malaysia/services/transportation', 'Truck'),
          ('MY', 3, 'Warehousing', 'At GGL, we offer comprehensive warehousing and third-party logistics (3PL) solutions designed to streamline your supply chain operations. Our services are tailored to meet the diverse needs of businesses, ensuring efficiency, reliability, and scalability.', '/mwarehouse.png', '/malaysia/services/warehousing', 'Warehouse'),
          ('MY', 4, 'Air Freight', 'At GGL, we offer a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams provide seamless air import, export, and express options, all on a convenient door-to-door basis.', '/mair.png', '/malaysia/services/air-freight', 'Plane'),
          ('MY', 5, 'Project Cargo', 'At GGL, we specialize in managing project cargo—the transportation of large, heavy, high-value, or complex pieces of equipment and materials essential to major infrastructure, engineering, or industrial projects.', '/mproject.png', '/malaysia/services/project-cargo', 'Warehouse'),
          ('MY', 6, 'Liquid Transportation', 'At GGL, we provide safe, compliant, and efficient transport of liquid cargo, utilizing specialized tankers and equipment for chemical, food-grade, or hazardous liquids.', '/transports.png', '/malaysia/services/liquid-transportation', 'Truck'),
          ('MY', 7, 'Customs Clearance', 'Our dedicated customs brokerage team ensures full compliance and fast clearance at all air, sea, and land border checkpoints across Malaysia.', '/lovable-uploads/cc.jpg', '/malaysia/services/customs-clearance', 'Package'),

          ('PK', 0, 'Ocean Freight', 'At GGL, we specialize in providing comprehensive ocean freight solutions that cater to the diverse needs of our clients. Whether you\\'re shipping large volumes or smaller consignments, our services are designed to ensure efficiency, reliability, and cost-effectiveness', '/ps1.png', '/pakistan/services/ocean-freight', 'Anchor'),
          ('PK', 1, 'LCL Consolidation', 'We collect your goods from your location and prepare them for consolidation. This includes proper labelling, packaging, and documentation to ensure smooth transit.', '/ps5.png', '/pakistan/services/lcl-consolidation', 'Warehouse'),
          ('PK', 2, 'Transportation And Distribution', 'At GGL, we understand that efficient transportation and distribution are the backbone of a seamless supply chain. Our dedicated fleet and robust infrastructure ensure that your goods reach their destination on time, every time.', '/ps3.png', '/pakistan/services/transportation', 'Truck'),
          ('PK', 3, 'Warehousing', 'At GGL, we offer comprehensive warehousing and third-party logistics (3PL) solutions designed to streamline your supply chain operations. Our services are tailored to meet the diverse needs of businesses, ensuring efficiency, reliability, and scalability.', '/ps4.png', '/pakistan/services/warehousing', 'Warehouse'),
          ('PK', 4, 'Air Freight', 'At GGL, we offer a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams provide seamless air import, export, and express options, all on a convenient door-to-door basis.', '/ps2.png', '/pakistan/services/air-freight', 'Plane'),
          ('PK', 5, 'Project Cargo', 'At GGL, we specialize in managing project cargo—the transportation of large, heavy, high-value, or complex pieces of equipment and materials essential to major infrastructure, engineering, or industrial projects.', '/ps6.png', '/pakistan/services/project-cargo', 'Warehouse'),
          ('PK', 6, 'Liquid Transportation', 'At GGL, we provide safe, compliant, and efficient transport of liquid cargo, utilizing specialized tankers and equipment for chemical, food-grade, or hazardous liquids.', '/transports.png', '/pakistan/services/liquid-transportation', 'Truck'),
          ('PK', 7, 'Customs Clearance', 'Our dedicated customs brokerage team ensures full compliance and fast clearance at all air, sea, and land border checkpoints across Pakistan.', '/lovable-uploads/cc.jpg', '/pakistan/services/customs-clearance', 'Package'),

          ('UK', 0, 'Ocean Freight', 'At GGL, we specialize in providing comprehensive ocean freight solutions that cater to the diverse needs of our clients. Whether you\\'re shipping large volumes or smaller consignments, our services are designed to ensure efficiency, reliability, and cost-effectiveness', '/us1.png', '/uk/services/ocean-freight', 'Anchor'),
          ('UK', 1, 'LCL Consolidation', 'We collect your goods from your location and prepare them for consolidation. This includes proper labelling, packaging, and documentation to ensure smooth transit.', '/us5.png', '/uk/services/lcl-consolidation', 'Warehouse'),
          ('UK', 2, 'Transportation And Distribution', 'At GGL, we understand that efficient transportation and distribution are the backbone of a seamless supply chain. Our dedicated fleet and robust infrastructure ensure that your goods reach their destination on time, every time.', '/us3.png', '/uk/services/transportation', 'Truck'),
          ('UK', 3, 'Warehousing', 'At GGL, we offer comprehensive warehousing and third-party logistics (3PL) solutions designed to streamline your supply chain operations. Our services are tailored to meet the diverse needs of businesses, ensuring efficiency, reliability, and scalability.', '/us4.png', '/uk/services/warehousing', 'Warehouse'),
          ('UK', 4, 'Air Freight', 'At GGL, we offer a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams provide seamless air import, export, and express options, all on a convenient door-to-door basis.', '/us2.png', '/uk/services/air-freight', 'Plane'),
          ('UK', 5, 'Project Cargo', 'At GGL, we specialize in managing project cargo—the transportation of large, heavy, high-value, or complex pieces of equipment and materials essential to major infrastructure, engineering, or industrial projects.', '/us6.png', '/uk/services/project-cargo', 'Warehouse'),
          ('UK', 6, 'Liquid Transportation', 'At GGL, we provide safe, compliant, and efficient transport of liquid cargo, utilizing specialized tankers and equipment for chemical, food-grade, or hazardous liquids.', '/transports.png', '/uk/services/liquid-transportation', 'Truck'),
          ('UK', 7, 'Customs Clearance', 'Our dedicated customs brokerage team ensures full compliance and fast clearance at all air, sea, and land border checkpoints across the UK.', '/lovable-uploads/cc.jpg', '/uk/services/customs-clearance', 'Package')
      `;
      await connection.query(seedServicesQuery);
      console.log('Seeded "services_content" records successfully.');
    }

    // Auto-create the global_presence_content table
    const createGlobalPresenceTableQuery = `
      CREATE TABLE IF NOT EXISTS \`global_presence_content\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`country_code\` VARCHAR(10) NOT NULL UNIQUE,
        \`title\` VARCHAR(255) NOT NULL,
        \`content_paragraph\` TEXT NOT NULL,
        \`button_text\` VARCHAR(50) NOT NULL DEFAULT 'Explore Our Global Network',
        \`link_path\` VARCHAR(255) NOT NULL,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createGlobalPresenceTableQuery);
    console.log('Table "global_presence_content" initialized successfully.');

    // Ensure map_iframe_url column exists in global_presence_content table
    const [gpColumns] = await connection.query("SHOW COLUMNS FROM `global_presence_content` LIKE 'map_iframe_url'");
    if (gpColumns.length === 0) {
      await connection.query("ALTER TABLE `global_presence_content` ADD COLUMN `map_iframe_url` TEXT NULL");
      // Update default records to have default map link
      const defaultMapUrl = "https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1";
      await connection.query("UPDATE `global_presence_content` SET `map_iframe_url` = ?", [defaultMapUrl]);
      console.log('Added column "map_iframe_url" to table "global_presence_content".');
    }

    // Seed default Global Presence records
    const [globalPresenceRows] = await connection.query('SELECT COUNT(*) as count FROM `global_presence_content`');
    if (globalPresenceRows[0].count === 0) {
      console.log('Seeding default "global_presence_content" records...');
      const seedGlobalPresenceQuery = `
        INSERT INTO \`global_presence_content\` 
          (\`country_code\`, \`title\`, \`content_paragraph\`, \`button_text\`, \`link_path\`, \`map_iframe_url\`) 
        VALUES 
          ('SG', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
          ('BD', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/bangladesh/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
          ('MY', 'Global Network, Local Expertise', 'From our hubs in Malaysia, we connect you to GGL\\'s extensive global network, ensuring your cargo reaches any corner of the world with the same reliability and care.', 'Explore Our Global Presence', '/malaysia/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
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
          ('US', 'Global Presence', 'Our logistics network spans across continents, enabling seamless global shipping solutions.', 'Explore Our Global Network', '/us/global-presence', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1')
      `;
      await connection.query(seedGlobalPresenceQuery);
      console.log('Seeded "global_presence_content" records successfully.');
    }

    // Auto-create the global_presence_offices table
    const createGlobalPresenceOfficesTableQuery = `
      CREATE TABLE IF NOT EXISTS \`global_presence_offices\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`country_code\` VARCHAR(10) NOT NULL,
        \`office_country\` VARCHAR(100) NOT NULL,
        \`city_name\` VARCHAR(100) NOT NULL,
        \`office_name\` VARCHAR(255) NOT NULL,
        \`address\` TEXT NOT NULL,
        \`phone\` VARCHAR(255) NULL,
        \`email\` VARCHAR(255) NULL,
        \`latitude\` DECIMAL(10, 8) NOT NULL DEFAULT 0.00000000,
        \`longitude\` DECIMAL(11, 8) NOT NULL DEFAULT 0.00000000,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createGlobalPresenceOfficesTableQuery);
    console.log('Table "global_presence_offices" initialized successfully.');

    // Seed default global presence office markers
    const [globalPresenceOfficesRows] = await connection.query('SELECT COUNT(*) as count FROM `global_presence_offices`');
    if (globalPresenceOfficesRows[0].count === 0) {
      console.log('Seeding default "global_presence_offices" records...');
      const seedGlobalPresenceOfficesQuery = `
        INSERT INTO \`global_presence_offices\` 
          (\`id\`, \`country_code\`, \`office_country\`, \`city_name\`, \`office_name\`, \`address\`, \`phone\`, \`email\`, \`latitude\`, \`longitude\`) 
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
          (28, 'au', 'Australia', 'Melbourne', 'GGL (Australia) - Melbourne', 'Suite 5, 7-9 Mallet Road, Tullamarine, Victoria, 3043', 'Mob: +61 432254969 / Tel: +61 388205157', 'info@gglaustralia.com', -37.81360000, 144.96310000)
      `;
      await connection.query(seedGlobalPresenceOfficesQuery);
      console.log('Seeded "global_presence_offices" records successfully.');
    }

    // Auto-create the admin_countries table
    const createAdminCountriesTableQuery = `
      CREATE TABLE IF NOT EXISTS \`admin_countries\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`code\` VARCHAR(10) NOT NULL UNIQUE,
        \`name\` VARCHAR(100) NOT NULL,
        \`flag\` VARCHAR(10) NOT NULL,
        \`link_path\` VARCHAR(255) NULL,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createAdminCountriesTableQuery);
    console.log('Table "admin_countries" initialized successfully.');

    // Ensure link_path column exists in admin_countries table
    const [countryLinkColumns] = await connection.query("SHOW COLUMNS FROM `admin_countries` LIKE 'link_path'");
    if (countryLinkColumns.length === 0) {
      await connection.query("ALTER TABLE `admin_countries` ADD COLUMN `link_path` VARCHAR(255) NULL");
      console.log('Added column "link_path" to table "admin_countries".');
    }

    // Auto-create the quick_enquiry_content table
    const createQuickEnquiryTableQuery = `
      CREATE TABLE IF NOT EXISTS \`quick_enquiry_content\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`country_code\` VARCHAR(10) NOT NULL UNIQUE,
        \`title\` VARCHAR(255) NOT NULL DEFAULT 'Quick Enquiry',
        \`subtitle\` TEXT NOT NULL,
        \`email_recipient\` VARCHAR(255) NOT NULL,
        \`success_message\` TEXT NOT NULL,
        \`error_message\` TEXT NOT NULL,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createQuickEnquiryTableQuery);
    console.log('Table "quick_enquiry_content" initialized successfully.');

    // Seed default Quick Enquiry records
    const [quickEnquiryRows] = await connection.query('SELECT COUNT(*) as count FROM `quick_enquiry_content`');
    if (quickEnquiryRows[0].count === 0) {
      console.log('Seeding default "quick_enquiry_content" records...');
      const seedQuickEnquiryQuery = `
        INSERT INTO \`quick_enquiry_content\` 
          (\`country_code\`, \`title\`, \`subtitle\`, \`email_recipient\`, \`success_message\`, \`error_message\`) 
        VALUES 
          ('SG', 'Quick Enquiry', 'Have a question? Fill out the form below and we\\'ll get back to you shortly.', 'June@ggl.sg', 'Your enquiry has been submitted successfully. We\\'ll contact you soon.', 'Something went wrong. Please try again later.'),
          ('BD', 'Quick Enquiry', 'Have a question? Fill out the form below and we\\'ll get back to you shortly.', 'info.bd@ggl.sg', 'Your enquiry has been submitted successfully. We\\'ll contact you soon.', 'Something went wrong. Please try again later.'),
          ('MY', 'Quick Enquiry', 'Have a question? Fill out the form below and we\\'ll get back to you shortly.', 'info.pk@ggl.sg', 'Your enquiry has been submitted successfully. We\\'ll contact you soon.', 'Something went wrong. Please try again later.'),
          ('PK', 'Quick Enquiry', 'Have a question? Fill out the form below and we\\'ll get back to you shortly.', 'info.pk@ggl.sg', 'Your enquiry has been submitted successfully. We\\'ll contact you soon.', 'Something went wrong. Please try again later.'),
          ('UK', 'Quick Enquiry', 'Have a question? Fill out the form below and we\\'ll get back to you shortly.', 'Sukant@ggl.sg', 'Your enquiry has been submitted successfully. We\\'ll contact you soon.', 'Something went wrong. Please try again later.')
      `;
      await connection.query(seedQuickEnquiryQuery);
      console.log('Seeded "quick_enquiry_content" records successfully.');
    }

    // Auto-create the footer_general table
    const createFooterGeneralTableQuery = `
      CREATE TABLE IF NOT EXISTS \`footer_general\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`about_text\` TEXT NOT NULL,
        \`facebook_url\` VARCHAR(255) NULL,
        \`linkedin_url\` VARCHAR(255) NULL,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createFooterGeneralTableQuery);
    console.log('Table "footer_general" initialized successfully.');

    // Seed default footer general settings
    const [footerGeneralRows] = await connection.query('SELECT COUNT(*) as count FROM `footer_general`');
    if (footerGeneralRows[0].count === 0) {
      console.log('Seeding default "footer_general" records...');
      const seedFooterGeneralQuery = `
        INSERT INTO \`footer_general\` (\`about_text\`, \`facebook_url\`, \`linkedin_url\`)
        VALUES (
          'At GGL, we are proud to be one of Singapore\\'s leading logistics companies. We offer specialized divisions in warehousing, forwarding (air and ocean), and transportation. Our mission is to deliver comprehensive end-to-end solutions in global freight forwarding, managed through a trusted network of partners who excel in all logistics segments.',
          'https://www.facebook.com/gglusa',
          'https://www.linkedin.com/company/gglus/'
        )
      `;
      await connection.query(seedFooterGeneralQuery);
      console.log('Seeded "footer_general" records successfully.');
    }

    // Auto-create the footer_content table
    const createFooterContentTableQuery = `
      CREATE TABLE IF NOT EXISTS \`footer_content\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`country_code\` VARCHAR(10) NOT NULL,
        \`office_index\` INT NOT NULL DEFAULT 0,
        \`title\` VARCHAR(255) NOT NULL,
        \`address\` TEXT NOT NULL,
        \`phone\` VARCHAR(255) NULL,
        \`email\` VARCHAR(255) NULL,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY \`country_office\` (\`country_code\`, \`office_index\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createFooterContentTableQuery);
    console.log('Table "footer_content" initialized successfully.');

    // Seed default footer content records
    const [footerContentRows] = await connection.query('SELECT COUNT(*) as count FROM `footer_content`');
    if (footerContentRows[0].count === 0) {
      console.log('Seeding default "footer_content" records...');
      const seedFooterContentQuery = `
        INSERT INTO \`footer_content\` 
          (\`country_code\`, \`office_index\`, \`title\`, \`address\`, \`phone\`, \`email\`)
        VALUES
          ('SG', 0, 'GGL (Singapore) Pte Ltd.', 'Blk 511 Kampong Bahru Road\\n#03-01 Keppel Distripark\\nSingapore - 099447', '+65 69080838', 'june@ggl.sg'),
          ('BD', 0, 'GGL (Bangladesh) Ltd.', 'ID #9-N (New), 9-M(Old-N), 9th floor, Tower 1, Police Plaza Concord No.2, Road # 144, Gulshan Model Town, Dhaka 1215, Bangladesh', '', 'info.bd@ggl.sg'),
          ('PK', 0, 'GGL (Pakistan) - Karachi', 'Suite No. 507 & 508, 5th Floor Fortune Center, Block-6, P.E.C.H.S, Shahrah-e-Faisal, Karachi, Pakistan.', '+92 21 34542881 / +92 21 34542882 / +92 21 34542883 / +92 21 34542884', 'info.pk@ggl.sg'),
          ('UK', 0, 'GGL (UK) Ltd.', '15 Woodlands Park Villas, North Gosforth , NE136PR , Newcastle Upon Tyne, United Kingdom.', '+44(0)7305 856 612', 'Sukant@ggl.sg'),
          ('MY', 0, 'GGL (Malaysia) - Port Klang', 'MTBBT 2, 3A-5, Jalan Batu Nilam 16, The Landmark (Behind AEON Mall), Bandar Bukit Tinggi 2, 41200 Klang, Selangor D.E', '+603 - 3319 2778 / 74 / 75', 'jayesh@ggl.sg'),
          ('MY', 1, 'GGL (Malaysia) - Pasir Gudang', 'Unit 20-03A, Level 20 Menara Zurich, 15 Jalan Dato Abdullah Tahir, 80300 Johor Bahru', '603-3319 2778 / 74 / 75, 79', 'jayesh@ggl.sg')
      `;
      await connection.query(seedFooterContentQuery);
      console.log('Seeded "footer_content" records successfully.');
    }

    // Auto-create the navigation_bar table
    const createNavBarTableQuery = `
      CREATE TABLE IF NOT EXISTS \`navigation_bar\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`home_label\` VARCHAR(100) NOT NULL DEFAULT 'Home',
        \`info_label\` VARCHAR(100) NOT NULL DEFAULT 'Info',
        \`about_label\` VARCHAR(100) NOT NULL DEFAULT 'About Us',
        \`careers_label\` VARCHAR(100) NOT NULL DEFAULT 'Careers',
        \`services_label\` VARCHAR(100) NOT NULL DEFAULT 'Services',
        \`global_presence_label\` VARCHAR(100) NOT NULL DEFAULT 'Global Presence',
        \`contact_label\` VARCHAR(100) NOT NULL DEFAULT 'Contact / Quote',
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createNavBarTableQuery);
    console.log('Table "navigation_bar" initialized successfully.');

    // Seed default navigation bar labels if empty
    const [navBarRows] = await connection.query('SELECT COUNT(*) as count FROM `navigation_bar`');
    if (navBarRows[0].count === 0) {
      console.log('Seeding default "navigation_bar" records...');
      const seedNavBarQuery = `
        INSERT INTO \`navigation_bar\` 
          (\`home_label\`, \`info_label\`, \`about_label\`, \`careers_label\`, \`services_label\`, \`global_presence_label\`, \`contact_label\`)
        VALUES 
          ('Home', 'Info', 'About Us', 'Careers', 'Services', 'Global Presence', 'Contact / Quote')
      `;
      await connection.query(seedNavBarQuery);
      console.log('Seeded "navigation_bar" records successfully.');
    }

    // Auto-create the about_us_page table
    const createAboutUsPageTableQuery = `
      CREATE TABLE IF NOT EXISTS \`about_us_page\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`country_code\` VARCHAR(10) NOT NULL UNIQUE,
        \`hero_title\` VARCHAR(255) NOT NULL,
        \`hero_subtitle\` TEXT NULL,
        \`about_title\` VARCHAR(255) NOT NULL,
        \`paragraph_1\` TEXT NOT NULL,
        \`paragraph_2\` TEXT NOT NULL,
        \`paragraph_3\` TEXT NOT NULL,
        \`paragraph_4\` TEXT NULL,
        \`image_url\` VARCHAR(255) NOT NULL,
        \`floating_card_title\` VARCHAR(255) NULL,
        \`floating_card_subtitle\` VARCHAR(255) NULL,
        \`final_paragraph\` TEXT NULL,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createAboutUsPageTableQuery);
    console.log('Table "about_us_page" initialized successfully.');

    // Seed default About Us page records
    const [aboutUsPageRows] = await connection.query('SELECT COUNT(*) as count FROM `about_us_page`');
    if (aboutUsPageRows[0].count === 0) {
      console.log('Seeding default "about_us_page" records...');
      const seedAboutUsPageQuery = `
        INSERT INTO \`about_us_page\` 
          (\`country_code\`, \`hero_title\`, \`hero_subtitle\`, \`about_title\`, \`paragraph_1\`, \`paragraph_2\`, \`paragraph_3\`, \`paragraph_4\`, \`image_url\`, \`floating_card_title\`, \`floating_card_subtitle\`, \`final_paragraph\`)
        VALUES
          ('SG', 'About GGL', '', 'About GGL', 
           'GGL is a proud subsidiary of 1 Global Enterprises, a Singapore-based investment group with a robust and diverse portfolio spanning freight forwarding, supply chain management, and logistics technology. As part of this global network, GGL leverages strategic investments across multiple brands specializing in transportation, warehousing, and integrated supply chain solutions.',
           'With a strong foundation backed by 1 Global Enterprises’ industry expertise and innovation-driven approach, GGL delivers seamless, technology-enabled logistics solutions. This affiliation ensures operational excellence, financial stability, and access to world-class infrastructure—positioning GGL as a leading provider of end-to-end global logistics services.',
           'The 1 Global Group operates in 16 countries with a dedicated team of over 700 professionals. Its business verticals include Supply Chain Solutions, Renewable Energy, Information Technology, and Business Process Outsourcing, each managed by domain experts committed to delivering impactful results.',
           NULL,
           '/lovable-uploads/41795fb5-562d-45d1-a8d3-f26724bc079b.png',
           '',
           '',
           'With the support of our in-house IT company, we are making significant investments in cutting-edge technologies—including Artificial Intelligence, Automation, and Data Analytics—to optimize operations and enhance transparency, efficiency, and client satisfaction.'),
          ('BD', 'GGL Bangladesh: Logistics Excellence in Dhaka', 'Local expertise powered by our global network to keep Bangladesh supply chains moving by sea, air, and road.', 'About Us',
           'GGL Bangladesh blends global reach with Dhaka-based execution. Our team coordinates LCL consolidation, air freight, and domestic distribution tailored to the Bangladeshi market.',
           'Strategically positioned in Dhaka with access to Chattogram and air gateways, we connect shippers to worldwide ports through direct weekly sailings and competitive air schedules.',
           'We prioritize neutral LCL solutions for forwarders and NVOCCs, backed by transparent pricing, reliable cut-offs, and dedicated customer service.',
           'With modern tracking and documentation support, GGL Bangladesh keeps your cargo visible from factory pickup to final delivery.',
           '/oceanf.png',
           'Global Network',
           '50+ countries worldwide',
           ''),
          ('PK', 'GGL Pakistan: Gateway to Global Logistics', 'Leading end-to-end logistics solutions connecting Karachi and the world.', 'About Us',
           'GGL Pakistan offers a comprehensive portfolio of supply chain services, integrating ocean freight, air cargo, and inland haulage across Pakistan.',
           'Based in Karachi with strategic presence at key air and sea ports, we specialize in LCL consolidation and complex project logistics.',
           'Our commitment is to deliver neutral consolidation solutions, giving local forwarders reliable weekly departures and competitive options.',
           'We run a technology-driven network to ensure tracking transparency and smooth customs clearance for all imports and exports.',
           '/oceanf.png',
           'Custom Solutions',
           'Tailored logistic plans',
           ''),
          ('UK', 'About GGL UK', 'Dynamic logistics solutions supporting UK import, export, and distribution.', 'About Us',
           'GGL UK provides flexible supply chain options that connect the British markets with international logistics hubs.',
           'From our UK presence, we coordinate customs coordination, road transport, ocean freight, and premium air freight.',
           'We partner with leading ocean carriers and airlines to secure space allocations, providing reliable schedules year-round.',
           'Our proactive team is focused on delivering cost-effective and secure shipping solutions for business clients.',
           '/lovable-uploads/41795fb5-562d-45d1-a8d3-f26724bc079b.png',
           'Global Standards',
           'Highest security & safety',
           ''),
          ('MY', 'GGL Malaysia: Connecting Port Klang & Pasir Gudang', 'Optimized distribution and freight services across Southeast Asia.', 'About Us',
           'GGL Malaysia provides specialized supply chain solutions out of Port Klang and Pasir Gudang to keep cargo moving seamlessly.',
           'Our local offices coordinate ocean imports/exports, bonded warehousing, customs brokerage, and local distribution.',
           'We deliver neutral LCL consolidation services tailored to regional freight forwarders and international traders.',
           'Supported by advanced digital tools, GGL Malaysia ensures full transparency, efficiency, and reliability.',
           '/oceanf.png',
           'Strategic Locations',
           'Klang & Johor hubs',
           '')
      `;
      await connection.query(seedAboutUsPageQuery);
      console.log('Seeded "about_us_page" records successfully.');
    }

    // Auto-create the careers_page table
    const createCareersPageTableQuery = `
      CREATE TABLE IF NOT EXISTS \`careers_page\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`country_code\` VARCHAR(10) NOT NULL UNIQUE,
        \`hero_title\` VARCHAR(255) NOT NULL,
        \`hero_subtitle\` TEXT NOT NULL,
        \`hero_button_text\` VARCHAR(100) NOT NULL DEFAULT 'View Open Positions',
        \`why_join_title\` VARCHAR(255) NOT NULL,
        \`why_join_description\` TEXT NOT NULL,
        \`opportunities_title\` VARCHAR(255) NOT NULL,
        \`opportunities_description\` TEXT NOT NULL,
        \`opportunities_status\` TEXT NOT NULL,
        \`cta_title\` VARCHAR(255) NOT NULL,
        \`cta_subtitle\` TEXT NOT NULL,
        \`cta_btn1_label\` VARCHAR(100) NOT NULL DEFAULT 'Submit Your Resume',
        \`cta_btn2_label\` VARCHAR(100) NOT NULL DEFAULT 'Contact HR',
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createCareersPageTableQuery);
    console.log('Table "careers_page" initialized successfully.');

    // Seed default Careers page records
    const [careersPageRows] = await connection.query('SELECT COUNT(*) as count FROM `careers_page`');
    if (careersPageRows[0].count === 0) {
      console.log('Seeding default "careers_page" records...');
      const seedCareersPageQuery = `
        INSERT INTO \`careers_page\` 
          (\`country_code\`, \`hero_title\`, \`hero_subtitle\`, \`hero_button_text\`, \`why_join_title\`, \`why_join_description\`, \`opportunities_title\`, \`opportunities_description\`, \`opportunities_status\`, \`cta_title\`, \`cta_subtitle\`, \`cta_btn1_label\`, \`cta_btn2_label\`)
        VALUES
          ('SG', 'Join Our Global Team', 'Build your career with one of Singapore\'s leading logistics companies. We\'re looking for passionate individuals to join our mission of connecting the world through exceptional logistics solutions.', 'View Open Positions', 'Why Choose GGL?', 'At GGL, we believe our people are our greatest asset. We foster an environment where talent thrives and careers flourish.', 'Current Opportunities', 'Explore exciting career opportunities across our various departments and locations.', 'Career opportunities coming soon. Stay tuned!', 'Ready to Start Your Journey?', 'Don\'t see the right position? Send us your resume and we\'ll keep you in mind for future opportunities.', 'Submit Your Resume', 'Contact HR'),
          ('BD', 'Join Our Team in Bangladesh', 'Build your career with one of Bangladesh\'s leading logistics companies. We\'re looking for passionate individuals to join our mission of connecting the world through exceptional logistics solutions.', 'View Open Positions', 'Why Choose GGL?', 'At GGL, we believe our people are our greatest asset. We foster an environment where talent thrives and careers flourish.', 'Current Opportunities', 'Explore exciting career opportunities across our various departments and locations.', 'Career opportunities coming soon. Stay tuned!', 'Ready to Start Your Journey?', 'Don\'t see the right position? Send us your resume and we\'ll keep you in mind for future opportunities.', 'Submit Your Resume', 'Contact HR'),
          ('PK', 'Join Our Pakistan Team', 'Build your career with one of Pakistan\'s leading logistics companies. We\'re looking for passionate individuals to join our mission of connecting the world through exceptional logistics solutions.', 'View Open Positions', 'Why Choose GGL?', 'At GGL, we believe our people are our greatest asset. We foster an environment where talent thrives and careers flourish.', 'Current Opportunities', 'Explore exciting career opportunities across our various departments and locations.', 'Career opportunities coming soon. Stay tuned!', 'Ready to Start Your Journey?', 'Don\'t see the right position? Send us your resume and we\'ll keep you in mind for future opportunities.', 'Submit Your Resume', 'Contact HR'),
          ('UK', 'Join Our UK Team', 'Build your career with one of UK\'s leading logistics companies. We\'re looking for passionate individuals to join our mission of connecting the world through exceptional logistics solutions.', 'View Open Positions', 'Why Choose GGL?', 'At GGL, we believe our people are our greatest asset. We foster an environment where talent thrives and careers flourish.', 'Current Opportunities', 'Explore exciting career opportunities across our various departments and locations.', 'Career opportunities coming soon. Stay tuned!', 'Ready to Start Your Journey?', 'Don\'t see the right position? Send us your resume and we\'ll keep you in mind for future opportunities.', 'Submit Your Resume', 'Contact HR'),
          ('MY', 'Join Our Malaysia Team', 'Build your career with one of Malaysia\'s leading logistics companies. We\'re looking for passionate individuals to join our mission of connecting the world through exceptional logistics solutions.', 'View Open Positions', 'Why Choose GGL?', 'At GGL, we believe our people are our greatest asset. We foster an environment where talent thrives and careers flourish.', 'Current Opportunities', 'Explore exciting career opportunities across our various departments and locations.', 'Career opportunities coming soon. Stay tuned!', 'Ready to Start Your Journey?', 'Don\'t see the right position? Send us your resume and we\'ll keep you in mind for future opportunities.', 'Submit Your Resume', 'Contact HR')
      `;
      await connection.query(seedCareersPageQuery);
      console.log('Seeded "careers_page" records successfully.');
    }

    // Auto-create the services_page table
    const createServicesPageTableQuery = `
      CREATE TABLE IF NOT EXISTS \`services_page\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`country_code\` VARCHAR(10) NOT NULL UNIQUE,
        \`hero_title\` VARCHAR(255) NOT NULL,
        \`hero_subtitle\` TEXT NOT NULL,
        \`services_title\` VARCHAR(255) NOT NULL,
        \`services_description\` TEXT NOT NULL,
        \`why_choose_title\` VARCHAR(255) NOT NULL,
        \`why_choose_description\` TEXT NOT NULL,
        \`cta_btn_text\` VARCHAR(100) NOT NULL DEFAULT 'Request a Quote',
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createServicesPageTableQuery);
    console.log('Table "services_page" initialized successfully.');

    // Seed default Services page records
    const [servicesPageRows] = await connection.query('SELECT COUNT(*) as count FROM `services_page`');
    if (servicesPageRows[0].count === 0) {
      console.log('Seeding default "services_page" records...');
      const seedServicesPageQuery = `
        INSERT INTO \`services_page\` 
          (\`country_code\`, \`hero_title\`, \`hero_subtitle\`, \`services_title\`, \`services_description\`, \`why_choose_title\`, \`why_choose_description\`, \`cta_btn_text\`)
        VALUES
          ('SG', 'Our Logistics Services', 'From air and ocean freight to specialized transportation solutions, we offer end-to-end logistics expertise to meet your global shipping needs.', 'All Services', 'Explore our comprehensive range of services designed to meet all your logistics requirements.', 'Why Choose Our Logistics Services?', 'We combine industry expertise, advanced technology, and personalized care to deliver exceptional logistics solutions.', 'Request a Quote'),
          ('BD', 'Our Logistics Services in Bangladesh', 'From air and ocean freight to specialized transportation solutions, we offer end-to-end logistics expertise to meet your global shipping needs.', 'All Services', 'Explore our comprehensive range of services designed to meet all your logistics requirements.', 'Why Choose Our Logistics Services?', 'We combine industry expertise, advanced technology, and personalized care to deliver exceptional logistics solutions.', 'Request a Quote'),
          ('PK', 'Our Logistics Services in Pakistan', 'From air and ocean freight to specialized transportation solutions, we offer end-to-end logistics expertise to meet your global shipping needs.', 'All Services', 'Explore our comprehensive range of services designed to meet all your logistics requirements.', 'Why Choose Our Logistics Services?', 'We combine industry expertise, advanced technology, and personalized care to deliver exceptional logistics solutions.', 'Request a Quote'),
          ('UK', 'Our Logistics Services in the UK', 'From air and ocean freight to specialized transportation solutions, we offer end-to-end logistics expertise to meet your global shipping needs.', 'All Services', 'Explore our comprehensive range of services designed to meet all your logistics requirements.', 'Why Choose Our Logistics Services?', 'We combine industry expertise, advanced technology, and personalized care to deliver exceptional logistics solutions.', 'Request a Quote'),
          ('MY', 'Our Logistics Services in Malaysia', 'From air and ocean freight to specialized transportation solutions, we offer end-to-end logistics expertise to meet your global shipping needs.', 'All Services', 'Explore our comprehensive range of services designed to meet all your logistics requirements.', 'Why Choose Our Logistics Services?', 'We combine industry expertise, advanced technology, and personalized care to deliver exceptional logistics solutions.', 'Request a Quote')
      `;
      await connection.query(seedServicesPageQuery);
      console.log('Seeded "services_page" records successfully.');
    }

    // Auto-create the service_details table
    const createServiceDetailsTableQuery = `
      CREATE TABLE IF NOT EXISTS \`service_details\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`country_code\` VARCHAR(10) NOT NULL,
        \`service_slug\` VARCHAR(100) NOT NULL,
        \`hero_title\` VARCHAR(255) NULL,
        \`hero_subtitle\` TEXT NULL,
        \`hero_image_url\` VARCHAR(255) NULL,
        \`section1_title\` VARCHAR(255) NULL,
        \`section1_content\` TEXT NULL,
        \`section1_image_url\` VARCHAR(255) NULL,
        \`features_title\` VARCHAR(255) NULL,
        \`features_list\` TEXT NULL,
        \`cta_title\` VARCHAR(255) NULL,
        \`cta_button_text\` VARCHAR(255) NULL,
        \`cta_button_link\` VARCHAR(255) NULL,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY \`country_service\` (\`country_code\`, \`service_slug\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createServiceDetailsTableQuery);
    console.log('Table "service_details" initialized successfully.');

    // Seed default Service details records
    const [serviceDetailsRows] = await connection.query('SELECT COUNT(*) as count FROM `service_details`');
    if (serviceDetailsRows[0].count === 0) {
      console.log('Seeding default "service_details" records...');
      const countriesList = ['SG', 'BD', 'PK', 'UK', 'MY'];
      const defaultServicesList = [
        {
          slug: 'ocean-freight',
          title: 'Ocean Freight Solutions',
          subtitle: 'Connecting you globally with comprehensive ocean freight services',
          img: '/lovable-uploads/2505b196-c548-4e6f-b9af-68ce9c9dff10.png',
          sec_title: 'Comprehensive Ocean Freight Services',
          sec_content: 'GGL’s dedicated ocean freight department specializes in complete freight management services for LCL and FCL loads, supported by a reliable global partner network, offering efficient collection, storage, and delivery from shipper to consignee with customs brokerage.',
          sec_img: '/lovable-uploads/oceanfrieght.jpg',
          features_title: 'Key Features',
          features: ['Full Container Load (FCL)', 'Less than Container Load (LCL)', 'Customs Brokerage & Clearance', 'Weekly Scheduled Sailings', 'End-to-End Tracking'],
          cta_title: 'Ready to Ship Your Cargo?',
          cta_btn: 'Get a Quote',
          cta_link: '/contact'
        },
        {
          slug: 'air-freight',
          title: 'Air Freight Solutions',
          subtitle: 'Fast and reliable global air cargo services for time-critical shipments',
          img: '/cargoplane.png',
          sec_title: 'Premium Air Freight Services',
          sec_content: 'At GGL, we provide a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams offer seamless air import, export, and express options, all on a convenient door-to-door basis.',
          sec_img: '/cargoplane.png',
          features_title: 'Key Features',
          features: ['Priority Air Freight', 'Door-to-Door Delivery', 'Express Air Courier', 'Temperature-Controlled Shipping', 'Dangerous Goods Handling'],
          cta_title: 'Need Fast Shipping?',
          cta_btn: 'Get a Quote',
          cta_link: '/contact'
        },
        {
          slug: 'transportation',
          title: 'Transportation & Distribution',
          subtitle: 'Efficient domestic transport and fleet logistics solutions',
          img: '/truck12.png',
          sec_title: 'Reliable Ground Transportation',
          sec_content: 'GGL boasts a dedicated fleet of vehicles to ensure timely domestic distribution and deliveries. Our efficient operational infrastructure provides our clients with high productivity, frequent services, and fast, reliable distribution operations.',
          sec_img: '/truck12.png',
          features_title: 'Key Features',
          features: ['Dedicated Fleet Logistics', 'GPS Tracking & Monitoring', 'Last-Mile Delivery', 'Scheduled Distribution', 'Cross-Border Trucking'],
          cta_title: 'Optimize Your Distribution?',
          cta_btn: 'Get a Quote',
          cta_link: '/contact'
        },
        {
          slug: 'warehousing',
          title: 'Warehousing Solutions',
          subtitle: 'Secure storage, fulfillment, and 3PL supply chain services',
          img: '/lovable-uploads/warehouse.jpg',
          sec_title: 'Secure Storage & 3PL Logistics',
          sec_content: 'GGL is a premier supply chain solutions provider, addressing the full spectrum of logistics needs for our clients. We facilitate the movement of goods from suppliers to manufacturers, resellers, and distributors.',
          sec_img: '/lovable-uploads/warehouse.jpg',
          features_title: 'Key Features',
          features: ['Secure Storage & Vaults', 'Inventory Management', 'Pick and Pack Fulfillment', '3PL & 4PL Logistics', 'Cross-Docking Services'],
          cta_title: 'Need Warehousing Space?',
          cta_btn: 'Get a Quote',
          cta_link: '/contact'
        },
        {
          slug: 'lcl-consolidation',
          title: 'LCL Consolidation',
          subtitle: 'Global groupage cargo solutions at competitive rates',
          img: '/lcl.png',
          sec_title: 'Neutral LCL Consolidation',
          sec_content: 'GGL is a leading LCL Consolidator with a robust global presence. We compile weekly consolidation services to key transshipment hubs, providing reliable groupage options with full support.',
          sec_img: '/lcl.png',
          features_title: 'Key Features',
          features: ['Direct Weekly Departures', 'Neutral Consolidation', 'Global Network Hubs', 'Competitive Freight Pricing', 'Cargo Care & Security'],
          cta_title: 'Have Smaller Consignments?',
          cta_btn: 'Get a Quote',
          cta_link: '/contact'
        },
        {
          slug: 'project-cargo',
          title: 'Project Cargo Logistics',
          subtitle: 'Specialized handling and transport of heavy, complex, or high-value shipments',
          img: '/projectcargo3.png',
          sec_title: 'Complex Project Logistics',
          sec_content: 'Project cargo refers to the specialized transportation of large, heavy, high-value, or complex equipment, often associated with large-scale infrastructure, energy, or construction projects.',
          sec_img: '/projectcargo3.png',
          features_title: 'Key Features',
          features: ['Heavy Lift Transportation', 'Route Surveys & Feasibility', 'Custom Clearance Handling', 'On-site Project Supervision', 'Risk Management Planning'],
          cta_title: 'Running a Complex Project?',
          cta_btn: 'Get a Quote',
          cta_link: '/contact'
        }
      ];

      for (const country of countriesList) {
        for (const svc of defaultServicesList) {
          let cta_link = '/contact';
          if (country === 'BD') cta_link = '/bangladesh/contact';
          if (country === 'PK') cta_link = '/pakistan/contact';
          if (country === 'MY') cta_link = '/malaysia/contact';
          if (country === 'UK') cta_link = '/uk/contact';

          await connection.query(
            `INSERT INTO \`service_details\` 
              (\`country_code\`, \`service_slug\`, \`hero_title\`, \`hero_subtitle\`, \`hero_image_url\`, \`section1_title\`, \`section1_content\`, \`section1_image_url\`, \`features_title\`, \`features_list\`, \`cta_title\`, \`cta_button_text\`, \`cta_button_link\`)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              country,
              svc.slug,
              svc.title,
              svc.subtitle,
              svc.img,
              svc.sec_title,
              svc.sec_content,
              svc.sec_img,
              svc.features_title,
              JSON.stringify(svc.features),
              svc.cta_title,
              svc.cta_btn,
              cta_link
            ]
          );
        }
      }
      console.log('Seeded default "service_details" records successfully.');
    }

    // Auto-create the contact_page_content table
    const createContactPageTableQuery = `
      CREATE TABLE IF NOT EXISTS \`contact_page_content\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`country_code\` VARCHAR(10) NOT NULL UNIQUE,
        \`title\` VARCHAR(255) NOT NULL DEFAULT 'Get in Touch',
        \`subtitle\` TEXT NOT NULL,
        \`email_recipient\` VARCHAR(255) NOT NULL DEFAULT 'june@ggl.sg',
        \`phone\` VARCHAR(255) NOT NULL DEFAULT '+65 69080838',
        \`address\` TEXT NOT NULL,
        \`map_iframe_url\` TEXT NOT NULL,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createContactPageTableQuery);
    console.log('Table "contact_page_content" initialized successfully.');

    // Seed default contact_page_content records
    const [contactPageRows] = await connection.query('SELECT COUNT(*) as count FROM `contact_page_content`');
    if (contactPageRows[0].count === 0) {
      console.log('Seeding default "contact_page_content" records...');
      const seedContactPageQuery = `
        INSERT INTO \`contact_page_content\` 
          (\`country_code\`, \`title\`, \`subtitle\`, \`email_recipient\`, \`phone\`, \`address\`, \`map_iframe_url\`) 
        VALUES 
          ('SG', 'Get in Touch', 'We\\'re here to help and answer any questions you might have.', 'June@ggl.sg', '+65 69080838', 'GGL (Singapore) Pte Ltd. Blk 511 Kampong Bahru Road #03-01 Keppel Distripark, Singapore - 099447', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1'),
          ('BD', 'Get in Touch', 'We\\'re here to help and answer any questions you might have.', 'info.bd@ggl.sg', '+880 1716 620989', 'ID #9-N (New), 9-M(Old-N), 9th floor, Tower 1, Police Plaza Concord No.2, Road # 144, Gulshan Model Town, Dhaka 1215, Bangladesh', 'https://www.google.com/maps/d/embed?mid=1n4WqX2KvVrDhYom0GMJ0FxbmZsRY8aQ&ehbc=2E312F&noprof=1'),
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
          ('US', 'Contact Us - USA', 'Get in touch with our USA offices.', 'info@gglusa.us', '+1 847 254 7320', '939 W. North Avenue, Suite 750, Chicago, IL 60642', 'https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1')
      `;
      await connection.query(seedContactPageQuery);
      console.log('Seeded "contact_page_content" records successfully.');
    }

    connection.release();
  } catch (error) {
    console.error('Database connection / initialization failed:', error.message);
    pool = null;
    console.error('Ensure that:');
    console.error('1. Your DB_HOST in the .env file is correct (Hostinger server IP or main-hosting hostname).');
    console.error('2. Remote connections are allowed in your Hostinger panel (Access host %).');
    console.error('3. Local firewall is not blocking port 3306.');
  }
}

// Helper to parse extra_meta string to object
function parseRecord(row) {
  if (!row) return row;
  let extra_meta = null;
  if (row.extra_meta) {
    try {
      extra_meta = JSON.parse(row.extra_meta);
    } catch (e) {
      const meta = {};
      row.extra_meta.split('\n').forEach(line => {
        const idx = line.indexOf('=');
        if (idx > 0) {
          const k = line.substring(0, idx).trim();
          const v = line.substring(idx + 1).trim();
          if (k) meta[k] = v;
        }
      });
      extra_meta = Object.keys(meta).length > 0 ? meta : null;
    }
  }
  return {
    ...row,
    extra_meta
  };
}

const DEFAULT_ABOUT_US = [
  {
    country_code: 'SG',
    title: 'About Us',
    content_paragraph_1: 'At GGL, we are proud to be one of Singapore\'s leading logistics companies. We offer specialized divisions in warehousing, forwarding (air and ocean), and transportation. Our mission is to deliver comprehensive end-to-end solutions in global freight forwarding, managed through a trusted network of partners who excel in all logistics segments.',
    content_paragraph_2: 'We are dedicated to fostering deep, collaborative relationships with our clients, and creating genuine partnerships that drive mutual growth. Our work goes beyond forwarding and logistics; it\'s about building trust with our customers by delivering world-class service and solutions.',
    image_url: '/lovable-uploads/3c0c858f-8cb2-4284-b2f7-ea7bf2b6d6df.png',
    button_text: 'Learn More',
    learn_more_path: '/about',
    updated_at: null
  },
  {
    country_code: 'BD',
    title: 'About Us',
    content_paragraph_1: 'GGL is a trusted global leader in LCL (Less-than-Container Load) consolidation. With a robust presence across North America, the UK, the Middle East, the Indian Subcontinent, Southeast Asia, and the Far East, we offer streamlined groupage services backed by strong customer support and competitive pricing.',
    content_paragraph_2: 'We are Strategically positioned in major transshipment hubs like Singapore, Malaysia, Sri Lanka, and Dubai, GGL operates direct weekly sailings to key global ports. Our expansive network ensures fast, reliable, and cost-effective consolidation options for freight forwarders and logistics providers.',
    image_url: '/lovable-uploads/14c89acc-9c64-4484-b520-f5142136ccc6.png',
    button_text: 'Learn More',
    learn_more_path: '/bangladesh/about',
    updated_at: null
  },
  {
    country_code: 'MY',
    title: 'About Us',
    content_paragraph_1: 'GGL is a trusted global leader in LCL (Less-than-Container Load) consolidation. With a robust presence across North America, the UK, the Middle East, the Indian Subcontinent, Southeast Asia, and the Far East, we offer streamlined groupage services backed by strong customer support and competitive pricing.',
    content_paragraph_2: 'We are Strategically positioned in major transshipment hubs like Singapore, Malaysia, Sri Lanka, and Dubai, GGL operates direct weekly sailings to key global ports. Our expansive network ensures fast, reliable, and cost-effective consolidation options for freight forwarders and logistics providers.',
    image_url: '/lovable-uploads/14c89acc-9c64-4484-b520-f5142136ccc6.png',
    button_text: 'Learn More',
    learn_more_path: '/malaysia/about',
    updated_at: null
  },
  {
    country_code: 'PK',
    title: 'About Us',
    content_paragraph_1: 'GGL is a trusted global leader in LCL (Less-than-Container Load) consolidation. With a robust presence across North America, the UK, the Middle East, the Indian Subcontinent, Southeast Asia, and the Far East, we offer streamlined groupage services backed by strong customer support and competitive pricing.',
    content_paragraph_2: 'We are Strategically positioned in major transshipment hubs like Singapore, Malaysia, Sri Lanka, and Dubai, GGL operates direct weekly sailings to key global ports. Our expansive network ensures fast, reliable, and cost-effective consolidation options for freight forwarders and logistics providers.',
    image_url: '/lovable-uploads/14c89acc-9c64-4484-b520-f5142136ccc6.png',
    button_text: 'Learn More',
    learn_more_path: '/pakistan/about',
    updated_at: null
  },
  {
    country_code: 'UK',
    title: 'About Us',
    content_paragraph_1: 'GGL is a trusted global leader in logistics and consolidation. With a robust presence in the UK and across the globe, we offer streamlined services backed by strong customer support and competitive pricing.',
    content_paragraph_2: 'Strategically positioned to serve the UK market, GGL connects businesses to key global ports and hubs. Our expansive network ensures fast, reliable, and cost-effective options for freight forwarders and logistics providers.',
    image_url: '/Uabout.png',
    button_text: 'Learn More',
    learn_more_path: '/uk/about',
    updated_at: null
  }
];

// Fallback JSON File storage helpers
const aboutUsFallbackFile = path.join(__dirname, 'fallback_about_us.json');
let localAboutUs = [...DEFAULT_ABOUT_US];
if (fs.existsSync(aboutUsFallbackFile)) {
  try {
    localAboutUs = JSON.parse(fs.readFileSync(aboutUsFallbackFile, 'utf8'));
  } catch (e) {
    console.error('Error loading fallback_about_us.json:', e);
  }
}

function saveLocalAboutUs() {
  try {
    fs.writeFileSync(aboutUsFallbackFile, JSON.stringify(localAboutUs, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving fallback_about_us.json:', e);
  }
}

const seoFallbackFile = path.join(__dirname, 'fallback_seo.json');
let localSeo = [];
if (fs.existsSync(seoFallbackFile)) {
  try {
    localSeo = JSON.parse(fs.readFileSync(seoFallbackFile, 'utf8'));
  } catch (e) {
    console.error('Error loading fallback_seo.json:', e);
  }
}

function saveLocalSeo() {
  try {
    fs.writeFileSync(seoFallbackFile, JSON.stringify(localSeo, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving fallback_seo.json:', e);
  }
}

const servicesFallbackFile = path.join(__dirname, 'fallback_services.json');
const DEFAULT_SERVICES = [
  { country_code: 'SG', service_index: 0, title: 'Ocean Freight', description: 'GGL\'s dedicated ocean freight department specialize in the complete range freight management services for LCL and FCL loads, supported thru a well established and reliable partner network around the world, for efficient collection, storage & delivery from shippers door to door.', image_url: '/lovable-uploads/oceanfrieght.jpg', link: '/services/ocean-freight', icon_type: 'Anchor' },
  { country_code: 'SG', service_index: 1, title: 'Air Freight', description: 'At GGL, we provide a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams offer seamless air import, export, and express options, all on a convenient door-to-door basis. GGL stands out with competitive rates.', image_url: '/cargoplane.png', link: '/services/air-freight', icon_type: 'Plane' },
  { country_code: 'SG', service_index: 2, title: 'Transportation And Distribution', description: 'GGL boasts a dedicated fleet of vehicles to ensure timely domestic distribution and deliveries. Our efficient operational infrastructure provides our clients with high productivity, frequent services, and fast, reliable distribution operations. GGL is committed to delivering excellence.', image_url: '/truck12.png', link: '/services/transportation', icon_type: 'Truck' },
  { country_code: 'SG', service_index: 3, title: 'Warehousing', description: 'GGL is a premier supply chain solutions provider in Singapore, addressing the full spectrum of logistics needs for our clients. We facilitate the movement of goods from suppliers to manufacturers (for parts and components), from manufacturers and brand owners to resellers and distributors.', image_url: '/lovable-uploads/warehouse.jpg', link: '/services/warehousing', icon_type: 'Warehouse' },
  { country_code: 'SG', service_index: 4, title: 'LCL Consolidation', description: 'GGL is a LCL Consolidator with global presence covering North America, UK, Middle East, Indian Sub Continent, South East Asia and Far East. Our LCL Groupage services is backed by very efficient customer support at competitive prices.', image_url: '/lcl.png', link: '/services/lcl-consolidation', icon_type: 'Warehouse' },
  { country_code: 'SG', service_index: 5, title: 'Project Cargo', description: 'Project cargo refers to the specialized transportation of large, heavy, high-value, or complex equipment, often associated with large-scale infrastructure or construction projects.', image_url: '/projectcargo3.png', link: '/services/project-cargo', icon_type: 'Package' },

  { country_code: 'BD', service_index: 0, title: 'Ocean Freight', description: 'At GGL India, we specialize in providing comprehensive ocean freight solutions that cater to the diverse needs of our clients. Whether you\'re shipping large volumes or smaller consignments, our services are designed to ensure efficiency, reliability, and cost-effectiveness', image_url: '/hom1.png', link: '/bangladesh/services/ocean-freight', icon_type: 'Anchor' },
  { country_code: 'BD', service_index: 1, title: 'LCL Consolidation', description: 'We collect your goods from your location and prepare them for consolidation. This includes proper labelling, packaging, and documentation to ensure smooth transit.', image_url: '/hom4.png', link: '/bangladesh/services/lcl-consolidation', icon_type: 'Warehouse' },
  { country_code: 'BD', service_index: 2, title: 'Transportation And Distribution', description: 'At GGL India, we understand that efficient transportation and distribution are the backbone of a seamless supply chain. Our dedicated fleet and robust infrastructure ensure that your goods reach their destination on time, every time.', image_url: '/hom3.png', link: '/bangladesh/services/transportation', icon_type: 'Truck' },
  { country_code: 'BD', service_index: 3, title: 'Warehousing', description: 'At GGL India, we offer comprehensive warehousing and third-party logistics (3PL) solutions designed to streamline your supply chain operations. Our services are tailored to meet the diverse needs of businesses, ensuring efficiency, reliability, and scalability.', image_url: '/warehosing.png', link: '/bangladesh/services/warehousing', icon_type: 'Warehouse' },
  { country_code: 'BD', service_index: 4, title: 'Air Freight', description: 'At GGL India, we offer a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams provide seamless air import, export, and express options, all on a convenient door-to-door basis.', image_url: '/aircargo1.png', link: '/bangladesh/services/air-freight', icon_type: 'Plane' },
  { country_code: 'BD', service_index: 5, title: 'Project Cargo', description: 'At GGL, we specialize in managing project cargo—the transportation of large, heavy, high-value, or complex pieces of equipment and materials essential to major infrastructure, engineering, or industrial projects.', image_url: '/cargoh1.png', link: '/bangladesh/services/project-cargo', icon_type: 'Warehouse' },

  { country_code: 'MY', service_index: 0, title: 'Ocean Freight', description: 'At GGL, we specialize in providing comprehensive ocean freight solutions that cater to the diverse needs of our clients. Whether you\'re shipping large volumes or smaller consignments, our services are designed to ensure efficiency, reliability, and cost-effectiveness', image_url: '/mocean.png', link: '/malaysia/services/ocean-freight', icon_type: 'Anchor' },
  { country_code: 'MY', service_index: 1, title: 'LCL Consolidation', description: 'We collect your goods from your location and prepare them for consolidation. This includes proper labelling, packaging, and documentation to ensure smooth transit.', image_url: '/mlcl.png', link: '/malaysia/services/lcl-consolidation', icon_type: 'Warehouse' },
  { country_code: 'MY', service_index: 2, title: 'Transportation And Distribution', description: 'At GGL, we understand that efficient transportation and distribution are the backbone of a seamless supply chain. Our dedicated fleet and robust infrastructure ensure that your goods reach their destination on time, every time.', image_url: '/mtransport.png', link: '/malaysia/services/transportation', icon_type: 'Truck' },
  { country_code: 'MY', service_index: 3, title: 'Warehousing', description: 'At GGL, we offer comprehensive warehousing and third-party logistics (3PL) solutions designed to streamline your supply chain operations. Our services are tailored to meet the diverse needs of businesses, ensuring efficiency, reliability, and scalability.', image_url: '/mwarehouse.png', link: '/malaysia/services/warehousing', icon_type: 'Warehouse' },
  { country_code: 'MY', service_index: 4, title: 'Air Freight', description: 'At GGL, we offer a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams provide seamless air import, export, and express options, all on a convenient door-to-door basis.', image_url: '/mair.png', link: '/malaysia/services/air-freight', icon_type: 'Plane' },
  { country_code: 'MY', service_index: 5, title: 'Project Cargo', description: 'At GGL, we specialize in managing project cargo—the transportation of large, heavy, high-value, or complex pieces of equipment and materials essential to major infrastructure, engineering, or industrial projects.', image_url: '/mproject.png', link: '/malaysia/services/project-cargo', icon_type: 'Warehouse' },

  { country_code: 'PK', service_index: 0, title: 'Ocean Freight', description: 'At GGL, we specialize in providing comprehensive ocean freight solutions that cater to the diverse needs of our clients. Whether you\'re shipping large volumes or smaller consignments, our services are designed to ensure efficiency, reliability, and cost-effectiveness', image_url: '/ps1.png', link: '/pakistan/services/ocean-freight', icon_type: 'Anchor' },
  { country_code: 'PK', service_index: 1, title: 'LCL Consolidation', description: 'We collect your goods from your location and prepare them for consolidation. This includes proper labelling, packaging, and documentation to ensure smooth transit.', image_url: '/ps5.png', link: '/pakistan/services/lcl-consolidation', icon_type: 'Warehouse' },
  { country_code: 'PK', service_index: 2, title: 'Transportation And Distribution', description: 'At GGL, we understand that efficient transportation and distribution are the backbone of a seamless supply chain. Our dedicated fleet and robust infrastructure ensure that your goods reach their destination on time, every time.', image_url: '/ps3.png', link: '/pakistan/services/transportation', icon_type: 'Truck' },
  { country_code: 'PK', service_index: 3, title: 'Warehousing', description: 'At GGL, we offer comprehensive warehousing and third-party logistics (3PL) solutions designed to streamline your supply chain operations. Our services are tailored to meet the diverse needs of businesses, ensuring efficiency, reliability, and scalability.', image_url: '/ps4.png', link: '/pakistan/services/warehousing', icon_type: 'Warehouse' },
  { country_code: 'PK', service_index: 4, title: 'Air Freight', description: 'At GGL, we offer a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams provide seamless air import, export, and express options, all on a convenient door-to-door basis.', image_url: '/ps2.png', link: '/pakistan/services/air-freight', icon_type: 'Plane' },
  { country_code: 'PK', service_index: 5, title: 'Project Cargo', description: 'At GGL, we specialize in managing project cargo—the transportation of large, heavy, high-value, or complex pieces of equipment and materials essential to major infrastructure, engineering, or industrial projects.', image_url: '/ps6.png', link: '/pakistan/services/project-cargo', icon_type: 'Warehouse' },

  { country_code: 'UK', service_index: 0, title: 'Ocean Freight', description: 'At GGL, we specialize in providing comprehensive ocean freight solutions that cater to the diverse needs of our clients. Whether you\'re shipping large volumes or smaller consignments, our services are designed to ensure efficiency, reliability, and cost-effectiveness', image_url: '/us1.png', link: '/uk/services/ocean-freight', icon_type: 'Anchor' },
  { country_code: 'UK', service_index: 1, title: 'LCL Consolidation', description: 'We collect your goods from your location and prepare them for consolidation. This includes proper labelling, packaging, and documentation to ensure smooth transit.', image_url: '/us5.png', link: '/uk/services/lcl-consolidation', icon_type: 'Warehouse' },
  { country_code: 'UK', service_index: 2, title: 'Transportation And Distribution', description: 'At GGL, we understand that efficient transportation and distribution are the backbone of a seamless supply chain. Our dedicated fleet and robust infrastructure ensure that your goods reach their destination on time, every time.', image_url: '/us3.png', link: '/uk/services/transportation', icon_type: 'Truck' },
  { country_code: 'UK', service_index: 3, title: 'Warehousing', description: 'At GGL, we offer comprehensive warehousing and third-party logistics (3PL) solutions designed to streamline your supply chain operations. Our services are tailored to meet the diverse needs of businesses, ensuring efficiency, reliability, and scalability.', image_url: '/us4.png', link: '/uk/services/warehousing', icon_type: 'Warehouse' },
  { country_code: 'UK', service_index: 4, title: 'Air Freight', description: 'At GGL, we offer a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams provide seamless air import, export, and express options, all on a convenient door-to-door basis.', image_url: '/us2.png', link: '/uk/services/air-freight', icon_type: 'Plane' },
  { country_code: 'UK', service_index: 5, title: 'Project Cargo', description: 'At GGL, we specialize in managing project cargo—the transportation of large, heavy, high-value, or complex pieces of equipment and materials essential to major infrastructure, engineering, or industrial projects.', image_url: '/us6.png', link: '/uk/services/project-cargo', icon_type: 'Warehouse' }
];

let localServices = [...DEFAULT_SERVICES];
if (fs.existsSync(servicesFallbackFile)) {
  try {
    localServices = JSON.parse(fs.readFileSync(servicesFallbackFile, 'utf8'));
  } catch (e) {
    console.error('Error loading fallback_services.json:', e);
  }
}

function saveLocalServices() {
  try {
    fs.writeFileSync(servicesFallbackFile, JSON.stringify(localServices, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving fallback_services.json:', e);
  }
}

// --- Footer Local Fallback Setup ---
const FALLBACK_FOOTER_OFFICES_FILE = path.join(__dirname, 'fallback_footer_offices.json');
const FALLBACK_FOOTER_GENERAL_FILE = path.join(__dirname, 'fallback_footer_general.json');

const DEFAULT_FOOTER_OFFICES = [
  { country_code: 'SG', office_index: 0, title: 'GGL (Singapore) Pte Ltd.', address: 'Blk 511 Kampong Bahru Road\n#03-01 Keppel Distripark\nSingapore - 099447', phone: '+65 69080838', email: 'june@ggl.sg' },
  { country_code: 'BD', office_index: 0, title: 'GGL (Bangladesh) Ltd.', address: 'ID #9-N (New), 9-M(Old-N), 9th floor, Tower 1, Police Plaza Concord No.2, Road # 144, Gulshan Model Town, Dhaka 1215, Bangladesh', phone: '', email: 'info.bd@ggl.sg' },
  { country_code: 'PK', office_index: 0, title: 'GGL (Pakistan) - Karachi', address: 'Suite No. 507 & 508, 5th Floor Fortune Center, Block-6, P.E.C.H.S, Shahrah-e-Faisal, Karachi, Pakistan.', phone: '+92 21 34542881 / +92 21 34542882 / +92 21 34542883 / +92 21 34542884', email: 'info.pk@ggl.sg' },
  { country_code: 'UK', office_index: 0, title: 'GGL (UK) Ltd.', address: '15 Woodlands Park Villas, North Gosforth , NE136PR , Newcastle Upon Tyne, United Kingdom.', phone: '+44(0)7305 856 612', email: 'Sukant@ggl.sg' },
  { country_code: 'MY', office_index: 0, title: 'GGL (Malaysia) - Port Klang', address: 'MTBBT 2, 3A-5, Jalan Batu Nilam 16, The Landmark (Behind AEON Mall), Bandar Bukit Tinggi 2, 41200 Klang, Selangor D.E', phone: '+603 - 3319 2778 / 74 / 75', email: 'jayesh@ggl.sg' },
  { country_code: 'MY', office_index: 1, title: 'GGL (Malaysia) - Pasir Gudang', address: 'Unit 20-03A, Level 20 Menara Zurich, 15 Jalan Dato Abdullah Tahir, 80300 Johor Bahru', phone: '603-3319 2778 / 74 / 75, 79', email: 'jayesh@ggl.sg' }
];

const DEFAULT_FOOTER_GENERAL = {
  about_text: "At GGL, we are proud to be one of Singapore's leading logistics companies. We offer specialized divisions in warehousing, forwarding (air and ocean), and transportation. Our mission is to deliver comprehensive end-to-end solutions in global freight forwarding, managed through a trusted network of partners who excel in all logistics segments.",
  facebook_url: "https://www.facebook.com/gglusa",
  linkedin_url: "https://www.linkedin.com/company/gglus/"
};

let localFooterOffices = [...DEFAULT_FOOTER_OFFICES];
if (fs.existsSync(FALLBACK_FOOTER_OFFICES_FILE)) {
  try {
    localFooterOffices = JSON.parse(fs.readFileSync(FALLBACK_FOOTER_OFFICES_FILE, 'utf8'));
  } catch (e) {
    console.error('Error loading fallback_footer_offices.json:', e);
  }
}

function saveLocalFooterOffices() {
  try {
    fs.writeFileSync(FALLBACK_FOOTER_OFFICES_FILE, JSON.stringify(localFooterOffices, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving fallback_footer_offices.json:', e);
  }
}

let localFooterGeneral = { ...DEFAULT_FOOTER_GENERAL };
if (fs.existsSync(FALLBACK_FOOTER_GENERAL_FILE)) {
  try {
    localFooterGeneral = JSON.parse(fs.readFileSync(FALLBACK_FOOTER_GENERAL_FILE, 'utf8'));
  } catch (e) {
    console.error('Error loading fallback_footer_general.json:', e);
  }
}

function saveLocalFooterGeneral() {
  try {
    fs.writeFileSync(FALLBACK_FOOTER_GENERAL_FILE, JSON.stringify(localFooterGeneral, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving fallback_footer_general.json:', e);
  }
}

// --- Navigation Bar & About Us Page Local Fallback Setup ---
const FALLBACK_NAVBAR_FILE = path.join(__dirname, 'fallback_navbar.json');
const FALLBACK_ABOUT_US_PAGE_FILE = path.join(__dirname, 'fallback_about_us_page.json');

const DEFAULT_NAVBAR = {
  home_label: 'Home',
  info_label: 'Info',
  about_label: 'About Us',
  careers_label: 'Careers',
  services_label: 'Services',
  global_presence_label: 'Global Presence',
  contact_label: 'Contact / Quote'
};

const DEFAULT_ABOUT_US_PAGES = [
  {
    country_code: 'SG',
    hero_title: 'About GGL',
    hero_subtitle: '',
    about_title: 'About GGL',
    paragraph_1: 'GGL is a proud subsidiary of 1 Global Enterprises, a Singapore-based investment group with a robust and diverse portfolio spanning freight forwarding, supply chain management, and logistics technology. As part of this global network, GGL leverages strategic investments across multiple brands specializing in transportation, warehousing, and integrated supply chain solutions.',
    paragraph_2: 'With a strong foundation backed by 1 Global Enterprises’ industry expertise and innovation-driven approach, GGL delivers seamless, technology-enabled logistics solutions. This affiliation ensures operational excellence, financial stability, and access to world-class infrastructure—positioning GGL as a leading provider of end-to-end global logistics services.',
    paragraph_3: 'The 1 Global Group operates in 16 countries with a dedicated team of over 700 professionals. Its business verticals include Supply Chain Solutions, Renewable Energy, Information Technology, and Business Process Outsourcing, each managed by domain experts committed to delivering impactful results.',
    paragraph_4: null,
    image_url: '/lovable-uploads/41795fb5-562d-45d1-a8d3-f26724bc079b.png',
    floating_card_title: '',
    floating_card_subtitle: '',
    final_paragraph: 'With the support of our in-house IT company, we are making significant investments in cutting-edge technologies—including Artificial Intelligence, Automation, and Data Analytics—to optimize operations and enhance transparency, efficiency, and client satisfaction.'
  },
  {
    country_code: 'BD',
    hero_title: 'GGL Bangladesh: Logistics Excellence in Dhaka',
    hero_subtitle: 'Local expertise powered by our global network to keep Bangladesh supply chains moving by sea, air, and road.',
    about_title: 'About Us',
    paragraph_1: 'GGL Bangladesh blends global reach with Dhaka-based execution. Our team coordinates LCL consolidation, air freight, and domestic distribution tailored to the Bangladeshi market.',
    paragraph_2: 'Strategically positioned in Dhaka with access to Chattogram and air gateways, we connect shippers to worldwide ports through direct weekly sailings and competitive air schedules.',
    paragraph_3: 'We prioritize neutral LCL solutions for forwarders and NVOCCs, backed by transparent pricing, reliable cut-offs, and dedicated customer service.',
    paragraph_4: 'With modern tracking and documentation support, GGL Bangladesh keeps your cargo visible from factory pickup to final delivery.',
    image_url: '/oceanf.png',
    floating_card_title: 'Global Network',
    floating_card_subtitle: '50+ countries worldwide',
    final_paragraph: ''
  },
  {
    country_code: 'PK',
    hero_title: 'GGL Pakistan: Gateway to Global Logistics',
    hero_subtitle: 'Leading end-to-end logistics solutions connecting Karachi and the world.',
    about_title: 'About Us',
    paragraph_1: 'GGL Pakistan offers a comprehensive portfolio of supply chain services, integrating ocean freight, air cargo, and inland haulage across Pakistan.',
    paragraph_2: 'Based in Karachi with strategic presence at key air and sea ports, we specialize in LCL consolidation and complex project logistics.',
    paragraph_3: 'Our commitment is to deliver neutral consolidation solutions, giving local forwarders reliable weekly departures and competitive options.',
    paragraph_4: 'We run a technology-driven network to ensure tracking transparency and smooth customs clearance for all imports and exports.',
    image_url: '/oceanf.png',
    floating_card_title: 'Custom Solutions',
    floating_card_subtitle: 'Tailored logistic plans',
    final_paragraph: ''
  },
  {
    country_code: 'UK',
    hero_title: 'About GGL UK',
    hero_subtitle: 'Dynamic logistics solutions supporting UK import, export, and distribution.',
    about_title: 'About Us',
    paragraph_1: 'GGL UK provides flexible supply chain options that connect the British markets with international logistics hubs.',
    paragraph_2: 'From our UK presence, we coordinate customs coordination, road transport, ocean freight, and premium air freight.',
    paragraph_3: 'We partner with leading ocean carriers and airlines to secure space allocations, providing reliable schedules year-round.',
    paragraph_4: 'Our proactive team is focused on delivering cost-effective and secure shipping solutions for business clients.',
    image_url: '/lovable-uploads/41795fb5-562d-45d1-a8d3-f26724bc079b.png',
    floating_card_title: 'Global Standards',
    floating_card_subtitle: 'Highest security & safety',
    final_paragraph: ''
  },
  {
    country_code: 'MY',
    hero_title: 'GGL Malaysia: Connecting Port Klang & Pasir Gudang',
    hero_subtitle: 'Optimized distribution and freight services across Southeast Asia.',
    about_title: 'About Us',
    paragraph_1: 'GGL Malaysia provides specialized supply chain solutions out of Port Klang and Pasir Gudang to keep cargo moving seamlessly.',
    paragraph_2: 'Our local offices coordinate ocean imports/exports, bonded warehousing, customs brokerage, and local distribution.',
    paragraph_3: 'We deliver neutral LCL consolidation services tailored to regional freight forwarders and international traders.',
    paragraph_4: 'Supported by advanced digital tools, GGL Malaysia ensures full transparency, efficiency, and reliability.',
    image_url: '/oceanf.png',
    floating_card_title: 'Strategic Locations',
    floating_card_subtitle: 'Klang & Johor hubs',
    final_paragraph: ''
  }
];

let localNavBar = { ...DEFAULT_NAVBAR };
if (fs.existsSync(FALLBACK_NAVBAR_FILE)) {
  try {
    localNavBar = JSON.parse(fs.readFileSync(FALLBACK_NAVBAR_FILE, 'utf8'));
  } catch (e) {
    console.error('Error loading fallback_navbar.json:', e);
  }
}

function saveLocalNavBar() {
  try {
    fs.writeFileSync(FALLBACK_NAVBAR_FILE, JSON.stringify(localNavBar, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving fallback_navbar.json:', e);
  }
}

let localAboutUsPages = [...DEFAULT_ABOUT_US_PAGES];
if (fs.existsSync(FALLBACK_ABOUT_US_PAGE_FILE)) {
  try {
    localAboutUsPages = JSON.parse(fs.readFileSync(FALLBACK_ABOUT_US_PAGE_FILE, 'utf8'));
  } catch (e) {
    console.error('Error loading fallback_about_us_page.json:', e);
  }
}

function saveLocalAboutUsPages() {
  try {
    fs.writeFileSync(FALLBACK_ABOUT_US_PAGE_FILE, JSON.stringify(localAboutUsPages, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving fallback_about_us_page.json:', e);
  }
}

const FALLBACK_CAREERS_PAGE_FILE = path.join(__dirname, 'fallback_careers_page.json');
const DEFAULT_CAREERS_PAGES = [
  {
    country_code: 'SG',
    hero_title: 'Join Our Global Team',
    hero_subtitle: 'Build your career with one of Singapore\'s leading logistics companies. We\'re looking for passionate individuals to join our mission of connecting the world through exceptional logistics solutions.',
    hero_button_text: 'View Open Positions',
    why_join_title: 'Why Choose GGL?',
    why_join_description: 'At GGL, we believe our people are our greatest asset. We foster an environment where talent thrives and careers flourish.',
    opportunities_title: 'Current Opportunities',
    opportunities_description: 'Explore exciting career opportunities across our various departments and locations.',
    opportunities_status: 'Career opportunities coming soon. Stay tuned!',
    cta_title: 'Ready to Start Your Journey?',
    cta_subtitle: 'Don\'t see the right position? Send us your resume and we\'ll keep you in mind for future opportunities.',
    cta_btn1_label: 'Submit Your Resume',
    cta_btn2_label: 'Contact HR'
  },
  {
    country_code: 'BD',
    hero_title: 'Join Our Team in Bangladesh',
    hero_subtitle: 'Build your career with one of Bangladesh\'s leading logistics companies. We\'re looking for passionate individuals to join our mission of connecting the world through exceptional logistics solutions.',
    hero_button_text: 'View Open Positions',
    why_join_title: 'Why Choose GGL?',
    why_join_description: 'At GGL, we believe our people are our greatest asset. We foster an environment where talent thrives and careers flourish.',
    opportunities_title: 'Current Opportunities',
    opportunities_description: 'Explore exciting career opportunities across our various departments and locations.',
    opportunities_status: 'Career opportunities coming soon. Stay tuned!',
    cta_title: 'Ready to Start Your Journey?',
    cta_subtitle: 'Don\'t see the right position? Send us your resume and we\'ll keep you in mind for future opportunities.',
    cta_btn1_label: 'Submit Your Resume',
    cta_btn2_label: 'Contact HR'
  },
  {
    country_code: 'PK',
    hero_title: 'Join Our Pakistan Team',
    hero_subtitle: 'Build your career with one of Pakistan\'s leading logistics companies. We\'re looking for passionate individuals to join our mission of connecting the world through exceptional logistics solutions.',
    hero_button_text: 'View Open Positions',
    why_join_title: 'Why Choose GGL?',
    why_join_description: 'At GGL, we believe our people are our greatest asset. We foster an environment where talent thrives and careers flourish.',
    opportunities_title: 'Current Opportunities',
    opportunities_description: 'Explore exciting career opportunities across our various departments and locations.',
    opportunities_status: 'Career opportunities coming soon. Stay tuned!',
    cta_title: 'Ready to Start Your Journey?',
    cta_subtitle: 'Don\'t see the right position? Send us your resume and we\'ll keep you in mind for future opportunities.',
    cta_btn1_label: 'Submit Your Resume',
    cta_btn2_label: 'Contact HR'
  },
  {
    country_code: 'UK',
    hero_title: 'Join Our UK Team',
    hero_subtitle: 'Build your career with one of UK\'s leading logistics companies. We\'re looking for passionate individuals to join our mission of connecting the world through exceptional logistics solutions.',
    hero_button_text: 'View Open Positions',
    why_join_title: 'Why Choose GGL?',
    why_join_description: 'At GGL, we believe our people are our greatest asset. We foster an environment where talent thrives and careers flourish.',
    opportunities_title: 'Current Opportunities',
    opportunities_description: 'Explore exciting career opportunities across our various departments and locations.',
    opportunities_status: 'Career opportunities coming soon. Stay tuned!',
    cta_title: 'Ready to Start Your Journey?',
    cta_subtitle: 'Don\'t see the right position? Send us your resume and we\'ll keep you in mind for future opportunities.',
    cta_btn1_label: 'Submit Your Resume',
    cta_btn2_label: 'Contact HR'
  },
  {
    country_code: 'MY',
    hero_title: 'Join Our Malaysia Team',
    hero_subtitle: 'Build your career with one of Malaysia\'s leading logistics companies. We\'re looking for passionate individuals to join our mission of connecting the world through exceptional logistics solutions.',
    hero_button_text: 'View Open Positions',
    why_join_title: 'Why Choose GGL?',
    why_join_description: 'At GGL, we believe our people are our greatest asset. We foster an environment where talent thrives and careers flourish.',
    opportunities_title: 'Current Opportunities',
    opportunities_description: 'Explore exciting career opportunities across our various departments and locations.',
    opportunities_status: 'Career opportunities coming soon. Stay tuned!',
    cta_title: 'Ready to Start Your Journey?',
    cta_subtitle: 'Don\'t see the right position? Send us your resume and we\'ll keep you in mind for future opportunities.',
    cta_btn1_label: 'Submit Your Resume',
    cta_btn2_label: 'Contact HR'
  }
];

let localCareersPages = [...DEFAULT_CAREERS_PAGES];
if (fs.existsSync(FALLBACK_CAREERS_PAGE_FILE)) {
  try {
    localCareersPages = JSON.parse(fs.readFileSync(FALLBACK_CAREERS_PAGE_FILE, 'utf8'));
  } catch (e) {
    console.error('Error loading fallback_careers_page.json:', e);
  }
}

function saveLocalCareersPages() {
  try {
    fs.writeFileSync(FALLBACK_CAREERS_PAGE_FILE, JSON.stringify(localCareersPages, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving fallback_careers_page.json:', e);
  }
}

const FALLBACK_SERVICES_PAGE_FILE = path.join(__dirname, 'fallback_services_page.json');
const DEFAULT_SERVICES_PAGES = [
  {
    country_code: 'SG',
    hero_title: 'Our Logistics Services',
    hero_subtitle: 'From air and ocean freight to specialized transportation solutions, we offer end-to-end logistics expertise to meet your global shipping needs.',
    services_title: 'All Services',
    services_description: 'Explore our comprehensive range of services designed to meet all your logistics requirements.',
    why_choose_title: 'Why Choose Our Logistics Services?',
    why_choose_description: 'We combine industry expertise, advanced technology, and personalized care to deliver exceptional logistics solutions.',
    cta_btn_text: 'Request a Quote'
  },
  {
    country_code: 'BD',
    hero_title: 'Our Logistics Services in Bangladesh',
    hero_subtitle: 'From air and ocean freight to specialized transportation solutions, we offer end-to-end logistics expertise to meet your global shipping needs.',
    services_title: 'All Services',
    services_description: 'Explore our comprehensive range of services designed to meet all your logistics requirements.',
    why_choose_title: 'Why Choose Our Logistics Services?',
    why_choose_description: 'We combine industry expertise, advanced technology, and personalized care to deliver exceptional logistics solutions.',
    cta_btn_text: 'Request a Quote'
  },
  {
    country_code: 'PK',
    hero_title: 'Our Logistics Services in Pakistan',
    hero_subtitle: 'From air and ocean freight to specialized transportation solutions, we offer end-to-end logistics expertise to meet your global shipping needs.',
    services_title: 'All Services',
    services_description: 'Explore our comprehensive range of services designed to meet all your logistics requirements.',
    why_choose_title: 'Why Choose Our Logistics Services?',
    why_choose_description: 'We combine industry expertise, advanced technology, and personalized care to deliver exceptional logistics solutions.',
    cta_btn_text: 'Request a Quote'
  },
  {
    country_code: 'UK',
    hero_title: 'Our Logistics Services in the UK',
    hero_subtitle: 'From air and ocean freight to specialized transportation solutions, we offer end-to-end logistics expertise to meet your global shipping needs.',
    services_title: 'All Services',
    services_description: 'Explore our comprehensive range of services designed to meet all your logistics requirements.',
    why_choose_title: 'Why Choose Our Logistics Services?',
    why_choose_description: 'We combine industry expertise, advanced technology, and personalized care to deliver exceptional logistics solutions.',
    cta_btn_text: 'Request a Quote'
  },
  {
    country_code: 'MY',
    hero_title: 'Our Logistics Services in Malaysia',
    hero_subtitle: 'From air and ocean freight to specialized transportation solutions, we offer end-to-end logistics expertise to meet your global shipping needs.',
    services_title: 'All Services',
    services_description: 'Explore our comprehensive range of services designed to meet all your logistics requirements.',
    why_choose_title: 'Why Choose Our Logistics Services?',
    why_choose_description: 'We combine industry expertise, advanced technology, and personalized care to deliver exceptional logistics solutions.',
    cta_btn_text: 'Request a Quote'
  }
];

let localServicesPages = [...DEFAULT_SERVICES_PAGES];
if (fs.existsSync(FALLBACK_SERVICES_PAGE_FILE)) {
  try {
    localServicesPages = JSON.parse(fs.readFileSync(FALLBACK_SERVICES_PAGE_FILE, 'utf8'));
  } catch (e) {
    console.error('Error loading fallback_services_page.json:', e);
  }
}

function saveLocalServicesPages() {
  try {
    fs.writeFileSync(FALLBACK_SERVICES_PAGE_FILE, JSON.stringify(localServicesPages, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving fallback_services_page.json:', e);
  }
}

// API Routes

// Get all About Us records
app.get('/api/about-us', async (req, res) => {
  if (!pool) {
    console.log('Database connection offline. Returning local JSON fallback About Us records.');
    return res.json(localAboutUs);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `about_us_content` ORDER BY `country_code` ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching About Us records:', error);
    res.status(500).send(error.message);
  }
});

// Get About Us record by country code
app.get('/api/about-us/:country_code', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  if (!pool) {
    console.log(`Database connection offline. Returning local JSON fallback About Us record for ${countryCode}.`);
    const record = localAboutUs.find(r => r.country_code === countryCode);
    if (!record) return res.status(404).send('About Us record not found');
    return res.json(record);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `about_us_content` WHERE `country_code` = ?', [countryCode]);
    if (rows.length === 0) {
      return res.status(404).send('About Us record not found');
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching About Us record for ${countryCode}:`, error);
    res.status(500).send(error.message);
  }
});

// Update or insert an About Us record
app.put('/api/about-us/:country_code', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  const { title, content_paragraph_1, content_paragraph_2, image_url, button_text, learn_more_path } = req.body;

  if (!title || !content_paragraph_1 || !content_paragraph_2 || !image_url || !learn_more_path) {
    return res.status(400).send('All fields are required (title, content_paragraph_1, content_paragraph_2, image_url, learn_more_path).');
  }

  try {
    const query = `
      INSERT INTO \`about_us_content\` 
        (\`country_code\`, \`title\`, \`content_paragraph_1\`, \`content_paragraph_2\`, \`image_url\`, \`button_text\`, \`learn_more_path\`) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        \`title\` = VALUES(\`title\`),
        \`content_paragraph_1\` = VALUES(\`content_paragraph_1\`),
        \`content_paragraph_2\` = VALUES(\`content_paragraph_2\`),
        \`image_url\` = VALUES(\`image_url\`),
        \`button_text\` = VALUES(\`button_text\`),
        \`learn_more_path\` = VALUES(\`learn_more_path\`)
    `;
    await pool.query(query, [countryCode, title, content_paragraph_1, content_paragraph_2, image_url, button_text || 'Learn More', learn_more_path]);
    
    const [rows] = await pool.query('SELECT * FROM `about_us_content` WHERE `country_code` = ?', [countryCode]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating About Us record in database:', error);
    res.status(500).send(error.message);
  }
});
// Get all Services records
app.get('/api/services', async (req, res) => {
  if (!pool) {
    console.log('Database connection offline. Returning local JSON fallback Services.');
    return res.json(localServices);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `services_content` ORDER BY `country_code` ASC, `service_index` ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching Services records:', error);
    res.status(500).send(error.message);
  }
});

// Get Services records by country code
app.get('/api/services/:country_code', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  if (!pool) {
    console.log(`Database connection offline. Returning local JSON fallback Services for ${countryCode}.`);
    const records = localServices.filter(r => r.country_code === countryCode);
    return res.json(records);
  }
  try {
    const [rows] = await pool.query(
      'SELECT * FROM `services_content` WHERE `country_code` = ? ORDER BY `service_index` ASC',
      [countryCode]
    );
    if (rows.length === 0) {
      return res.status(404).send('Services not found for country: ' + countryCode);
    }
    res.json(rows);
  } catch (error) {
    console.error(`Error fetching Services for country ${countryCode}:`, error);
    res.status(500).send(error.message);
  }
});

// Update Services record by country code and index
app.put('/api/services/:country_code/:service_index', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  const serviceIndex = parseInt(req.params.service_index);
  const { title, description, image_url, link, icon_type } = req.body;

  if (isNaN(serviceIndex)) {
    return res.status(400).send('Invalid service index.');
  }

  try {
    const query = `
      INSERT INTO \`services_content\` 
        (\`country_code\`, \`service_index\`, \`title\`, \`description\`, \`image_url\`, \`link\`, \`icon_type\`)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`title\` = VALUES(\`title\`),
        \`description\` = VALUES(\`description\`),
        \`image_url\` = VALUES(\`image_url\`),
        \`link\` = VALUES(\`link\`),
        \`icon_type\` = VALUES(\`icon_type\`)
    `;
    await pool.query(query, [
      countryCode,
      serviceIndex,
      title || '',
      description || '',
      image_url || '',
      link || '',
      icon_type || 'Warehouse'
    ]);

    const [rows] = await pool.query(
      'SELECT * FROM `services_content` WHERE `country_code` = ? AND `service_index` = ?',
      [countryCode, serviceIndex]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error updating Service index ${serviceIndex} for country ${countryCode}:`, error);
    res.status(500).send(error.message);
  }
});

// --- Global Presence Local Fallback Setup ---
const FALLBACK_GP_FILE = path.join(__dirname, 'fallback_global_presence.json');
let localGlobalPresence = [];

function loadLocalGlobalPresence() {
  try {
    if (fs.existsSync(FALLBACK_GP_FILE)) {
      const data = fs.readFileSync(FALLBACK_GP_FILE, 'utf8');
      localGlobalPresence = JSON.parse(data);
    } else {
      // Default fallback templates
      localGlobalPresence = [
        { country_code: 'SG', title: 'Global Presence', content_paragraph: 'Our logistics network spans across continents, enabling seamless global shipping solutions.', button_text: 'Explore Our Global Network', link_path: '/global-presence' },
        { country_code: 'BD', title: 'Global Presence', content_paragraph: 'Our logistics network spans across continents, enabling seamless global shipping solutions.', button_text: 'Explore Our Global Network', link_path: '/bangladesh/global-presence' },
        { country_code: 'MY', title: 'Global Network, Local Expertise', content_paragraph: 'From our hubs in Malaysia, we connect you to GGL\'s extensive global network, ensuring your cargo reaches any corner of the world with the same reliability and care.', button_text: 'Explore Our Global Presence', link_path: '/malaysia/global-presence' },
        { country_code: 'PK', title: 'Global Presence', content_paragraph: 'Our logistics network spans across continents, enabling seamless global shipping solutions.', button_text: 'Explore Our Global Network', link_path: '/pakistan/global-presence' },
        { country_code: 'UK', title: 'Global Presence', content_paragraph: 'Our logistics network spans across continents, enabling seamless global shipping solutions.', button_text: 'Explore Our Global Network', link_path: '/uk/global-presence' }
      ];
      saveLocalGlobalPresence();
    }
  } catch (err) {
    console.error('Error loading fallback_global_presence.json:', err);
    localGlobalPresence = [];
  }
}

function saveLocalGlobalPresence() {
  try {
    fs.writeFileSync(FALLBACK_GP_FILE, JSON.stringify(localGlobalPresence, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing fallback_global_presence.json:', err);
  }
}

loadLocalGlobalPresence();

// Get all Global Presence records
app.get('/api/global-presence', async (req, res) => {
  if (!pool) {
    console.log('Database connection offline. Returning local JSON fallback Global Presence records.');
    return res.json(localGlobalPresence);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `global_presence_content`');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching global presence records from DB:', error);
    res.status(500).send(error.message);
  }
});

// Get Global Presence for a specific country
app.get('/api/global-presence/:country_code', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  if (!pool) {
    console.log(`Database connection offline. Returning local JSON fallback Global Presence record for ${countryCode}.`);
    const record = localGlobalPresence.find(r => r.country_code === countryCode) || {
      country_code: countryCode,
      title: 'Global Presence',
      content_paragraph: 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
      button_text: 'Explore Our Global Network',
      link_path: `/${countryCode.toLowerCase()}/global-presence`
    };
    return res.json(record);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `global_presence_content` WHERE `country_code` = ?', [countryCode]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.json({
        country_code: countryCode,
        title: 'Global Presence',
        content_paragraph: 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
        button_text: 'Explore Our Global Network',
        link_path: `/${countryCode.toLowerCase()}/global-presence`
      });
    }
  } catch (error) {
    console.error(`Error fetching global presence for country ${countryCode}:`, error);
    res.status(500).send(error.message);
  }
});

// Update Global Presence for a country
app.put('/api/global-presence/:country_code', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  const { title, content_paragraph, button_text, link_path, map_iframe_url } = req.body;

  try {
    const query = `
      INSERT INTO \`global_presence_content\` 
        (\`country_code\`, \`title\`, \`content_paragraph\`, \`button_text\`, \`link_path\`, \`map_iframe_url\`)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`title\` = VALUES(\`title\`),
        \`content_paragraph\` = VALUES(\`content_paragraph\`),
        \`button_text\` = VALUES(\`button_text\`),
        \`link_path\` = VALUES(\`link_path\`),
        \`map_iframe_url\` = VALUES(\`map_iframe_url\`)
    `;
    await pool.query(query, [
      countryCode,
      title || '',
      content_paragraph || '',
      button_text || '',
      link_path || '',
      map_iframe_url || ''
    ]);

    const [rows] = await pool.query(
      'SELECT * FROM `global_presence_content` WHERE `country_code` = ?',
      [countryCode]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error updating Global Presence for country ${countryCode}:`, error);
    res.status(500).send(error.message);
  }
});

// Get all Contact Page records
app.get('/api/contact-page-content', async (req, res) => {
  if (!pool) {
    return res.status(503).send('Database connection offline.');
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `contact_page_content`');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching contact page records:', error);
    res.status(500).send(error.message);
  }
});

// Get Contact Page for a specific country
app.get('/api/contact-page-content/:country_code', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  if (!pool) {
    return res.status(503).send('Database connection offline.');
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `contact_page_content` WHERE `country_code` = ?', [countryCode]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.json({
        country_code: countryCode,
        title: 'Get in Touch',
        subtitle: "We're here to help and answer any questions you might have.",
        email_recipient: 'June@ggl.sg',
        phone: '+65 69080838',
        address: '',
        map_iframe_url: ''
      });
    }
  } catch (error) {
    console.error(`Error fetching contact page for country ${countryCode}:`, error);
    res.status(500).send(error.message);
  }
});

// Update Contact Page for a country
app.put('/api/contact-page-content/:country_code', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  const { title, subtitle, email_recipient, phone, address, map_iframe_url } = req.body;

  try {
    const query = `
      INSERT INTO \`contact_page_content\` 
        (\`country_code\`, \`title\`, \`subtitle\`, \`email_recipient\`, \`phone\`, \`address\`, \`map_iframe_url\`)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`title\` = VALUES(\`title\`),
        \`subtitle\` = VALUES(\`subtitle\`),
        \`email_recipient\` = VALUES(\`email_recipient\`),
        \`phone\` = VALUES(\`phone\`),
        \`address\` = VALUES(\`address\`),
        \`map_iframe_url\` = VALUES(\`map_iframe_url\`)
    `;
    await pool.query(query, [
      countryCode,
      title || '',
      subtitle || '',
      email_recipient || '',
      phone || '',
      address || '',
      map_iframe_url || ''
    ]);

    const [rows] = await pool.query(
      'SELECT * FROM `contact_page_content` WHERE `country_code` = ?',
      [countryCode]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error updating Contact Page for country ${countryCode}:`, error);
    res.status(500).send(error.message);
  }
});

// --- Quick Enquiry Local Fallback Setup ---
const FALLBACK_QE_FILE = path.join(__dirname, 'fallback_quick_enquiry.json');
let localQuickEnquiry = [];

function loadLocalQuickEnquiry() {
  try {
    if (fs.existsSync(FALLBACK_QE_FILE)) {
      const data = fs.readFileSync(FALLBACK_QE_FILE, 'utf8');
      localQuickEnquiry = JSON.parse(data);
    } else {
      // Default fallback templates
      localQuickEnquiry = [
        { country_code: 'SG', title: 'Quick Enquiry', subtitle: 'Have a question? Fill out the form below and we\'ll get back to you shortly.', email_recipient: 'June@ggl.sg', success_message: 'Your enquiry has been submitted successfully. We\'ll contact you soon.', error_message: 'Something went wrong. Please try again later.' },
        { country_code: 'BD', title: 'Quick Enquiry', subtitle: 'Have a question? Fill out the form below and we\'ll get back to you shortly.', email_recipient: 'info.bd@ggl.sg', success_message: 'Your enquiry has been submitted successfully. We\'ll contact you soon.', error_message: 'Something went wrong. Please try again later.' },
        { country_code: 'MY', title: 'Quick Enquiry', subtitle: 'Have a question? Fill out the form below and we\'ll get back to you shortly.', email_recipient: 'info.pk@ggl.sg', success_message: 'Your enquiry has been submitted successfully. We\'ll contact you soon.', error_message: 'Something went wrong. Please try again later.' },
        { country_code: 'PK', title: 'Quick Enquiry', subtitle: 'Have a question? Fill out the form below and we\'ll get back to you shortly.', email_recipient: 'info.pk@ggl.sg', success_message: 'Your enquiry has been submitted successfully. We\'ll contact you soon.', error_message: 'Something went wrong. Please try again later.' },
        { country_code: 'UK', title: 'Quick Enquiry', subtitle: 'Have a question? Fill out the form below and we\'ll get back to you shortly.', email_recipient: 'Sukant@ggl.sg', success_message: 'Your enquiry has been submitted successfully. We\'ll contact you soon.', error_message: 'Something went wrong. Please try again later.' }
      ];
      saveLocalQuickEnquiry();
    }
  } catch (err) {
    console.error('Error loading fallback_quick_enquiry.json:', err);
    localQuickEnquiry = [];
  }
}

function saveLocalQuickEnquiry() {
  try {
    fs.writeFileSync(FALLBACK_QE_FILE, JSON.stringify(localQuickEnquiry, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing fallback_quick_enquiry.json:', err);
  }
}

loadLocalQuickEnquiry();

// Get all Quick Enquiry records
app.get('/api/quick-enquiry', async (req, res) => {
  if (!pool) {
    console.log('Database connection offline. Returning local JSON fallback Quick Enquiry records.');
    return res.json(localQuickEnquiry);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `quick_enquiry_content`');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching quick enquiry records from DB:', error);
    res.status(500).send(error.message);
  }
});

// Get Quick Enquiry for a specific country
app.get('/api/quick-enquiry/:country_code', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  if (!pool) {
    console.log(`Database connection offline. Returning local JSON fallback Quick Enquiry record for ${countryCode}.`);
    const record = localQuickEnquiry.find(r => r.country_code === countryCode) || {
      country_code: countryCode,
      title: 'Quick Enquiry',
      subtitle: 'Have a question? Fill out the form below and we\'ll get back to you shortly.',
      email_recipient: countryCode === 'SG' ? 'June@ggl.sg' : countryCode === 'BD' ? 'info.bd@ggl.sg' : countryCode === 'UK' ? 'Sukant@ggl.sg' : 'info.pk@ggl.sg',
      success_message: 'Your enquiry has been submitted successfully. We\'ll contact you soon.',
      error_message: 'Something went wrong. Please try again later.'
    };
    return res.json(record);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `quick_enquiry_content` WHERE `country_code` = ?', [countryCode]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.json({
        country_code: countryCode,
        title: 'Quick Enquiry',
        subtitle: 'Have a question? Fill out the form below and we\'ll get back to you shortly.',
        email_recipient: countryCode === 'SG' ? 'June@ggl.sg' : countryCode === 'BD' ? 'info.bd@ggl.sg' : countryCode === 'UK' ? 'Sukant@ggl.sg' : 'info.pk@ggl.sg',
        success_message: 'Your enquiry has been submitted successfully. We\'ll contact you soon.',
        error_message: 'Something went wrong. Please try again later.'
      });
    }
  } catch (error) {
    console.error(`Error fetching quick enquiry for country ${countryCode}:`, error);
    res.status(500).send(error.message);
  }
});

// Update Quick Enquiry for a country
app.put('/api/quick-enquiry/:country_code', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  const { title, subtitle, email_recipient, success_message, error_message } = req.body;

  try {
    const query = `
      INSERT INTO \`quick_enquiry_content\` 
        (\`country_code\`, \`title\`, \`subtitle\`, \`email_recipient\`, \`success_message\`, \`error_message\`)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`title\` = VALUES(\`title\`),
        \`subtitle\` = VALUES(\`subtitle\`),
        \`email_recipient\` = VALUES(\`email_recipient\`),
        \`success_message\` = VALUES(\`success_message\`),
        \`error_message\` = VALUES(\`error_message\`)
    `;
    await pool.query(query, [
      countryCode,
      title || 'Quick Enquiry',
      subtitle || '',
      email_recipient || '',
      success_message || '',
      error_message || ''
    ]);

    const [rows] = await pool.query(
      'SELECT * FROM `quick_enquiry_content` WHERE `country_code` = ?',
      [countryCode]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error updating Quick Enquiry for country ${countryCode}:`, error);
    res.status(500).send(error.message);
  }
});

// Get all SEO records
app.get('/api/seo', async (req, res) => {
  if (!pool) {
    console.log('Database connection offline. Returning local JSON SEO records list.');
    return res.json(localSeo);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `seo_gglsingapore` ORDER BY `path` ASC');
    const parsedRows = rows.map(parseRecord);
    res.json(parsedRows);
  } catch (error) {
    console.error('Error fetching SEO records:', error);
    res.status(500).send(error.message);
  }
});

// Get SEO record by path
app.get('/api/seo/by-path', async (req, res) => {
  const pagePath = req.query.path;
  if (!pagePath) {
    return res.status(400).send('Path parameter is required.');
  }
  if (!pool) {
    const record = localSeo.find(r => r.path === pagePath);
    if (!record) return res.status(404).send('SEO record not found');
    return res.json(record);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `seo_gglsingapore` WHERE `path` = ?', [pagePath]);
    if (rows.length === 0) {
      return res.status(404).send('SEO record not found for path: ' + pagePath);
    }
    res.json(parseRecord(rows[0]));
  } catch (error) {
    console.error('Error fetching SEO record by path:', error);
    res.status(500).send(error.message);
  }
});

// Create a new SEO record
app.post('/api/seo', async (req, res) => {
  const { path: pagePath, title, description, keywords, extra_meta } = req.body;
  if (!pagePath) {
    return res.status(400).send('Path is required.');
  }

  const extraMetaStr = extra_meta ? JSON.stringify(extra_meta) : null;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO `seo_gglsingapore` (`path`, `title`, `description`, `keywords`, `extra_meta`) VALUES (?, ?, ?, ?, ?)',
      [pagePath, title || null, description || null, keywords || null, extraMetaStr]
    );
    
    const [rows] = await pool.query('SELECT * FROM `seo_gglsingapore` WHERE `id` = ?', [result.insertId]);
    res.status(201).json(parseRecord(rows[0]));
  } catch (error) {
    console.error('Error creating SEO record:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).send('An SEO record already exists for path: ' + pagePath);
    }
    res.status(500).send(error.message);
  }
});

// Update an SEO record
app.patch('/api/seo/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { path: pagePath, title, description, keywords, extra_meta } = req.body;

  const extraMetaStr = extra_meta ? JSON.stringify(extra_meta) : null;

  try {
    const [existing] = await pool.query('SELECT * FROM `seo_gglsingapore` WHERE `id` = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).send('SEO record not found.');
    }

    const fieldsToUpdate = {};
    if (pagePath !== undefined) fieldsToUpdate.path = pagePath;
    if (title !== undefined) fieldsToUpdate.title = title || null;
    if (description !== undefined) fieldsToUpdate.description = description || null;
    if (keywords !== undefined) fieldsToUpdate.keywords = keywords || null;
    if (extra_meta !== undefined) fieldsToUpdate.extra_meta = extraMetaStr;

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.json(parseRecord(existing[0]));
    }

    const setClause = Object.keys(fieldsToUpdate).map(key => `\`${key}\` = ?`).join(', ');
    const values = [...Object.values(fieldsToUpdate), id];

    await pool.query(`UPDATE \`seo_gglsingapore\` SET ${setClause} WHERE \`id\` = ?`, values);
    
    const [rows] = await pool.query('SELECT * FROM `seo_gglsingapore` WHERE `id` = ?', [id]);
    res.json(parseRecord(rows[0]));
  } catch (error) {
    console.error('Error updating SEO record:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).send('An SEO record already exists for path: ' + pagePath);
    }
    res.status(500).send(error.message);
  }
});

// Delete an SEO record
app.delete('/api/seo/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const [existing] = await pool.query('SELECT * FROM `seo_gglsingapore` WHERE `id` = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).send('SEO record not found.');
    }
    await pool.query('DELETE FROM `seo_gglsingapore` WHERE `id` = ?', [id]);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting SEO record:', error);
    res.status(500).send(error.message);
  }
});

// Serve uploaded files statically
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir, {
  maxAge: '1d',
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

// Image Upload Endpoint with multer
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'file-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;
    if (allowedTypes.test(ext) && allowedTypes.test(mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpg, png, gif, webp, svg) are allowed.'));
    }
  }
});

// Get all footer offices
app.get('/api/footer/offices', async (req, res) => {
  if (!pool) {
    console.log('Database connection offline. Returning local JSON footer offices.');
    return res.json(localFooterOffices);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `footer_content` ORDER BY `country_code` ASC, `office_index` ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching footer offices:', error);
    res.status(500).send(error.message);
  }
});

// Update/Upsert footer office by country and index
app.put('/api/footer/offices/:country_code/:office_index', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  const officeIndex = parseInt(req.params.office_index);
  const { title, address, phone, email } = req.body;

  if (isNaN(officeIndex)) {
    return res.status(400).send('Invalid office index.');
  }

  try {
    const query = `
      INSERT INTO \`footer_content\` 
        (\`country_code\`, \`office_index\`, \`title\`, \`address\`, \`phone\`, \`email\`)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`title\` = VALUES(\`title\`),
        \`address\` = VALUES(\`address\`),
        \`phone\` = VALUES(\`phone\`),
        \`email\` = VALUES(\`email\`)
    `;
    await pool.query(query, [
      countryCode,
      officeIndex,
      title || '',
      address || '',
      phone || '',
      email || ''
    ]);

    const [rows] = await pool.query(
      'SELECT * FROM `footer_content` WHERE `country_code` = ? AND `office_index` = ?',
      [countryCode, officeIndex]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error updating footer office ${officeIndex} for ${countryCode}:`, error);
    res.status(500).send(error.message);
  }
});

// Get footer general settings
app.get('/api/footer/general', async (req, res) => {
  if (!pool) {
    console.log('Database connection offline. Returning local JSON footer general settings.');
    return res.json(localFooterGeneral);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `footer_general` LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).send('Footer general settings not found.');
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching footer general settings:', error);
    res.status(500).send(error.message);
  }
});

// Update footer general settings
app.put('/api/footer/general', async (req, res) => {
  const { about_text, facebook_url, linkedin_url } = req.body;

  if (!about_text) {
    return res.status(400).send('About text is required.');
  }

  try {
    // Check if a row exists
    const [existing] = await pool.query('SELECT `id` FROM `footer_general` LIMIT 1');
    if (existing.length === 0) {
      await pool.query(
        'INSERT INTO `footer_general` (`about_text`, `facebook_url`, `linkedin_url`) VALUES (?, ?, ?)',
        [about_text, facebook_url || '', linkedin_url || '']
      );
    } else {
      await pool.query(
        'UPDATE `footer_general` SET `about_text` = ?, `facebook_url` = ?, `linkedin_url` = ? WHERE `id` = ?',
        [about_text, facebook_url || '', linkedin_url || '', existing[0].id]
      );
    }

    const [rows] = await pool.query('SELECT * FROM `footer_general` LIMIT 1');
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating footer general settings:', error);
    res.status(500).send(error.message);
  }
});

// GET Navigation Bar settings
app.get('/api/navigation-bar', async (req, res) => {
  if (!pool) {
    console.log('Database connection offline. Returning local JSON navigation bar.');
    return res.json(localNavBar);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `navigation_bar` LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).send('Navigation bar settings not found.');
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching navigation bar:', error);
    res.status(500).send(error.message);
  }
});

// UPDATE Navigation Bar settings
app.put('/api/navigation-bar', async (req, res) => {
  const { home_label, info_label, about_label, careers_label, services_label, global_presence_label, contact_label } = req.body;
  try {
    const [rows] = await pool.query('SELECT id FROM `navigation_bar` LIMIT 1');
    if (rows.length === 0) {
      await pool.query(
        'INSERT INTO `navigation_bar` (`home_label`, `info_label`, `about_label`, `careers_label`, `services_label`, `global_presence_label`, `contact_label`) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [home_label, info_label, about_label, careers_label, services_label, global_presence_label, contact_label]
      );
    } else {
      await pool.query(
        'UPDATE `navigation_bar` SET `home_label` = ?, `info_label` = ?, `about_label` = ?, `careers_label` = ?, `services_label` = ?, `global_presence_label` = ?, `contact_label` = ? WHERE `id` = ?',
        [home_label, info_label, about_label, careers_label, services_label, global_presence_label, contact_label, rows[0].id]
      );
    }
    const [updatedRows] = await pool.query('SELECT * FROM `navigation_bar` LIMIT 1');
    res.json(updatedRows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET All About Us pages
app.get('/api/about-us-page', async (req, res) => {
  if (!pool) {
    return res.json(localAboutUsPages);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `about_us_page`');
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET Single About Us page by country code
app.get('/api/about-us-page/:country_code', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  if (!pool) {
    const record = localAboutUsPages.find(p => p.country_code === countryCode) || localAboutUsPages[0];
    return res.json(record);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `about_us_page` WHERE `country_code` = ?', [countryCode]);
    if (rows.length === 0) {
      return res.status(404).send(`About Us page settings for country ${countryCode} not found.`);
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// UPDATE About Us page by country code
app.put('/api/about-us-page/:country_code', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  const { hero_title, hero_subtitle, about_title, paragraph_1, paragraph_2, paragraph_3, paragraph_4, image_url, floating_card_title, floating_card_subtitle, final_paragraph } = req.body;
  try {
    const query = `
      INSERT INTO \`about_us_page\` 
        (\`country_code\`, \`hero_title\`, \`hero_subtitle\`, \`about_title\`, \`paragraph_1\`, \`paragraph_2\`, \`paragraph_3\`, \`paragraph_4\`, \`image_url\`, \`floating_card_title\`, \`floating_card_subtitle\`, \`final_paragraph\`)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`hero_title\` = VALUES(\`hero_title\`),
        \`hero_subtitle\` = VALUES(\`hero_subtitle\`),
        \`about_title\` = VALUES(\`about_title\`),
        \`paragraph_1\` = VALUES(\`paragraph_1\`),
        \`paragraph_2\` = VALUES(\`paragraph_2\`),
        \`paragraph_3\` = VALUES(\`paragraph_3\`),
        \`paragraph_4\` = VALUES(\`paragraph_4\`),
        \`image_url\` = VALUES(\`image_url\`),
        \`floating_card_title\` = VALUES(\`floating_card_title\`),
        \`floating_card_subtitle\` = VALUES(\`floating_card_subtitle\`),
        \`final_paragraph\` = VALUES(\`final_paragraph\`)
    `;
    await pool.query(query, [
      countryCode,
      hero_title || '',
      hero_subtitle || '',
      about_title || '',
      paragraph_1 || '',
      paragraph_2 || '',
      paragraph_3 || '',
      paragraph_4 || null,
      image_url || '',
      floating_card_title || '',
      floating_card_subtitle || '',
      final_paragraph || ''
    ]);

    const [rows] = await pool.query('SELECT * FROM `about_us_page` WHERE `country_code` = ?', [countryCode]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET All Careers pages
app.get('/api/careers-page', async (req, res) => {
  if (!pool) {
    return res.json(localCareersPages);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `careers_page`');
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET Single Careers page by country code
app.get('/api/careers-page/:country_code', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  if (!pool) {
    const record = localCareersPages.find(p => p.country_code === countryCode) || localCareersPages[0];
    return res.json(record);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `careers_page` WHERE `country_code` = ?', [countryCode]);
    if (rows.length === 0) {
      return res.status(404).send(`Careers page settings for country ${countryCode} not found.`);
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// UPDATE Careers page by country code
app.put('/api/careers-page/:country_code', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  const { 
    hero_title, 
    hero_subtitle, 
    hero_button_text, 
    why_join_title, 
    why_join_description, 
    opportunities_title, 
    opportunities_description, 
    opportunities_status, 
    cta_title, 
    cta_subtitle, 
    cta_btn1_label, 
    cta_btn2_label 
  } = req.body;

  try {
    const query = `
      INSERT INTO \`careers_page\` 
        (\`country_code\`, \`hero_title\`, \`hero_subtitle\`, \`hero_button_text\`, \`why_join_title\`, \`why_join_description\`, \`opportunities_title\`, \`opportunities_description\`, \`opportunities_status\`, \`cta_title\`, \`cta_subtitle\`, \`cta_btn1_label\`, \`cta_btn2_label\`)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`hero_title\` = VALUES(\`hero_title\`),
        \`hero_subtitle\` = VALUES(\`hero_subtitle\`),
        \`hero_button_text\` = VALUES(\`hero_button_text\`),
        \`why_join_title\` = VALUES(\`why_join_title\`),
        \`why_join_description\` = VALUES(\`why_join_description\`),
        \`opportunities_title\` = VALUES(\`opportunities_title\`),
        \`opportunities_description\` = VALUES(\`opportunities_description\`),
        \`opportunities_status\` = VALUES(\`opportunities_status\`),
        \`cta_title\` = VALUES(\`cta_title\`),
        \`cta_subtitle\` = VALUES(\`cta_subtitle\`),
        \`cta_btn1_label\` = VALUES(\`cta_btn1_label\`),
        \`cta_btn2_label\` = VALUES(\`cta_btn2_label\`)
    `;
    await pool.query(query, [
      countryCode,
      hero_title || '',
      hero_subtitle || '',
      hero_button_text || 'View Open Positions',
      why_join_title || '',
      why_join_description || '',
      opportunities_title || '',
      opportunities_description || '',
      opportunities_status || '',
      cta_title || '',
      cta_subtitle || '',
      cta_btn1_label || 'Submit Your Resume',
      cta_btn2_label || 'Contact HR'
    ]);

    const [rows] = await pool.query('SELECT * FROM `careers_page` WHERE `country_code` = ?', [countryCode]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET All Services pages
app.get('/api/services-page', async (req, res) => {
  if (!pool) {
    return res.json(localServicesPages);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `services_page`');
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET Single Services page by country code
app.get('/api/services-page/:country_code', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  if (!pool) {
    const record = localServicesPages.find(p => p.country_code === countryCode) || localServicesPages[0];
    return res.json(record);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `services_page` WHERE `country_code` = ?', [countryCode]);
    if (rows.length === 0) {
      return res.status(404).send(`Services page settings for country ${countryCode} not found.`);
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// UPDATE Services page by country code
app.put('/api/services-page/:country_code', async (req, res) => {
  const countryCode = req.params.country_code.toUpperCase();
  const { 
    hero_title, 
    hero_subtitle, 
    services_title, 
    services_description, 
    why_choose_title, 
    why_choose_description, 
    cta_btn_text 
  } = req.body;

  try {
    const query = `
      INSERT INTO \`services_page\` 
        (\`country_code\`, \`hero_title\`, \`hero_subtitle\`, \`services_title\`, \`services_description\`, \`why_choose_title\`, \`why_choose_description\`, \`cta_btn_text\`)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`hero_title\` = VALUES(\`hero_title\`),
        \`hero_subtitle\` = VALUES(\`hero_subtitle\`),
        \`services_title\` = VALUES(\`services_title\`),
        \`services_description\` = VALUES(\`services_description\`),
        \`why_choose_title\` = VALUES(\`why_choose_title\`),
        \`why_choose_description\` = VALUES(\`why_choose_description\`),
        \`cta_btn_text\` = VALUES(\`cta_btn_text\`)
    `;
    await pool.query(query, [
      countryCode,
      hero_title || '',
      hero_subtitle || '',
      services_title || '',
      services_description || '',
      why_choose_title || '',
      why_choose_description || '',
      cta_btn_text || 'Request a Quote'
    ]);

    const [rows] = await pool.query('SELECT * FROM `services_page` WHERE `country_code` = ?', [countryCode]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET Service Details by Country and Service Slug
app.get('/api/service-details/:country_code/:service_slug', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: "Hostinger MySQL database connection is offline. Local fallbacks are disabled." });
  }
  try {
    const { country_code, service_slug } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM `service_details` WHERE `country_code` = ? AND `service_slug` = ?',
      [country_code.toUpperCase(), service_slug.toLowerCase()]
    );
    if (rows.length === 0) {
      return res.status(404).send(`Service details for ${country_code} and ${service_slug} not found.`);
    }
    const record = rows[0];
    if (record.features_list) {
      try {
        record.features_list = JSON.parse(record.features_list);
      } catch (e) {
        record.features_list = [];
      }
    } else {
      record.features_list = [];
    }
    res.json(record);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// UPDATE/PUT Service Details by Country and Service Slug
app.put('/api/service-details/:country_code/:service_slug', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: "Hostinger MySQL database connection is offline. Local fallbacks are disabled." });
  }
  try {
    const { country_code, service_slug } = req.params;
    const {
      hero_title,
      hero_subtitle,
      hero_image_url,
      section1_title,
      section1_content,
      section1_image_url,
      features_title,
      features_list,
      cta_title,
      cta_button_text,
      cta_button_link
    } = req.body;

    const serializedFeatures = Array.isArray(features_list) ? JSON.stringify(features_list) : JSON.stringify([]);

    await pool.query(
      `INSERT INTO \`service_details\` 
        (\`country_code\`, \`service_slug\`, \`hero_title\`, \`hero_subtitle\`, \`hero_image_url\`, \`section1_title\`, \`section1_content\`, \`section1_image_url\`, \`features_title\`, \`features_list\`, \`cta_title\`, \`cta_button_text\`, \`cta_button_link\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         \`hero_title\` = VALUES(\`hero_title\`),
         \`hero_subtitle\` = VALUES(\`hero_subtitle\`),
         \`hero_image_url\` = VALUES(\`hero_image_url\`),
         \`section1_title\` = VALUES(\`section1_title\`),
         \`section1_content\` = VALUES(\`section1_content\`),
         \`section1_image_url\` = VALUES(\`section1_image_url\`),
         \`features_title\` = VALUES(\`features_title\`),
         \`features_list\` = VALUES(\`features_list\`),
         \`cta_title\` = VALUES(\`cta_title\`),
         \`cta_button_text\` = VALUES(\`cta_button_text\`),
         \`cta_button_link\` = VALUES(\`cta_button_link\`)`,
      [
        country_code.toUpperCase(),
        service_slug.toLowerCase(),
        hero_title || '',
        hero_subtitle || '',
        hero_image_url || '',
        section1_title || '',
        section1_content || '',
        section1_image_url || '',
        features_title || '',
        serializedFeatures,
        cta_title || '',
        cta_button_text || '',
        cta_button_link || ''
      ]
    );

    const [rows] = await pool.query(
      'SELECT * FROM `service_details` WHERE `country_code` = ? AND `service_slug` = ?',
      [country_code.toUpperCase(), service_slug.toLowerCase()]
    );
    const record = rows[0];
    if (record.features_list) {
      try {
        record.features_list = JSON.parse(record.features_list);
      } catch (e) {
        record.features_list = [];
      }
    }
    res.json(record);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET all global presence offices
app.get('/api/global-presence-offices', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: "Hostinger MySQL database connection is offline." });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `global_presence_offices` ORDER BY `office_country` ASC, `city_name` ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST create a new global presence office
app.post('/api/global-presence-offices', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: "Hostinger MySQL database connection is offline." });
  }
  try {
    const { country_code, office_country, city_name, office_name, address, phone, email, latitude, longitude } = req.body;
    await pool.query(
      'INSERT INTO `global_presence_offices` (country_code, office_country, city_name, office_name, address, phone, email, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [country_code || '', office_country || '', city_name || '', office_name || '', address || '', phone || '', email || '', latitude || 0, longitude || 0]
    );
    res.status(201).json({ message: "Office created successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PUT update a global presence office
app.put('/api/global-presence-offices/:id', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: "Hostinger MySQL database connection is offline." });
  }
  try {
    const { id } = req.params;
    const { country_code, office_country, city_name, office_name, address, phone, email, latitude, longitude } = req.body;
    await pool.query(
      'UPDATE `global_presence_offices` SET country_code = ?, office_country = ?, city_name = ?, office_name = ?, address = ?, phone = ?, email = ?, latitude = ?, longitude = ? WHERE id = ?',
      [country_code || '', office_country || '', city_name || '', office_name || '', address || '', phone || '', email || '', latitude || 0, longitude || 0, id]
    );
    res.json({ message: "Office updated successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE a global presence office
app.delete('/api/global-presence-offices/:id', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: "Hostinger MySQL database connection is offline." });
  }
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM `global_presence_offices` WHERE id = ?', [id]);
    res.json({ message: "Office deleted successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// GET all admin countries
app.get('/api/countries', async (req, res) => {
  if (!pool) {
    // If DB is offline, return fallback list
    return res.json([
      { id: 1, code: 'SG', name: 'Singapore', flag: '🇸🇬' },
      { id: 2, code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
      { id: 3, code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
      { id: 4, code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
      { id: 5, code: 'UK', name: 'United Kingdom', flag: '🇬🇧' }
    ]);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM `admin_countries` ORDER BY `name` ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST add new country
app.post('/api/countries', async (req, res) => {
  if (!pool) return res.status(500).json({ error: "DB offline" });
  try {
    const { code, name, flag, link_path } = req.body;
    await pool.query(
      'INSERT INTO `admin_countries` (code, name, flag, link_path) VALUES (?, ?, ?, ?)',
      [code.toUpperCase(), name, flag || '🏳️', link_path || null]
    );
    res.status(201).json({ message: "Country added successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PUT update country
app.put('/api/countries/:id', async (req, res) => {
  if (!pool) return res.status(500).json({ error: "DB offline" });
  try {
    const { id } = req.params;
    const { code, name, flag, link_path } = req.body;
    await pool.query(
      'UPDATE `admin_countries` SET code = ?, name = ?, flag = ?, link_path = ? WHERE id = ?',
      [code.toUpperCase(), name, flag || '🏳️', link_path || null, id]
    );
    res.json({ message: "Country updated successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE country
app.delete('/api/countries/:id', async (req, res) => {
  if (!pool) return res.status(500).json({ error: "DB offline" });
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM `admin_countries` WHERE id = ?', [id]);
    res.json({ message: "Country deleted successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Serve static built frontend files from 'dist' directory if present
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  // Serve index.html for all non-API GET requests to support React Router SPA routing
  app.get('*all', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Start the server and connect to the database
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  initDb();
});

