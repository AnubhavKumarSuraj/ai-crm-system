const pool = require('../../config/db');
const logService = require('./logService');

const REMINDER_INACTIVE_DAYS = 30;
const REMINDER_CHANNEL = 'whatsapp';
const REMINDER_STATUS = 'pending';

const remindInactiveCustomers = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const messageInsert = await client.query(
      `INSERT INTO messages (customer_id, campaign_id, message, channel, status)
       SELECT
         id,
         NULL,
         CONCAT('Hi ', name, ', we miss you. It has been more than 30 days since your last visit. Reply to book your next visit.'),
         $1,
         $2
       FROM customers
       WHERE last_visit IS NOT NULL
         AND last_visit < CURRENT_DATE - $3::int
       RETURNING id`,
      [REMINDER_CHANNEL, REMINDER_STATUS, REMINDER_INACTIVE_DAYS]
    );

    await logService.createLogWithClient(client, {
      event_type: 'Inactive reminders processed',
      details: `Processed ${messageInsert.rowCount} inactive reminders for customers inactive for ${REMINDER_INACTIVE_DAYS}+ days.`,
    });

    await client.query('COMMIT');

    return {
      processed: messageInsert.rowCount,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  remindInactiveCustomers,
};
