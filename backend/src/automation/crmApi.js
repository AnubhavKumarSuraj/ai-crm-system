const customerService = require('../services/customerService');
const campaignService = require('../services/campaignService');
const logService = require('../services/logService');

const getInactiveCustomers = async ({ days }) => {
  return customerService.getInactiveCustomers(days);
};

const triggerCampaign = async ({ campaignId, target, inactiveDays }) => {
  return campaignService.triggerCampaign({
    campaignId,
    target,
    inactiveDays,
    source: 'scheduled_campaign',
  });
};

const createLog = async ({ eventType, details }) => {
  return logService.createLog({
    event_type: eventType,
    details,
  });
};

module.exports = {
  getInactiveCustomers,
  triggerCampaign,
  createLog,
};
