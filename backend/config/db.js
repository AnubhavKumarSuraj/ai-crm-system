const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DB_URL;

if (!connectionString) {
  throw new Error('DB_URL is not set in backend/.env');
}

const getSafeTarget = (value) => {
  try {
    const parsed = new URL(value);
    const dbName = parsed.pathname.replace(/^\//, '') || 'postgres';
    return `${parsed.hostname}:${parsed.port || '5432'}/${dbName}`;
  } catch {
    return 'configured database';
  }
};

console.log(`Connecting to PostgreSQL at ${getSafeTarget(connectionString)}`);

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT current_database(), current_user;');
    console.log('PostgreSQL connected successfully:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('PostgreSQL connection error:', err.message);
  }
};

connectDB();

module.exports = pool;
