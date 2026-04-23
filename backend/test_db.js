const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const res = await pool.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name = 'customers';
    `);
    console.log("Customers tables found in these schemas:", res.rows);
    
    // Also let's check what search_path is for this connection
    const sp = await pool.query(`SHOW search_path`);
    console.log("search_path is:", sp.rows);

    const tables = await pool.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema IN ('public', 'postgres')
    `);
    console.log("All tables in public/postgres schemas:", tables.rows.map(r => r.table_schema + '.' + r.table_name));

  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();
