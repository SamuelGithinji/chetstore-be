const dotenv = require('dotenv')

dotenv.config();

const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
console.log(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: connectionString,
  ssl: isProduction ? {rejectUnauthorized: false} : isProduction,
});

module.exports = pool;
