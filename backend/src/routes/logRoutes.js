const express = require('express');

const {
  createLog,
  getLogs,
} = require('../controllers/logController');

const router = express.Router();

router.get('/', getLogs);
router.post('/', createLog);

module.exports = router;
