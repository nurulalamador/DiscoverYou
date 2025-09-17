require('dotenv').config();
const mysql = require('mysql2');

// Create a connection to the database

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD, 
  database: process.env.DATABASE_NAME, 
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DATABASE_SSL_CA
  }
});

module.exports = connection;
