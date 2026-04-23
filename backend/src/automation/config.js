const toBoolean = (value, defaultValue) => {
  if (value === undefined) {
    return defaultValue;
  }

  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const toPositiveInteger = (value, defaultValue) => {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return defaultValue;
  }

  return parsed;
};

module.exports = {
  enabled: toBoolean(process.env.AUTOMATION_ENABLED, true),
  timezone: process.env.AUTOMATION_TIMEZONE || process.env.TZ || 'Asia/Kolkata',
  inactiveRecovery: {
    enabled: toBoolean(process.env.AUTOMATION_INACTIVE_RECOVERY_ENABLED, true),
    cronExpression:
      process.env.AUTOMATION_INACTIVE_RECOVERY_CRON || '0 9 * * *',
    inactiveDays: toPositiveInteger(process.env.AUTOMATION_INACTIVE_DAYS, 30),
    campaignId:
      process.env.AUTOMATION_INACTIVE_CAMPAIGN_ID ||
      process.env.INACTIVE_RECOVERY_CAMPAIGN_ID ||
      '',
  },
  dailySummary: {
    enabled: toBoolean(process.env.AUTOMATION_DAILY_SUMMARY_ENABLED, false),
    cronExpression: process.env.AUTOMATION_DAILY_SUMMARY_CRON || '30 9 * * *',
  },
};
