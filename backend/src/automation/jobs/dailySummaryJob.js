const cron = require('node-cron');

const automationConfig = require('../config');
const automationService = require('../services/automationService');
const cronLogger = require('../utils/cronLogger');

const createDailySummaryJob = () => {
  if (!automationConfig.dailySummary.enabled) {
    cronLogger.info('Daily summary job is disabled.');
    return null;
  }

  const task = cron.schedule(
    automationConfig.dailySummary.cronExpression,
    async () => {
      cronLogger.start('Daily summary job started.');

      try {
        const result = await automationService.runDailySummary();
        cronLogger.success('Daily summary job finished.', result);
      } catch (error) {
        cronLogger.error('Daily summary job failed.', error);
      }
    },
    {
      timezone: automationConfig.timezone,
    }
  );

  cronLogger.info('Daily summary job scheduled.', {
    cron: automationConfig.dailySummary.cronExpression,
    timezone: automationConfig.timezone,
  });

  return task;
};

module.exports = createDailySummaryJob;
