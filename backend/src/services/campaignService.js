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

const triggerCampaignLocally = async ({ campaign, target, fallbackReason = null }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let insertResult;

    if (target === 'inactive') {
      insertResult = await client.query(
        `INSERT INTO messages (customer_id, campaign_id, message, channel, status)
         SELECT id, $1, $2, 'whatsapp', 'sent'
         FROM customers
         WHERE last_visit IS NOT NULL
           AND last_visit < CURRENT_DATE - $3::int
         RETURNING id`,
        [campaign.id, campaign.message, DEFAULT_INACTIVE_DAYS]
      );
    } else {
      insertResult = await client.query(
        `INSERT INTO messages (customer_id, campaign_id, message, channel, status)
         SELECT id, $1, $2, 'whatsapp', 'sent'
         FROM customers
         RETURNING id`,
        [campaign.id, campaign.message]
      );
    }

    const detailPrefix = fallbackReason
      ? `Campaign ${campaign.name} processed locally after webhook fallback`
      : `Campaign ${campaign.name} processed locally`;

    await logService.createLogWithClient(client, {
      event_type: 'Campaign Triggered',
      details: `${detailPrefix} for target "${target}" with ${insertResult.rowCount} messages. ${fallbackReason ? `Reason: ${fallbackReason}` : 'Webhook was not used.'}`,
    });

    await client.query('COMMIT');

    return {
      messagesSent: insertResult.rowCount,
      mode: 'local',
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const triggerCampaign = async ({ campaignId, target }) => {
  const campaign = await getCampaignById(pool, campaignId);

  if (!campaign) {
    return null;
  }

  const webhookResult = await sendWebhookTrigger({ campaignId, target });

  if (webhookResult.ok) {
    await logService.createLog({
      event_type: 'Campaign Triggered',
      details: `Campaign ${campaign.name} dispatched to n8n webhook for target "${target}".`,
    });

    return {
      messagesSent: 0,
      mode: 'webhook',
    };
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
