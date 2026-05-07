const pool = require('../../config/db');

const getMessages = async () => {
  const result = await pool.query(`
    SELECT
      m.id,
      m.message,
      m.channel,
      m.status,
      m.sent_at,
      m.sent_at AS created_at,
      m.customer_id,
      m.campaign_id,
      COALESCE(m.source, 'legacy') AS source,
      COALESCE(m.source_label, 'Legacy') AS source_label,
      m.provider,
      m.provider_message_id,
      m.error_message,
      c.name AS customer_name,
      cp.name AS campaign_name
    FROM messages m
    LEFT JOIN customers c ON m.customer_id = c.id
    LEFT JOIN campaigns cp ON m.campaign_id = cp.id
    ORDER BY m.sent_at DESC
  `);

  return result.rows;
};

const getMessageSummary = async () => {
  const result = await pool.query(`
    SELECT
      (COUNT(*) FILTER (WHERE source = 'inactive_recovery'))::int AS "totalRecoveryMessages",
      (COUNT(*) FILTER (WHERE source = 'campaign_trigger'))::int AS "totalCampaignMessages",
      (COUNT(*) FILTER (WHERE source = 'ai_campaign'))::int AS "totalAiMessages"
    FROM messages
  `);

  return result.rows[0];
};

module.exports = {
  getMessages,
  getMessageSummary,
};
