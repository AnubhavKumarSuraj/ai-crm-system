const pool = require('../config/db');

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE customers
        ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT
    `);
    console.log('Migration OK: customers.telegram_chat_id added.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
