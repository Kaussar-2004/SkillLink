const mysql = require('mysql2/promise');

// Create a connection pool with better error handling
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'job_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the database connection
(async () => {
  try {
    const [result] = await db.query('SELECT 1');
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
})();

module.exports = db;
