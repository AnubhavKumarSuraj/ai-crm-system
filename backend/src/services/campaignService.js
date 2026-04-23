const pool = require('../../config/db');
const logService = require('./logService');

const DEFAULT_INACTIVE_DAYS = 30;
const WEBHOOK_TIMEOUT_MS = 5000;

const createCampaign = async ({ name, message, type }) => {
  const result = await pool.query(
    `INSERT INTO campaigns (name, message, type)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [name, message, type]
  );

  return result.rows[0];
};

const getCampaigns = async () => {
  const result = await pool.query(
    `SELECT *
     FROM campaigns
     ORDER BY created_at DESC`
  );

  return result.rows;
};

const getCampaignById = async (executor, campaignId) => {
  const result = await executor.query(
    `SELECT id, name, message
     FROM campaigns
     WHERE id = $1`,
    [campaignId]
  );

  return result.rows[0] || null;
};

const insertCampaignMessages = async ({
  client,
  campaign,
  target,
  status,
}) => {
  if (target === 'inactive') {
    return client.query(
      `INSERT INTO messages (customer_id, campaign_id, message, channel, status)
       SELECT id, $1, $2, 'whatsapp', $3
       FROM customers
       WHERE last_visit IS NOT NULL
         AND last_visit < CURRENT_DATE - $4::int
       RETURNING id`,
      [campaign.id, campaign.message, status, DEFAULT_INACTIVE_DAYS]
    );
  }

  return client.query(
    `INSERT INTO messages (customer_id, campaign_id, message, channel, status)
     SELECT id, $1, $2, 'whatsapp', $3
     FROM customers
     RETURNING id`,
    [campaign.id, campaign.message, status]
  );
};

const sendWebhookTrigger = async ({ campaignId, target }) => {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      ok: false,
      reason: 'N8N_WEBHOOK_URL is not configured',
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        campaign_id: campaignId,
        target,
      }),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });

    if (!response.ok) {
      return {
        ok: false,
        reason: `n8n webhook responded with HTTP ${response.status}`,
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: error.message || 'n8n webhook request failed',
    };
  }
};

const recordCampaignDispatch = async ({
  campaign,
  target,
  mode,
  status,
  logDetails,
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const insertResult = await insertCampaignMessages({
      client,
      campaign,
      target,
      status,
    });

    await logService.createLogWithClient(client, {
      event_type: 'Campaign Triggered',
      details: logDetails(insertResult.rowCount),
    });

    await client.query('COMMIT');

    return {
      messagesSent: insertResult.rowCount,
      mode,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const triggerCampaignLocally = async ({
  campaign,
  target,
  fallbackReason = null,
}) => {
  return recordCampaignDispatch({
    campaign,
    target,
    mode: 'local',
    status: 'sent',
    logDetails: (count) => {
      const detailPrefix = fallbackReason
        ? `Campaign ${campaign.name} processed locally after webhook fallback`
        : `Campaign ${campaign.name} processed locally`;

      return `${detailPrefix} for target "${target}" with ${count} messages. ${fallbackReason ? `Reason: ${fallbackReason}` : 'Webhook was not used.'}`;
    },
  });
};

const recordWebhookDispatch = async ({ campaign, target }) => {
  return recordCampaignDispatch({
    campaign,
    target,
    mode: 'webhook',
    status: 'pending',
    logDetails: (count) =>
      `Campaign ${campaign.name} dispatched to n8n webhook for target "${target}" with ${count} pending message rows recorded.`,
  });
};

const triggerCampaign = async ({ campaignId, target }) => {
  const campaign = await getCampaignById(pool, campaignId);

  if (!campaign) {
    return null;
  }

  const webhookResult = await sendWebhookTrigger({ campaignId, target });

  if (webhookResult.ok) {
    return recordWebhookDispatch({
      campaign,
      target,
    });
  }

  return triggerCampaignLocally({
    campaign,
    target,
    fallbackReason: webhookResult.reason,
  });
};

module.exports = {
  createCampaign,
  getCampaigns,
  triggerCampaign,
};
