const automationConfig = require('../config');
const crmApi = require('../crmApi');
const cronLogger = require('../utils/cronLogger');

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let inactiveRecoveryJobRunning = false;

const createAutomationLog = async ({ eventType, details }) => {
  return crmApi.createLog({ eventType, details });
};

const runInactiveRecovery = async (overrides = {}) => {
  if (inactiveRecoveryJobRunning) {
    const details =
      'Inactive recovery skipped because a previous run is still in progress.';

    cronLogger.warn(details);

    return {
      status: 'skipped',
      reason: 'job_already_running',
      inactiveCount: 0,
      messagesSent: 0,
    };
  }

  inactiveRecoveryJobRunning = true;

  const inactiveDays =
    overrides.inactiveDays ?? automationConfig.inactiveRecovery.inactiveDays;
  const campaignId =
    overrides.campaignId || automationConfig.inactiveRecovery.campaignId;

  try {
    cronLogger.info('Checking inactive customers...', {
      inactiveDays,
    });

    const inactiveCustomers = await crmApi.getInactiveCustomers({
      days: inactiveDays,
    });

    const inactiveCount = inactiveCustomers.length;

    if (inactiveCount === 0) {
      const details = `No inactive customers found for the last ${inactiveDays}+ days.`;

      await createAutomationLog({
        eventType: 'Automation - Inactive Recovery',
        details,
      });

      cronLogger.info(details);

      return {
        status: 'skipped',
        reason: 'no_inactive_customers',
        inactiveCount,
        messagesSent: 0,
      };
    }

    if (!campaignId) {
      const details = `Inactive recovery skipped because AUTOMATION_INACTIVE_CAMPAIGN_ID is not configured. ${inactiveCount} inactive customers are waiting for recovery.`;

      await createAutomationLog({
        eventType: 'Automation - Inactive Recovery Skipped',
        details,
      });

      cronLogger.warn(details);

      return {
        status: 'skipped',
        reason: 'campaign_id_missing',
        inactiveCount,
        messagesSent: 0,
      };
    }

    if (!UUID_PATTERN.test(campaignId)) {
      const details = `Inactive recovery skipped because campaign id "${campaignId}" is not a valid UUID.`;

      await createAutomationLog({
        eventType: 'Automation - Inactive Recovery Skipped',
        details,
      });

      cronLogger.warn(details);

      return {
        status: 'skipped',
        reason: 'invalid_campaign_id',
        inactiveCount,
        messagesSent: 0,
      };
    }

    const triggerResult = await crmApi.triggerCampaign({
      campaignId,
      target: 'inactive',
      inactiveDays,
    });

    if (!triggerResult) {
      const details = `Inactive recovery failed because campaign ${campaignId} was not found.`;

      await createAutomationLog({
        eventType: 'Automation - Inactive Recovery Failed',
        details,
      });

      cronLogger.error('Campaign trigger returned null for inactive recovery.');

      throw new Error(details);
    }

    const details = `Inactive recovery processed ${inactiveCount} customers inactive for ${inactiveDays}+ days using campaign ${campaignId}. ${triggerResult.messagesSent} message rows were created in ${triggerResult.mode} mode.`;

    await createAutomationLog({
      eventType: 'Automation - Inactive Recovery',
      details,
    });

    return {
      status: 'success',
      inactiveCount,
      messagesSent: triggerResult.messagesSent,
      mode: triggerResult.mode,
      campaignId,
    };
  } finally {
    inactiveRecoveryJobRunning = false;
  }
};

const runDailySummary = async () => {
  const details =
    'Daily summary job is registered but disabled by default until summary metrics are defined.';

  cronLogger.info(details);

  return {
    status: 'skipped',
    reason: 'not_implemented',
  };
};

module.exports = {
  runInactiveRecovery,
  runDailySummary,
  remindInactiveCustomers: runInactiveRecovery,
};
