const pool = require('../config/db');

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE campaigns
        ADD COLUMN IF NOT EXISTS image_url TEXT,
        ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
        ADD COLUMN IF NOT EXISTS audience TEXT,
        ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ
    `);
    console.log('Migration OK: campaigns table updated.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
