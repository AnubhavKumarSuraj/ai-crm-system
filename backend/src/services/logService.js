const pool = require('../../config/db');

const insertLog = async (executor, { event_type, details }) => {
  return executor.query(
    `INSERT INTO logs (event_type, details)
     VALUES ($1, $2)
     RETURNING id`,
    [event_type, details]
  );
};

const getLogs = async () => {
  const result = await pool.query(
    `SELECT *
     FROM logs
     ORDER BY created_at DESC`
  );

  return result.rows;
};

const createLog = async ({ event_type, details }) => {
  const result = await insertLog(pool, { event_type, details });

  return result.rows[0];
};

const createLogWithClient = async (client, { event_type, details }) => {
  const result = await insertLog(client, { event_type, details });
  return result.rows[0];
};

module.exports = {
  getLogs,
  createLog,
  createLogWithClient,
};
