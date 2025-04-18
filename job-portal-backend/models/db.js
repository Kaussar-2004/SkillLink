const mysql = require('mysql2/promise');

// Create a connection pool with better error handling
const db = mysql.createPool({
 host: 'bnvcjlbbnm5ooyxgco7e-mysql.services.clever-cloud.com',
  user: 'upoiicsoxl5swbd8',
  password: 'sPi990eAeH6ZrrDQV2r7',
  database: 'bnvcjlbbnm5ooyxgco7e',
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
