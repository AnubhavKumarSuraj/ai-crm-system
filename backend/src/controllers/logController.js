const logService = require('../services/logService');

exports.getLogs = async (req, res) => {
  try {
    const data = await logService.getLogs();

    return res.status(200).json({
      status: 'success',
      data
    });
  } catch (err) {
    console.error('getLogs failed:', err.message);
    return res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
};

exports.createLog = async (req, res) => {
  const { event_type, details } = req.body;

  if (!event_type || !details) {
    return res.status(400).json({
      status: 'error',
      error: 'event_type and details are required'
    });
  }

  try {
    const result = await logService.createLog({ event_type, details });

    return res.status(201).json({
      status: 'success',
      log_id: result.id
    });
  } catch (err) {
    console.error('createLog failed:', err.message);
    return res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
};
