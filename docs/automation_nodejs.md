# 🚀 AI CRM SYSTEM — AUTOMATION MODULE HANDOFF (FOR TEAMMATE)

## 🎯 TASK OBJECTIVE

Build the **Automation Module** inside the existing Node.js backend of our AI CRM System.

Goal: make the CRM automatically run smart actions like:

- Recover inactive customers
- Auto-trigger reminder campaigns
- Create logs
- Future daily schedulers

This must be built **inside backend project**, not separate app.

---

# 📌 EXISTING PROJECT STACK

## Backend

- Node.js
- Express.js

## Database

- Supabase PostgreSQL

## Existing Working Modules

- Customers API
- Campaigns API
- Logs API
- Messages Table
- Trigger Campaign API
- Dashboard Frontend

---

# 📁 CURRENT PROJECT STRUCTURE

```text
ai-crm-system/
 ├── backend/
 │   ├── config/
 │   ├── db/
 │   ├── scripts/
 │   ├── src/
 │   │   ├── controllers/
 │   │   ├── routes/
 │   │   ├── services/
 │   │   └── app.js
 │   └── server.js
 │
 └── frontend/

 🎯 WHERE TO BUILD AUTOMATION

Inside:

backend/src/

Create new folder:

backend/src/automation/
📁 REQUIRED AUTOMATION FOLDER STRUCTURE
backend/src/automation/
 ├── scheduler.js
 ├── jobs/
 │   ├── inactiveRecoveryJob.js
 │   └── dailySummaryJob.js
 │
 ├── services/
 │   └── automationService.js
 │
 └── utils/
     └── cronLogger.js
🎯 MAIN FEATURE TO BUILD FIRST
Recover Inactive Customers Automatically
Logic:

Every day at 9 AM:

Find customers inactive for 30+ days
Trigger reminder campaign
Insert messages rows
Save logs
📌 EXISTING USEFUL APIs / SERVICES

Already in backend:

Inactive customers route
GET /api/customers/inactive?days=30
Trigger campaign route
POST /api/campaigns/trigger

Body:

{
  "campaign_id": "UUID_HERE",
  "target": "inactive"
}
Logs route
GET /api/logs
🎯 BEST IMPLEMENTATION METHOD

Use:

npm install node-cron
📄 FILE RESPONSIBILITIES
scheduler.js

Main scheduler starter.

Should run all cron jobs.

Example:

require('./jobs/inactiveRecoveryJob');
require('./jobs/dailySummaryJob');
jobs/inactiveRecoveryJob.js

Use node-cron

Schedule:

0 9 * * *

(Every day 9 AM)

Then call automation service.

services/automationService.js

Functions:

runInactiveRecovery()
runDailySummary()
utils/cronLogger.js

Simple logger:

console.log(`[CRON] Job Started`);
🎯 EXAMPLE FLOW

At 9 AM:

[CRON] Checking inactive customers...
Found 12 inactive customers
Triggered reminder campaign
12 message rows inserted
Log created
📌 INTEGRATION REQUIRED

Inside:

backend/server.js

Start scheduler when backend starts.

Example:

require('./src/automation/scheduler');
🚫 IMPORTANT RULES
Do NOT break existing APIs

Do NOT modify existing routes unless necessary.

Keep automation separate and modular.
Use existing services if possible.
⭐ BONUS FEATURES (Optional)
Add more jobs later:
Daily Summary

Count:

total customers
active customers
campaigns sent today
Festival Auto Campaign

Before Diwali auto-create festive campaign.

🎯 WHAT CHATGPT SHOULD HELP WITH

If giving this to ChatGPT, ask:

Help me build backend/src/automation module in Node.js using node-cron inside existing Express backend. Use modular files and integrate with existing campaign/customer/log services.
📌 EXPECTED FINAL RESULT

When backend starts:

npm start

Scheduler also starts automatically.

Every day:

inactive customers checked
reminder triggered
logs saved
🏆 WHY THIS MATTERS

This converts CRM into:

AI + Automation SaaS

Instead of normal CRUD software.

📅 PRIORITY

Build ONLY first automation cleanly.

Do not overbuild unnecessary features.