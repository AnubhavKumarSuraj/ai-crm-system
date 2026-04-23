const pool = require('../../config/db');

const getMessages = async () => {
  const result = await pool.query(`
    SELECT
      m.id,
      m.message,
      m.channel,
      m.status,
      c.name AS customer_name,
      cp.name AS campaign_name
    FROM messages m
    LEFT JOIN customers c ON m.customer_id = c.id
    LEFT JOIN campaigns cp ON m.campaign_id = cp.id
    ORDER BY m.id DESC
  `);

  return result.rows;
};

module.exports = {
  getMessages,
};