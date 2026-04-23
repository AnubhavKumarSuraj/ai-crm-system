const automationConfig = require('./config');
const createInactiveRecoveryJob = require('./jobs/inactiveRecoveryJob');
const createDailySummaryJob = require('./jobs/dailySummaryJob');
const cronLogger = require('./utils/cronLogger');

let started = false;
const scheduledJobs = [];

const startScheduler = () => {
  if (started) {
    return scheduledJobs;
  }

  started = true;

  if (!automationConfig.enabled) {
    cronLogger.warn('Automation scheduler disabled.');
    return scheduledJobs;
  }

  const jobs = [createInactiveRecoveryJob(), createDailySummaryJob()].filter(
    Boolean
  );

  scheduledJobs.push(...jobs);

  cronLogger.info(`Scheduler started with ${scheduledJobs.length} job(s).`, {
    timezone: automationConfig.timezone,
  });

  return scheduledJobs;
};

module.exports = {
  startScheduler,
  scheduledJobs,
};
