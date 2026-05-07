const express = require('express');
const multer = require('multer');

const {
  createCampaign,
  getCampaigns,
  triggerCampaign,
  sendAiCampaign,
} = require('../controllers/campaignController');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

router.get('/', getCampaigns);
router.post('/', createCampaign);
router.post('/trigger', triggerCampaign);
router.post('/send-ai', upload.single('image'), sendAiCampaign);

module.exports = router;
