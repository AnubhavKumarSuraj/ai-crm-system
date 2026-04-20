const express = require('express');

const {
  remindInactiveCustomers,
} = require('../controllers/automationController');

const router = express.Router();

router.post('/remind-inactive', remindInactiveCustomers);

module.exports = router;
