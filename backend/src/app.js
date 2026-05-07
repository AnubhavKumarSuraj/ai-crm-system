const path = require('path');
const express = require('express');
const cors = require('cors');

const customerRoutes = require('./routes/customerRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const logRoutes = require('./routes/logRoutes');
const automationRoutes = require('./routes/automationRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/customers', customerRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/messages', messageRoutes);

// Serve React frontend build
const FRONTEND_BUILD = path.join(__dirname, '../../frontend/shopcrm/build');
app.use(express.static(FRONTEND_BUILD));

// SPA fallback — send index.html for all non-API routes
app.use((_req, res) => {
  res.sendFile(path.join(FRONTEND_BUILD, 'index.html'));
});

module.exports = app;