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

app.get('/', (req, res) => {
  res.send('API Running');
});

app.use('/api/customers', customerRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/messages', messageRoutes);

module.exports = app;