const express = require('express');
const router = express.Router();

const {
  createCustomer,
  getCustomers,
  getInactiveCustomers,
  deleteCustomer
} = require('../controllers/customerController');

router.get('/inactive', getInactiveCustomers);
router.get('/', getCustomers);
router.post('/', createCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
