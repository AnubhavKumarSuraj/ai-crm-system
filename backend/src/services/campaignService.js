const pool = require('../../config/db');
const logService = require('./logService');
const { sendTelegramMessage, sendTelegramPhoto } = require('./telegramService');

const DEFAULT_INACTIVE_DAYS = 30;
const WEBHOOK_TIMEOUT_MS = 5000;
const MESSAGE_SOURCES = {
  campaign_trigger: 'Campaign',
  inactive_recovery: 'Recovery',
  ai_campaign: 'AI Promo',
  scheduled_campaign: 'Scheduled',
};

const resolveMessageSource = ({ source, campaign }) => {
  if (source && MESSAGE_SOURCES[source]) {
    return {
      source,
      sourceLabel: MESSAGE_SOURCES[source],
    };
  }

  if (campaign.type === 'automated') {
    return {
      source: 'ai_campaign',
      sourceLabel: MESSAGE_SOURCES.ai_campaign,
    };
  }

  return {
    source: 'campaign_trigger',
    sourceLabel: MESSAGE_SOURCES.campaign_trigger,
  };
};

const createCampaign = async ({ name, message, type, image_url = null, status = 'draft', audience = null }) => {
  const result = await pool.query(
    `INSERT INTO campaigns (name, message, type, image_url, status, audience)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [name, message, type, image_url, status, audience]
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
    `SELECT id, name, message, type
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
  source,
  sourceLabel,
}) => {
  if (target === 'inactive') {
    return client.query(
      `INSERT INTO messages
       (customer_id, campaign_id, message, channel, status, source, source_label)
       SELECT id, $1, $2, 'whatsapp', $3, $4, $5
       FROM customers
       WHERE last_visit IS NOT NULL
         AND last_visit < CURRENT_DATE - $6::int
       RETURNING id`,
      [
        campaign.id,
        campaign.message,
        status,
        source,
        sourceLabel,
        DEFAULT_INACTIVE_DAYS,
      ]
    );
  }

  return client.query(
    `INSERT INTO messages
     (customer_id, campaign_id, message, channel, status, source, source_label)
     SELECT id, $1, $2, 'whatsapp', $3, $4, $5
     FROM customers
     RETURNING id`,
    [campaign.id, campaign.message, status, source, sourceLabel]
  );
};

const sendWebhookTrigger = async ({
  campaignId,
  target,
  source,
  sourceLabel,
}) => {
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
        source,
        source_label: sourceLabel,
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
  source,
  sourceLabel,
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
      source,
      sourceLabel,
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
  source,
  sourceLabel,
  fallbackReason = null,
}) => {
  return recordCampaignDispatch({
    campaign,
    target,
    mode: 'local',
    status: 'sent',
    source,
    sourceLabel,
    logDetails: (count) => {
      const detailPrefix = fallbackReason
        ? `Campaign ${campaign.name} processed locally after webhook fallback`
        : `Campaign ${campaign.name} processed locally`;

      return `${detailPrefix} for target "${target}" with ${count} messages. ${fallbackReason ? `Reason: ${fallbackReason}` : 'Webhook was not used.'}`;
    },
  });
};

const recordWebhookDispatch = async ({
  campaign,
  target,
  source,
  sourceLabel,
}) => {
  return recordCampaignDispatch({
    campaign,
    target,
    mode: 'webhook',
    status: 'pending',
    source,
    sourceLabel,
    logDetails: (count) =>
      `Campaign ${campaign.name} dispatched to n8n webhook for target "${target}" with ${count} pending message rows recorded.`,
  });
};

const triggerCampaign = async ({ campaignId, target, source }) => {
  const campaign = await getCampaignById(pool, campaignId);

  if (!campaign) {
    return null;
  }

  const messageSource = resolveMessageSource({ source, campaign });

  const webhookResult = await sendWebhookTrigger({
    campaignId,
    target,
    ...messageSource,
  });

  if (webhookResult.ok) {
    return recordWebhookDispatch({
      campaign,
      target,
      ...messageSource,
    });
  }

  return triggerCampaignLocally({
    campaign,
    target,
    ...messageSource,
    fallbackReason: webhookResult.reason,
  });
};

