// backend/config/database.js

const { Pool } = require('pg');
require('dotenv').config();

// Initialize the PostgreSQL Pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'stormbrainer',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  // Optional: Add SSL configuration if deploying to a service like Heroku or Vercel
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

/**
 * Custom query function for clean error handling and logging (Optional)
 * @param {string} text - SQL query text
 * @param {Array} params - Array of query parameters
 */
const query = (text, params) => pool.query(text, params);

// Export the pool and the simplified query function for controllers
module.exports = {
  pool,
  query,
};