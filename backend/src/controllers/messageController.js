const messageService = require('../services/messageService');

const getMessages = async (req, res) => {
  try {
    const data = await messageService.getMessages();

    res.json({
      status: 'success',
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
};

module.exports = { getMessages };