// Full AI campaign flow with real Telegram delivery
const sendAiCampaign = async ({ name, message, image_url, audience }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insert campaign as draft
    const campResult = await client.query(
      `INSERT INTO campaigns (name, message, type, image_url, status, audience)
       VALUES ($1, $2, 'automated', $3, 'draft', $4)
       RETURNING id`,
      [name, message, image_url || null, audience || 'all']
    );
    const campaignId = campResult.rows[0].id;

    // 2. Fetch customers that have a telegram_chat_id (required for delivery)
    const audienceWhere = audience === 'inactive'
      ? `WHERE telegram_chat_id IS NOT NULL AND telegram_chat_id <> ''
           AND last_visit IS NOT NULL AND last_visit < CURRENT_DATE - 30`
      : `WHERE telegram_chat_id IS NOT NULL AND telegram_chat_id <> ''`;

    const { rows: customers } = await client.query(
      `SELECT id, name, telegram_chat_id FROM customers ${audienceWhere}`
    );

    if (customers.length === 0) {
      // No eligible customers — still commit the draft campaign
      await client.query(
        `UPDATE campaigns SET status = 'sent', sent_at = NOW() WHERE id = $1`,
        [campaignId]
      );
      await client.query('COMMIT');
      return { campaignId, messagesSent: 0, messagesFailed: 0 };
    }

    // 3. Send to each customer individually; track sent / failed
    let sent = 0;
    let failed = 0;

    for (const customer of customers) {
      console.log('REUSING IMAGE FOR CUSTOMER:', customer.id);
      const result = image_url
        ? await sendTelegramPhoto(customer.telegram_chat_id, image_url, message)
        : await sendTelegramMessage(customer.telegram_chat_id, message);

      const status = result.success ? 'sent' : 'failed';
      const providerId = result.data?.message_id ? String(result.data.message_id) : null;
      const errorMsg = result.error || null;

      if (result.success) sent++; else failed++;

      await client.query(
        `INSERT INTO messages
           (customer_id, campaign_id, message, channel, status,
            source, source_label, provider, provider_message_id, error_message)
         VALUES ($1, $2, $3, 'telegram', $4,
                 'ai_campaign', 'AI Promo', 'telegram', $5, $6)`,
        [customer.id, campaignId, message, status, providerId, errorMsg]
      );
    }

    // 4. Mark campaign sent
    await client.query(
      `UPDATE campaigns SET status = 'sent', sent_at = NOW() WHERE id = $1`,
      [campaignId]
    );

    // 5. Log
    await logService.createLogWithClient(client, {
      event_type: 'AI Campaign Sent',
      details: `Campaign "${name}" delivered via Telegram: ${sent} sent, ${failed} failed.`,
    });

    await client.query('COMMIT');
    return { campaignId, messagesSent: sent, messagesFailed: failed };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const sendCampaignImage = async ({ campaignId, image_url, audience }) => {
  const audienceWhere = audience === 'inactive'
    ? `WHERE telegram_chat_id IS NOT NULL AND telegram_chat_id <> ''
         AND last_visit IS NOT NULL AND last_visit < CURRENT_DATE - 30`
    : `WHERE telegram_chat_id IS NOT NULL AND telegram_chat_id <> ''`;

  const { rows: customers } = await pool.query(
    `SELECT id, name, telegram_chat_id FROM customers ${audienceWhere}`
  );

  let sent = 0;
  let failed = 0;

  for (const customer of customers) {
    console.log('REUSING IMAGE FOR CUSTOMER:', customer.id);
    const result = await sendTelegramPhoto(customer.telegram_chat_id, image_url, '');
    if (result.success) sent++; else failed++;
  }

  await pool.query(
    `UPDATE campaigns SET image_url = $1 WHERE id = $2`,
    [image_url, campaignId]
  );

  return { sent, failed };
};

module.exports = {
  createCampaign,
  getCampaigns,
  triggerCampaign,
  sendAiCampaign,
  sendCampaignImage,
  MESSAGE_SOURCES,
};
