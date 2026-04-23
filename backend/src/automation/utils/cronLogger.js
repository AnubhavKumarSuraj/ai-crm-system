const buildSuffix = (meta) => {
  if (!meta) {
    return '';
  }

  return ` ${JSON.stringify(meta)}`;
};

const info = (message, meta) => {
  console.log(`[CRON] ${message}${buildSuffix(meta)}`);
};

const start = (message, meta) => {
  console.log(`[CRON] START ${message}${buildSuffix(meta)}`);
};

const success = (message, meta) => {
  console.log(`[CRON] SUCCESS ${message}${buildSuffix(meta)}`);
};

const warn = (message, meta) => {
  console.warn(`[CRON] WARN ${message}${buildSuffix(meta)}`);
};

const error = (message, err) => {
  const meta = err
    ? {
        message: err.message,
      }
    : undefined;

  console.error(`[CRON] ERROR ${message}${buildSuffix(meta)}`);
};

module.exports = {
  info,
  start,
  success,
  warn,
  error,
};
