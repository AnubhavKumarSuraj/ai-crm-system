const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DB_URL;

if (!connectionString) {
  console.error('DB_URL is not set in backend/.env');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    const dbInfo = await pool.query(
      'SELECT current_database(), current_user, current_schema();'
    );
    const searchPath = await pool.query('SHOW search_path');
    const tables = await pool.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    const customerTable = tables.rows.find((row) => row.table_name === 'customers');

    console.log('Database info:', dbInfo.rows[0]);
    console.log('search_path:', searchPath.rows[0].search_path);
    console.log(
      'Public tables:',
      tables.rows.map((row) => `${row.table_schema}.${row.table_name}`)
    );

    if (customerTable) {
      const customers = await pool.query(
        'SELECT COUNT(*)::int AS count FROM public.customers;'
      );
      console.log('customers row count:', customers.rows[0].count);
    } else {
      console.log('customers table not found in public schema.');
    }
  } catch (error) {
    console.error('DB check failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
