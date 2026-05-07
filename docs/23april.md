# 🚀 AI CRM SYSTEM — MASTER PROJECT CONTEXT (SAVE FILE)

Last Updated: April 2026

---

# 📌 PROJECT NAME

AI CRM System / ShopCRM

A customer retention + campaign automation software for small businesses like:

- Gyms
- Salons
- Clinics
- Local shops
- Coaching centers
- Retail stores

Purpose:

Help businesses retain customers, run campaigns, automate follow-ups, and use AI to generate promotions.

---

# 🎯 CORE VISION

Traditional CRM tools are boring.

We are building:

## AI Powered CRM + Retention Engine

Where owner can:

- manage customers
- run campaigns
- trigger messages
- recover inactive customers automatically
- generate AI marketing messages
- generate AI images/promotions
- send campaigns instantly

---

# 🧱 CURRENT TECH STACK

## Frontend

- React.js
- Tailwind CSS
- Localhost:3000

## Backend

- Node.js
- Express.js
- REST APIs
- Localhost:5000

## Database

- Supabase PostgreSQL

## Automation

- node-cron scheduler

## Future AI

- OpenAI / Gemini APIs
- Image generation APIs

---

# 🏗️ CURRENT ARCHITECTURE

```text
Frontend React Dashboard
        ↓
REST API Calls
        ↓
Node.js Express Backend
        ↓
Services / Controllers / Routes
        ↓
Supabase PostgreSQL Database
        ↓
Automation Scheduler (cron)
📁 CURRENT PROJECT STRUCTURE
frontend/shopcrm/
backend/

backend/src/
  app.js
  controllers/
  routes/
  services/
  automation/
✅ FEATURES COMPLETED
1️⃣ CUSTOMER MANAGEMENT

Working:

Add customer
View customers
Delete customer
Fetch inactive customers

Database table:

customers
2️⃣ CAMPAIGN MANAGEMENT

Working:

Create campaign
View campaigns
Trigger campaign manually
Trigger to all customers
Trigger to inactive customers

Database table:

campaigns
3️⃣ MESSAGES SYSTEM

Working:

Triggered campaigns insert rows into messages table
Messages page built in frontend
Can view sent messages

Database table:

messages
4️⃣ LOGGING SYSTEM

Working:

All major events stored:

Campaign triggered
Automation run
Recovery jobs
Errors

Database table:

logs
5️⃣ AUTOMATION SYSTEM ✅ BIG WIN

Working:

Inactive Customer Recovery Engine

Every scheduled time:

checks customers inactive for 30+ days
selects campaign
triggers campaign
inserts messages
logs result

Uses:

node-cron

Current tested successfully.

🔥 AUTOMATION FILE STRUCTURE
backend/src/automation/

config.js
scheduler.js
crmApi.js

jobs/
  inactiveRecoveryJob.js
  dailySummaryJob.js

services/
  automationService.js

utils/
  cronLogger.js
🧪 SUCCESSFULLY TESTED

Cron every minute:

AUTOMATION_INACTIVE_RECOVERY_CRON=* * * * *

Result:

inactive customer found
messages inserted
logs created

Then changed back to:

0 9 * * *

(daily 9 AM)

📌 IMPORTANT DATABASE TABLES
customers

Fields:

id
name
phone
email
last_visit
campaigns

Fields:

id
name
message
type
created_at
messages

Fields:

id
customer_id
campaign_id
message
channel
logs

Fields:

id
event_type
details
created_at
⚠️ KNOWN CURRENT STATUS

Backend and frontend working.

Automation integrated successfully.

GitHub updated.

🎯 MOST IMPORTANT NEXT FEATURE
AI PRODUCT CAMPAIGN GENERATOR

Owner uploads product photo.

System automatically:

generates marketing image
writes sales message
creates campaign
can send to customers

Example:

Upload protein powder image →

Output:

"🔥 New Whey Protein Launch! 10% OFF Today Only"

attractive promo image
ready WhatsApp campaign

This is highest priority wow feature.

🚀 NEXT DEVELOPMENT ROADMAP
Phase 1 (Immediate)
AI Campaign Generator

Build page:

/ai-campaign

Inputs:

upload image
product name
offer
audience

Outputs:

AI message
AI image
save campaign
Phase 2
Auto Send Generated Campaign

After generation:

select customers
send automatically
Phase 3
Dashboard Metrics

Show:

total customers
inactive customers
messages sent today
active campaigns
Phase 4
Real Integrations
WhatsApp API
Email API
SMS API
💎 PROJECT STRENGTH NOW

This is no longer CRUD project.

It includes:

frontend
backend
database
APIs
automation
scheduling
customer retention logic
scalable SaaS direction
🎤 PITCH LINE

We built an AI CRM for local businesses that automatically re-engages inactive customers and can launch AI-generated campaigns from a single product image.

👥 TEAM STATUS

You = Product lead / integration / debugging / direction

Teammate = Automation contribution

🔐 IMPORTANT ENV VARIABLES
PORT=5000
DB_URL=your_supabase_url
N8N_WEBHOOK_URL=http://localhost:5678/webhook/trigger-campaign

AUTOMATION_INACTIVE_RECOVERY_CRON=0 9 * * *
AUTOMATION_INACTIVE_CAMPAIGN_ID=campaign_uuid
📌 NEXT CHATGPT INSTRUCTION

Continue from this project state.

We have fully working CRM + campaign automation.

Next goal:
Build AI Product Campaign Generator feature fast.