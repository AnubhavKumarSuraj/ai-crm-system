const customerService = require('../services/customerService');

const DEFAULT_INACTIVE_DAYS = 30;

exports.createCustomer = async (req, res) => {
  try {
    const result = await customerService.addCustomer(req.body);

    return res.status(201).json({
      status: 'success',
      customer_id: result.id
    });
  } catch (err) {
    console.error('createCustomer failed:', err.message);
    return res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const data = await customerService.getCustomers();

    return res.status(200).json({
      status: 'success',
      data
    });
  } catch (err) {
    console.error('getCustomers failed:', err.message);
    return res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
};

exports.getInactiveCustomers = async (req, res) => {
  const days = Number.parseInt(req.query.days ?? DEFAULT_INACTIVE_DAYS, 10);

  if (Number.isNaN(days) || days < 0) {
    return res.status(400).json({
      status: 'error',
      error: 'days must be a non-negative integer'
    });
  }

  try {
    const data = await customerService.getInactiveCustomers(days);

    return res.status(200).json({
      status: 'success',
      data
    });
  } catch (err) {
    console.error('getInactiveCustomers failed:', err.message);
    return res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await customerService.deleteCustomer(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({
        status: 'error',
        error: 'Customer not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      customer_id: deletedCustomer.id
    });
  } catch (err) {
    console.error('deleteCustomer failed:', err.message);
    return res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
};
