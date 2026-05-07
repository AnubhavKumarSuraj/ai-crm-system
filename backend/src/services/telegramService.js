const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '../../.env'),
});

const TELEGRAM_API_BASE = 'https://api.telegram.org';
const SEND_TIMEOUT_MS = 10000;

const getToken = () => process.env.TELEGRAM_BOT_TOKEN || null;

/**
 * Generic request wrapper with timeout
 */
const telegramRequest = async (endpoint, body) => {
  const token = getToken();

  if (!token) {
    return { success: false, error: 'TELEGRAM_BOT_TOKEN is not configured' };
  }

  const url = `${TELEGRAM_API_BASE}/bot${token}/${endpoint}`;

  try {
    const res = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Telegram timeout (${SEND_TIMEOUT_MS}ms)`)), SEND_TIMEOUT_MS)
      ),
    ]);

    const payload = await res.json().catch(() => ({}));

    if (!res.ok || !payload.ok) {
      return {
        success: false,
        error: payload.description || `HTTP ${res.status}`,
      };
    }

    return {
      success: true,
      data: payload.result,
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Send text message
 */
const sendTelegramMessage = async (chatId, text) => {
  return telegramRequest('sendMessage', {
    chat_id: chatId,
    text,
  });
};

/**
 * Send image + caption inline in chat
 */
const sendTelegramPhoto = async (chatId, imageUrl, caption) => {
  if (!imageUrl || !imageUrl.startsWith('http')) {
    return { success: false, error: 'Invalid or non-public image URL' };
  }

  return telegramRequest('sendPhoto', {
    chat_id: chatId,
    photo: imageUrl,
    caption,
  });
};

module.exports = {
  sendTelegramMessage,
  sendTelegramPhoto,
};