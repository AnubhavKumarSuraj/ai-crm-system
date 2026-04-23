const app = require('./src/app');
const { startScheduler } = require('./src/automation/scheduler');

// Start automation scheduler
startScheduler();

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});