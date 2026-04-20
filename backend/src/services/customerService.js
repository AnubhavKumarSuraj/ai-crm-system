const pool = require('../../config/db');

const addCustomer = async (data) => {
  const { name, phone, email, last_visit } = data;

  const result = await pool.query(
    `INSERT INTO customers (name, phone, email, last_visit)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [name, phone, email, last_visit]
  );

  return result.rows[0];
};

const getCustomers = async () => {
  const result = await pool.query('SELECT * FROM customers');
  return result.rows;
};

const getInactiveCustomers = async (days) => {
  const result = await pool.query(
    `SELECT *
     FROM customers
     WHERE last_visit IS NOT NULL
       AND last_visit < CURRENT_DATE - $1::int
     ORDER BY last_visit ASC, created_at DESC`,
    [days]
  );

  return result.rows;
};

const deleteCustomer = async (id) => {
  const result = await pool.query(
    `DELETE FROM customers
     WHERE id = $1
     RETURNING id`,
    [id]
  );

  return result.rows[0] || null;
};

module.exports = {
  addCustomer,
  getCustomers,
  getInactiveCustomers,
  deleteCustomer,
};
