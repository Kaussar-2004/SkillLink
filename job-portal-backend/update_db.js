const fs = require('fs');
const path = require('path');
const db = require('./models/db');

async function updateDatabase() {
  try {
    console.log('Starting database update...');
    
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
      console.log('company_name column already exists.');
    }
    
    // Reset auto-increment counters for both tables
    console.log('Resetting auto-increment counters...');
    await db.query('ALTER TABLE applications AUTO_INCREMENT = 1');
    await db.query('ALTER TABLE jobs AUTO_INCREMENT = 1');
    
    console.log('Database update completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating database:', error);
    process.exit(1);
  }
}

updateDatabase();