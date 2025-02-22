const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'mysql.railway.internal', // Railway's internal host
  user: 'root', // Your database user
  password: 'JKrdHjvUnaZMbMsDBLfvpmnnbmlgoGJb', // Your password
  database: 'railway', // Your database name
  port: 3306, // Railway's default MySQL port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Export the pool
module.exports = pool;
