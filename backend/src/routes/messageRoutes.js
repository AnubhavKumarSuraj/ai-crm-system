const express = require('express');
const router = express.Router();

const {
  getMessages,
  getMessageSummary,
} = require('../controllers/messageController');

router.get('/summary', getMessageSummary);
router.get('/', getMessages);

module.exports = router;
