const express = require('express');

const {
  createCampaign,
  getCampaigns,
  triggerCampaign,
} = require('../controllers/campaignController');

const router = express.Router();

router.get('/', getCampaigns);
router.post('/', createCampaign);
router.post('/trigger', triggerCampaign);

module.exports = router;
