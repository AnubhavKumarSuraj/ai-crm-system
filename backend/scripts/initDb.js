const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DB_URL;

if (!connectionString) {
  console.error('DB_URL is not set in backend/.env');
  process.exit(1);
}

const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    await pool.query(schemaSql);
    console.log('Schema applied successfully.');
  } catch (error) {
    console.error('Schema apply failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
