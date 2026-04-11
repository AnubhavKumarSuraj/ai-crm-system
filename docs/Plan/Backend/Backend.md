🔵 PHASE 1: ENVIRONMENT + SERVER SETUP
🎯 Goal:

Server should run locally

🧩 TASK 1: Install Environment
Subtasks:
[ ] Install Node.js
[ ] Check version (node -v)
[ ] Install npm (comes with Node)


🧩 TASK 2: Create Backend Project
[ ] Create folder "backend"
[ ] Open terminal in folder
[ ] Run: npm init -y
[ ] Verify package.json created


🧩 TASK 3: Install Dependencies
[ ] Install express (npm install express)
[ ] Install nodemon (npm install -D nodemon)


🧩 TASK 4: Create Basic Server
[ ] Create file: server.js
[ ] Write basic Express server
[ ] Add route "/" → return "Server running"


🧩 TASK 5: Run Server
[ ] Run: node server.js
[ ] Open browser → localhost:5000
[ ] Confirm output


🔵 PHASE 2: PROJECT STRUCTURE (VERY IMPORTANT)

From your backend design

🧩 TASK 6: Create Folder Structure
[ ] Create src/
[ ] Inside src create:
    [ ] controllers/
    [ ] routes/
    [ ] services/
    [ ] models/
    [ ] middlewares/
    [ ] utils/


🧩 TASK 7: Move Server Logic
[ ] Create src/app.js
[ ] Move Express code there
[ ] Keep server.js as entry point


🔵 PHASE 3: DATABASE CONNECTION

From DB doc

🧩 TASK 8: Setup Supabase
[ ] Create Supabase account
[ ] Create new project
[ ] Copy DB connection URL

🧩 TASK 9: Setup DB Config
[ ] Create config/db.js
[ ] Install pg (npm install pg)
[ ] Write DB connection code
[ ] Test connection

🧩 TASK 10: Environment Variables
[ ] Create .env file
[ ] Add DB_URL
[ ] Add PORT
[ ] Use dotenv package


🔵 PHASE 4: CUSTOMERS API (CORE)

From API contract

🧩 TASK 11: Create Customers Route
[ ] Create routes/customers.js
[ ] Define routes:
    [ ] POST /customers
    [ ] GET /customers
    [ ] GET /customers/inactive

🧩 TASK 12: Create Controller
[ ] Create controllers/customersController.js
[ ] Add functions:
    [ ] addCustomer()
    [ ] getCustomers()
    [ ] getInactiveCustomers()

🧩 TASK 13: Add Business Logic
[ ] Validate input (name, phone)
[ ] Insert into DB
[ ] Fetch data from DB
[ ] Filter inactive customers (days logic)

🧩 TASK 14: Connect Routes to App
[ ] Import routes in app.js
[ ] Use app.use('/api/customers', routes)

🧩 TASK 15: Test APIs
[ ] Use Postman
[ ] Test POST /customers
[ ] Test GET /customers
[ ] Test inactive customers API


🔵 PHASE 5: CAMPAIGN APIs

🧩 TASK 16: Create Campaign Routes
[ ] POST /campaigns
[ ] POST /campaigns/trigger

🧩 TASK 17: Campaign Controller
[ ] createCampaign()
[ ] triggerCampaign()

🧩 TASK 18: Logic
[ ] Save campaign in DB
[ ] Fetch target users
[ ] Call automation webhook (later)


🔵 PHASE 6: AI MESSAGE API

🧩 TASK 19: Create AI Route
[ ] POST /ai/generate-message

🧩 TASK 20: AI Logic
[ ] Install OpenAI SDK
[ ] Send prompt
[ ] Return generated message


🔵 PHASE 7: MESSAGE SYSTEM

🧩 TASK 21: Message API
[ ] POST /messages/send

🧩 TASK 22: Logic
[ ] Accept message
[ ] Store in DB
[ ] (Later) send via WhatsApp


🔵 PHASE 8: LOGGING SYSTEM

🧩 TASK 23: Logs API
[ ] GET /logs

🧩 TASK 24: Logging Logic
[ ] Store events
[ ] Fetch logs
