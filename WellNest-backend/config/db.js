// config/db.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  apiBaseUrl: process.env.REACT_APP_API_URL,
});

pool.connect((err) => {
  if (err) {
    console.error("Failed to connect to the database:", err.stack);
  } else {
    console.log("Connected to the PostgreSQL database.");
  }
});

module.exports = pool;
