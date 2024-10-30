// db.js
// const { Pool } = require('pg');

// // Create a pool to manage connections
// const pool = new Pool({
//   user: 'postgres',         // Your PostgreSQL user
//   host: 'localhost',        // Database server
//   database: 'WellNest',     // Your database name
//   password: '011009', // Your PostgreSQL password
//   port: 5432,               // Default PostgreSQL port
// });

// // Test the connection
// pool.connect((err) => {
//   if (err) {
//     console.error('Database connection error:', err.stack);
//   } else {
//     console.log('Connected to the database');
//   }
// });

// // Export the pool for use in other files
// module.exports = pool;

// config/db.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pool.connect((err) => {
  if (err) {
    console.error("Failed to connect to the database:", err.stack);
  } else {
    console.log("Connected to the PostgreSQL database.");
  }
});

module.exports = pool;
