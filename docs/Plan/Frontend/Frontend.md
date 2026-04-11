🟢 PHASE 1: PROJECT SETUP
🎯 Goal: Frontend should run in browser

🧩 TASK 1: Setup React App
[ ] Install Node.js (if not already)
[ ] Run: npx create-react-app frontend
[ ] Open project in VS Code
[ ] Run: npm start
[ ] Verify app runs on localhost:3000

🧩 TASK 2: Clean Default Setup
[ ] Remove default React files (logo, etc.)
[ ] Clean App.js
[ ] Keep simple "App Running" UI

🧩 TASK 3: Install Dependencies
[ ] Install Tailwind CSS
[ ] Install Axios (npm install axios)


🟢 PHASE 2: PROJECT STRUCTURE

🧩 TASK 4: Create Folder Structure
frontend/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── services/
 │   ├── hooks/
 │   ├── utils/

🧩 TASK 5: Setup Routing (Optional Basic)
[ ] Install react-router-dom
[ ] Setup basic routes:
    [ ] /dashboard
    [ ] /customers
    [ ] /campaigns


🟢 PHASE 3: UI FOUNDATION

🧩 TASK 6: Create Navbar
[ ] Create Navbar component
[ ] Add links:
    [ ] Dashboard
    [ ] Customers
    [ ] Campaigns

🧩 TASK 7: Create Basic Pages
[ ] Create Dashboard page
[ ] Create Customers page
[ ] Create Campaign page

👉 For now:
✔ Just simple text (no design stress)

🟢 PHASE 4: CUSTOMER MODULE (CORE)

👉 Aligns with backend /customers API

🧩 TASK 8: Create Customer Form
[ ] Create CustomerForm component
[ ] Add fields:
    [ ] Name
    [ ] Phone
    [ ] Email
    [ ] Last Visit
[ ] Add Submit button

🧩 TASK 9: Create Customer List
[ ] Create CustomerList component
[ ] Display customers in table
[ ] Columns:
    [ ] Name
    [ ] Phone
    [ ] Email
    [ ] Last Visit

🧩 TASK 10: Use Dummy Data
[ ] Add hardcoded customer data
[ ] Display in UI

👉 Important:
✔ Don’t connect API yet

🟢 PHASE 5: API INTEGRATION (VERY IMPORTANT 🔥)

Now connect frontend to backend APIs

🧩 TASK 11: Create API Service
[ ] Create services/api.js
[ ] Setup base URL:
    http://localhost:5000/api

🧩 TASK 12: Add Customer API Call
[ ] Create function:
    addCustomer(data)
[ ] Use axios POST /customers

🧩 TASK 13: Connect Form to API
[ ] On submit → call addCustomer()
[ ] Show success message

🧩 TASK 14: Fetch Customers
[ ] Create function:
    getCustomers()
[ ] Use GET /customers

🧩 TASK 15: Show Real Data
[ ] Replace dummy data
[ ] Show API data in list


🟢 PHASE 6: CAMPAIGN MODULE
🧩 TASK 16: Create Campaign Form
[ ] Campaign name
[ ] Message
[ ] Target (all/inactive)

🧩 TASK 17: Connect Campaign API
[ ] POST /campaigns
[ ] POST /campaigns/trigger


🟢 PHASE 7: DASHBOARD
🧩 TASK 18: Dashboard UI
[ ] Show:
    [ ] Total customers
    [ ] Active customers
    [ ] Inactive customers

🧩 TASK 19: Connect APIs
[ ] Use GET /customers
[ ] Use GET /customers/inactive


🟢 PHASE 8: ERROR HANDLING
🧩 TASK 20: Basic Error Handling
[ ] Show error messages on API failure
[ ] Validate inputs before submit


🧠 HOW FRONTEND WORKS WITH BACKEND
Example Flow:
User → Form → Frontend
       ↓
   API call (/customers)
       ↓
   Backend → DB
       ↓
   Response → Frontend
       ↓
   UI updates
🔥 HOW TO ADD IN NOTION
Example:

Task Name: Create Customer Form
Department: Frontend

Description:
[ ] Create form UI
[ ] Add input fields
[ ] Add submit button
[ ] Validate input