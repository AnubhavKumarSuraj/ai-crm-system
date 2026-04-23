const cron = require('node-cron');

const automationConfig = require('../config');
const automationService = require('../services/automationService');
const cronLogger = require('../utils/cronLogger');

const createInactiveRecoveryJob = () => {
  if (!automationConfig.inactiveRecovery.enabled) {
    cronLogger.info('Inactive recovery job is disabled.');
    return null;
  }

  const task = cron.schedule(
    automationConfig.inactiveRecovery.cronExpression,
    async () => {
      cronLogger.start('Inactive recovery job started.');

      try {
        const result = await automationService.runInactiveRecovery();
        cronLogger.success('Inactive recovery job finished.', result);
      } catch (error) {
        cronLogger.error('Inactive recovery job failed.', error);
      }
    },
    {
      timezone: automationConfig.timezone,
    }
  );

  cronLogger.info('Inactive recovery job scheduled.', {
    cron: automationConfig.inactiveRecovery.cronExpression,
    timezone: automationConfig.timezone,
    inactiveDays: automationConfig.inactiveRecovery.inactiveDays,
  });

  return task;
};

module.exports = createInactiveRecoveryJob;
