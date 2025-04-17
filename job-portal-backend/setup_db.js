const db = require('./models/db');

async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Check if applications table exists
    const [tables] = await db.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'job_portal' 
      AND TABLE_NAME = 'applications'
    `);
    
    // Create applications table if it doesn't exist
    if (tables.length === 0) {
      console.log('Creating applications table...');
      await db.query(`
        CREATE TABLE applications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          job_id INT NOT NULL,
          applicant_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          company_name VARCHAR(255),
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
        )
      `);
      console.log('Applications table created successfully');
    } else {
      console.log('Applications table already exists');
      
      // Check if company_name column exists
      const [columns] = await db.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'job_portal' 
        AND TABLE_NAME = 'applications' 
        AND COLUMN_NAME = 'company_name'
      `);
      
      // Add company_name column if it doesn't exist
      if (columns.length === 0) {
        console.log('Adding company_name column to applications table...');
        await db.query('ALTER TABLE applications ADD COLUMN company_name VARCHAR(255)');
        
        // Update existing applications with company_name from jobs table
        console.log('Updating existing applications with company names...');
        await db.query(`
          UPDATE applications a
          JOIN jobs j ON a.job_id = j.id
          SET a.company_name = j.company_name
          WHERE a.company_name IS NULL
        `);
      } else {
        console.log('company_name column already exists');
      }
    }
    
    // Check if jobs table exists
    const [jobTables] = await db.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'job_portal' 
      AND TABLE_NAME = 'jobs'
    `);
    
    // Create jobs table if it doesn't exist
    if (jobTables.length === 0) {
      console.log('Creating jobs table...');
      await db.query(`
        CREATE TABLE jobs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          job_title VARCHAR(255) NOT NULL,
          job_description TEXT NOT NULL,
          company_name VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          job_type VARCHAR(50) NOT NULL,
          salary_range VARCHAR(100),
          application_deadline DATE,
          posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Jobs table created successfully');
    } else {
      console.log('Jobs table already exists');
    }
    
    // Reset auto-increment counters for both tables
    console.log('Resetting auto-increment counters...');
    await db.query('ALTER TABLE applications AUTO_INCREMENT = 1');
    await db.query('ALTER TABLE jobs AUTO_INCREMENT = 1');
    
    console.log('Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();