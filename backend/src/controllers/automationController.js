const automationService = require('../services/automationService');

exports.remindInactiveCustomers = async (req, res) => {
  try {
    const result = await automationService.remindInactiveCustomers();

    return res.status(200).json(result);
  } catch (err) {
    console.error('remindInactiveCustomers failed:', err.message);

    return res.status(500).json({
      status: 'error',
      error: err.message,
    });
  }
};
