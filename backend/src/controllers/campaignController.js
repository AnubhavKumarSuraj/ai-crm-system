const campaignService = require('../services/campaignService');
const { sendAiCampaign, sendCampaignImage } = require('../services/campaignService');
const { generateMarketingImage } = require('../services/aiImageService');
const { uploadToSupabase } = require('../services/storageService');

const VALID_CAMPAIGN_TYPES = new Set(['manual', 'automated']);
const VALID_TARGETS = new Set(['all', 'inactive']);
const VALID_MESSAGE_SOURCES = new Set([
  'campaign_trigger',
  'ai_campaign',
  'scheduled_campaign',
]);
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const CAMPAIGN_COOLDOWN_MS = 10000;
let lastAiCampaignTriggeredAt = 0;

exports.createCampaign = async (req, res) => {
  const { name, message, type } = req.body;

  if (!name || !message || !type) {
    return res.status(400).json({
      status: 'error',
      error: 'name, message, and type are required'
    });
  }

  if (!VALID_CAMPAIGN_TYPES.has(type)) {
    return res.status(400).json({
      status: 'error',
      error: 'type must be manual or automated'
    });
  }

  try {
    const result = await campaignService.createCampaign({ name, message, type });

    return res.status(201).json({
      status: 'success',
      campaign_id: result.id
    });
  } catch (err) {
    console.error('createCampaign failed:', err.message);
    return res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const data = await campaignService.getCampaigns();

    return res.status(200).json({
      status: 'success',
      data
    });
  } catch (err) {
    console.error('getCampaigns failed:', err.message);
    return res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
};

exports.triggerCampaign = async (req, res) => {
  const { campaign_id, target, source } = req.body;

  if (!campaign_id || !target) {
    return res.status(400).json({
      status: 'error',
      error: 'campaign_id and target are required'
    });
  }

  if (!VALID_TARGETS.has(target)) {
    return res.status(400).json({
      status: 'error',
      error: 'target must be all or inactive'
    });
  }

  if (!UUID_PATTERN.test(campaign_id)) {
    return res.status(400).json({
      status: 'error',
      error: 'campaign_id must be a valid UUID'
    });
  }

  if (source && !VALID_MESSAGE_SOURCES.has(source)) {
    return res.status(400).json({
      status: 'error',
      error: 'source must be campaign_trigger, ai_campaign, or scheduled_campaign'
    });
  }

  try {
    const result = await campaignService.triggerCampaign({
      campaignId: campaign_id,
      target,
      source,
    });

    if (!result) {
      return res.status(404).json({
        status: 'error',
        error: 'Campaign not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      messages_sent: result.messagesSent,
      mode: result.mode
    });
  } catch (err) {
    console.error('triggerCampaign failed:', err.message);
    return res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
};
exports.sendAiCampaign = async (req, res) => {
  const { name, message, audience } = req.body;

  if (!message) {
    return res.status(400).json({ status: 'error', error: 'message is required' });
  }

  const now = Date.now();
  if (now - lastAiCampaignTriggeredAt < CAMPAIGN_COOLDOWN_MS) {
    console.log('CAMPAIGN TRIGGER BLOCKED: cooldown active');
    return res.status(429).json({ status: 'error', error: 'Please wait before triggering again' });
  }
  lastAiCampaignTriggeredAt = now;

  try {
    // 1. Respond immediately — campaign will be created and sent in background
    res.status(201).json({ status: 'success', message: 'Campaign queued' });

    // 2. Generate image and send image+caption as a single message
    console.log('IMAGE GENERATION STARTED');
    (async () => {
      try {
        let finalImageUrl = null;

        if (req.file) {
          const originalName = req.file.originalname;

          // Upload original image to Supabase so OpenAI can fetch it via URL
          const originalUrl = await uploadToSupabase(req.file.buffer, originalName, req.file.mimetype);
          console.log('ORIGINAL IMAGE UPLOADED:', originalUrl);

          // Send original directly to OpenAI — no background removal, no template
          console.log('GENERATING AI ADVERTISEMENT FROM ORIGINAL IMAGE');
          finalImageUrl = await generateMarketingImage(originalUrl);
          console.log('AI ADVERTISEMENT READY:', finalImageUrl);
        }

        // 3. Send image + caption as one message (or text-only if no image)
        const result = await sendAiCampaign({
          name: name || 'AI Campaign',
          message,
          image_url: finalImageUrl,
          audience: audience || 'all',
        });
        console.log('IMAGE SENT');
        console.log('MESSAGES SENT:', result.messagesSent, '| FAILED:', result.messagesFailed);

      } catch (bgErr) {
        console.error('[async campaign pipeline] failed:', bgErr.message);
      }
    })();
  } catch (err) {
    console.error('sendAiCampaign failed:', err.message);
    return res.status(500).json({ status: 'error', error: err.message });
  }
};
