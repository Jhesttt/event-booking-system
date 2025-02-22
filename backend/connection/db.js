const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'ballast.proxy.rlwy.net', // Railway's external host ✅
  user: 'root',
  password: 'JKrdHjvUnaZMbMsDBLfvpmnnbmlgoGJb',
  database: 'railway',
  port: 24219, // Correct Railway port ✅
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Export the pool
module.exports = pool;
