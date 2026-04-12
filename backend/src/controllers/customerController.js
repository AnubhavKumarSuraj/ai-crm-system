const { v4: uuidv4 } = require('uuid');

// Temporary in-memory storage
let customers = [];

// POST /customers
exports.createCustomer = (req, res) => {
    const { name, phone, email, last_visit } = req.body;

    const newCustomer = {
        id: uuidv4(),
        name,
        phone,
        email,
        last_visit
    };

    customers.push(newCustomer);

    res.json({
        status: "success",
        customer_id: newCustomer.id
    });
};

// GET /customers
exports.getCustomers = (req, res) => {
    res.json({
        status: "success",
        data: customers
    });
};