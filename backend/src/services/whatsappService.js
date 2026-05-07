const twilio = require('twilio');
const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '../../.env'),
});

const WHATSAPP_PREFIX = 'whatsapp:';
const DEFAULT_SEND_TIMEOUT_MS = 15000;

const isConfiguredValue = (value) =>
  Boolean(value) && !String(value).startsWith('YOUR_');

const getConfigIssue = (key) => {
  const value = process.env[key];

  if (!value) {
    return `${key} missing`;
  }

  if (String(value).startsWith('YOUR_')) {
    return `${key} still contains placeholder value`;
  }

  return null;
};

const getTwilioConfigIssues = () =>
  [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_WHATSAPP_FROM',
  ].map(getConfigIssue).filter(Boolean);

const getSendTimeoutMs = () => {
  const configured = Number(process.env.TWILIO_SEND_TIMEOUT_MS);
  return Number.isFinite(configured) && configured > 0
    ? configured
    : DEFAULT_SEND_TIMEOUT_MS;
};

const withTimeout = (promise, timeoutMs) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Twilio send timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    }),
  ]);

const formatWhatsAppNumber = (phone) => {
  const rawPhone = String(phone || '').trim();

  if (!rawPhone) {
    return null;
  }

  if (rawPhone.startsWith(WHATSAPP_PREFIX)) {
    return rawPhone;
  }

  const normalized = rawPhone.replace(/[^\d+]/g, '');

  if (!normalized) {
    return null;
  }

  if (normalized.startsWith('+')) {
    return `${WHATSAPP_PREFIX}${normalized}`;
  }

  if (/^\d{10}$/.test(normalized)) {
    return `${WHATSAPP_PREFIX}+91${normalized}`;
  }

  return `${WHATSAPP_PREFIX}+${normalized}`;
};

const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const issues = getTwilioConfigIssues();

  if (issues.length > 0) {
    issues.forEach((issue) => console.error(`[WhatsApp] ${issue}`));
    return null;
  }

  return twilio(accountSid, authToken);
};

const sendWhatsAppMessage = async (to, body) => {
  console.log('[WhatsApp] Preparing Twilio outbound message', {
    to,
    fromConfigured: isConfiguredValue(process.env.TWILIO_WHATSAPP_FROM),
    bodyLength: body.length,
  });

  const client = getTwilioClient();

  if (!client) {
    const issues = getTwilioConfigIssues();

    return {
      success: false,
      error: `Twilio WhatsApp credentials are not configured: ${issues.join(', ')}`,
    };
  }

  try {
    const timeoutMs = getSendTimeoutMs();

    console.log('[WhatsApp] Calling Twilio messages.create', {
      to,
      from: process.env.TWILIO_WHATSAPP_FROM,
      timeoutMs,
    });

    const message = await withTimeout(
      client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to,
        body,
      }),
      timeoutMs
    );

    console.log('[WhatsApp] Twilio message accepted', {
      sid: message.sid,
      status: message.status,
      to,
    });

    return {
      success: true,
      sid: message.sid,
      status: message.status,
    };
  } catch (error) {
    console.error('[WhatsApp] Twilio messages.create failed');
    console.error(error.stack || error);

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  formatWhatsAppNumber,
  getTwilioConfigIssues,
  sendWhatsAppMessage,
};
