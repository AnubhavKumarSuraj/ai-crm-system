🟢 STAGE 1 — FOUNDATION
✅ Task 1: Setup Backend Project

Assignee: Animesh

[ ] Create folder: backend
[ ] Open terminal inside backend
[ ] Run: npm init -y
[ ] Verify package.json created

Next Task: Install Dependencies

✅ Task 2: Install Dependencies
[ ] Run:
    npm install express cors dotenv

Next Task: Create Basic Server

✅ Task 3: Create Basic Server
[ ] Create file: server.js

[ ] Add Express server code
[ ] Add route "/" → "Server Running"

Next Task: Run Server

✅ Task 4: Run Server
[ ] Run:
    node server.js

[ ] Open browser:
    http://localhost:5000

[ ] Verify response

Next Task: Create Folder Structure

✅ Task 5: Create Folder Structure
[ ] Create src/

[ ] Inside src create:
    controllers/
    routes/
    services/
    models/
    middlewares/
    utils/

Next Task: Move Server Logic

✅ Task 6: Move Server Logic
[ ] Create src/app.js
[ ] Move Express code there
[ ] Keep server.js as entry point

Next Task: Create First API

🟢 STAGE 2 — FIRST API (DUMMY)
✅ Task 7: Create Customer Route File

Assignee: Diptendu

[ ] Create file:
    src/routes/customers.js

Next Task: Add POST API

✅ Task 8: Add POST /customers API
[ ] Create route:
    POST /customers

[ ] Return:
{
  "status": "success",
  "customer_id": "test-id"
}

Next Task: Connect Route

✅ Task 9: Connect Route to App
[ ] Import routes in app.js

[ ] Use:
    app.use('/api/customers', routes)

Next Task: Test API

✅ Task 10: Test API in Postman
[ ] POST http://localhost:5000/api/customers
[ ] Verify response

Next Task: Setup Database

🟢 STAGE 3 — DATABASE
✅ Task 11: Setup Supabase
[ ] Create Supabase account
[ ] Create project
[ ] Copy DB URL

Next Task: Install DB Package

✅ Task 12: Install pg
[ ] Run:
    npm install pg

Next Task: Create DB Config

✅ Task 13: Create DB Config
[ ] Create file:
    config/db.js

[ ] Add connection code

Next Task: Add Environment Variables

✅ Task 14: Setup .env
[ ] Create .env file

[ ] Add:
    DB_URL=your_db_url
    PORT=5000

Next Task: Test DB Connection

✅ Task 15: Test DB Connection
[ ] Run connection code
[ ] Verify DB connected

Next Task: Real Customer APIs

🟢 STAGE 4 — CUSTOMER APIs (REAL)
✅ Task 16: Add Customer Controller
[ ] Create:
    controllers/customersController.js

[ ] Add:
    addCustomer()
    getCustomers()
    getInactiveCustomers()

Next Task: Add DB Logic

✅ Task 17: Add DB Logic
[ ] Insert customer into DB
[ ] Fetch all customers
[ ] Filter inactive customers

Next Task: Connect Routes

✅ Task 18: Connect Controller to Routes
[ ] Import controller
[ ] Connect routes to functions

Next Task: Test APIs

✅ Task 19: Test Customer APIs
[ ] POST /customers
[ ] GET /customers
[ ] GET /customers/inactive

Next Task: Campaign Module

🟢 STAGE 5 — CAMPAIGN
✅ Task 20: Create Campaign Routes
[ ] POST /campaigns
[ ] POST /campaigns/trigger

Next Task: Campaign Controller

✅ Task 21: Campaign Controller
[ ] createCampaign()
[ ] triggerCampaign()

Next Task: Campaign Logic

✅ Task 22: Campaign Logic
[ ] Save campaign in DB
[ ] Fetch target users

Next Task: Automation Integration

🟢 STAGE 6 — AUTOMATION
✅ Task 23: Connect to n8n
[ ] Send webhook request to n8n
[ ] Pass campaign_id

Next Task: Test Automation

✅ Task 24: Test Automation Flow
[ ] Trigger campaign
[ ] Verify n8n receives data

Next Task: AI Module

🟢 STAGE 7 — AI
✅ Task 25: Create AI Route
[ ] POST /ai/generate-message

Next Task: AI Logic

✅ Task 26: AI Logic
[ ] Install OpenAI SDK
[ ] Generate message

Next Task: Message System

🟢 STAGE 8 — MESSAGE SYSTEM
✅ Task 27: Message API
[ ] POST /messages/send

Next Task: Message Logic

✅ Task 28: Message Logic
[ ] Store message in DB
[ ] Simulate sending

Next Task: Logging

🟢 STAGE 9 — LOGGING
✅ Task 29: Logs API
[ ] GET /logs

Next Task: Logging Logic

✅ Task 30: Logging Logic
[ ] Store logs
[ ] Fetch logs

Next Task: DONE 🎉