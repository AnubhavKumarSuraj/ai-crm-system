const campaignService = require('../services/campaignService');

const VALID_CAMPAIGN_TYPES = new Set(['manual', 'automated']);
const VALID_TARGETS = new Set(['all', 'inactive']);

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
  const { campaign_id, target } = req.body;

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

  try {
    const result = await campaignService.triggerCampaign({
      campaignId: campaign_id,
      target,
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
