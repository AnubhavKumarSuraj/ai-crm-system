const pool = require('../../config/db');
const logService = require('./logService');
const { generateRecoveryMessage } = require('./geminiService');
const {
  formatWhatsAppNumber,
  getTwilioConfigIssues,
  sendWhatsAppMessage,
} = require('./whatsappService');

const REMINDER_INACTIVE_DAYS = 30;
const REMINDER_CHANNEL = 'whatsapp';
const REMINDER_PROVIDER = 'twilio';

const buildResultMessage = ({ sent, failed, skipped, inactiveCount }) => {
  if (inactiveCount === 0) {
    return 'No inactive customers found';
  }

  if (sent > 0 && failed === 0 && skipped === 0) {
    return `${sent} message${sent !== 1 ? 's' : ''} sent successfully`;
  }

  const parts = [];

  if (sent > 0) {
    parts.push(`${sent} sent`);
  }

  if (failed > 0) {
    parts.push(`${failed} failed`);
  }

  if (skipped > 0) {
    parts.push(`${skipped} skipped`);
  }

  return parts.join(', ');
};

const remindInactiveCustomers = async () => {
  try {
    console.log('[Recovery] Entering inactive customer recovery flow');

    const configIssues = getTwilioConfigIssues();

    if (configIssues.length > 0) {
      console.error('[Recovery] Twilio runtime configuration issues detected', {
        issues: configIssues,
      });
    }

    const customersResult = await pool.query(
      `SELECT id, name
         , phone
       FROM customers
       WHERE last_visit IS NOT NULL
         AND last_visit < CURRENT_DATE - $1::int`,
      [REMINDER_INACTIVE_DAYS]
    );

    const inactiveCount = customersResult.rowCount;
    let sent = 0;
    let failed = 0;
    let skipped = 0;

    console.log('[Recovery] Inactive customers found', {
      inactiveCount,
    });

    if (inactiveCount === 0) {
      await logService.createLog({
        event_type: 'AI Inactive reminders processed',
        details: 'No inactive customers found.',
      });

      return {
        success: true,
        processed: 0,
        sent,
        failed,
        skipped,
        message: buildResultMessage({ sent, failed, skipped, inactiveCount }),
      };
    }

    for (const customer of customersResult.rows) {
      console.log('[Recovery] Customer found', {
        customerId: customer.id,
        name: customer.name,
        hasPhone: Boolean(customer.phone),
      });

      const to = formatWhatsAppNumber(customer.phone);

      if (!to) {
        skipped++;

        console.warn('[Recovery] Skipping customer because phone is missing', {
          customerId: customer.id,
          name: customer.name,
        });

        await logService.createLog({
          event_type: 'skipped_phone_missing',
          details: `Skipped inactive recovery for ${customer.name || customer.id} because phone is missing.`,
        });

        continue;
      }

      let aiMessage = '';

      try {
        aiMessage = await generateRecoveryMessage(customer.name);
      } catch (error) {
        console.error('Gemini generation failed:', error.message);

        aiMessage = `Hi ${customer.name}, we miss you! Visit us again soon for special offers.`;
      }

      console.log('[Recovery] Before Twilio call', {
        customerId: customer.id,
        to,
        messageLength: aiMessage.length,
      });

      const sendResult = await sendWhatsAppMessage(to, aiMessage);

      if (sendResult.success) {
        console.log('[Recovery] After Twilio success', {
          customerId: customer.id,
          sid: sendResult.sid,
          providerStatus: sendResult.status,
        });
      } else {
        console.error('[Recovery] Twilio send failed', {
          customerId: customer.id,
          error: sendResult.error,
        });
      }

      const status = sendResult.success ? 'sent' : 'failed';
      const providerMessageId = sendResult.success ? sendResult.sid : null;
      const errorMessage = sendResult.success ? null : sendResult.error;

      await pool.query(
        `INSERT INTO messages
        (customer_id, campaign_id, message, channel, status, source, source_label, provider, provider_message_id, error_message)
        VALUES ($1, NULL, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          customer.id,
          aiMessage,
          REMINDER_CHANNEL,
          status,
          'inactive_recovery',
          'Recovery',
          REMINDER_PROVIDER,
          providerMessageId,
          errorMessage,
        ]
      );

      if (sendResult.success) {
        sent++;
      } else {
        failed++;
      }
    }

    const processed = sent + failed;
    const message = buildResultMessage({ sent, failed, skipped, inactiveCount });

    await logService.createLog({
      event_type: 'AI Inactive reminders processed',
      details: `Inactive recovery WhatsApp run completed. ${sent} sent, ${failed} failed, ${skipped} skipped.`,
    });

    return {
      success: true,
      processed,
      sent,
      failed,
      skipped,
      message,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  remindInactiveCustomers,
};
