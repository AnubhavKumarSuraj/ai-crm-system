🟢 PHASE 3 — UI FOUNDATION
✅ Task 6: Create Navbar
[ ] Create Navbar component
[ ] Add links:
    Dashboard
    Customers
    Campaigns

⚠️ Follow UI Rules strictly

Next Task: Create Basic Pages

✅ Task 7: Create Basic Pages
[ ] Create Dashboard page
[ ] Create Customers page
[ ] Create Campaigns page
[ ] Show simple text in each

Next Task: Create Customer Form

🟢 PHASE 4 — CUSTOMER MODULE
✅ Task 8: Create Customer Form
[ ] Create CustomerForm component
[ ] Fields:
    Name
    Phone
    Email
    Last Visit
[ ] Add submit button

⚠️ Follow Form UI rules

Next Task: Create Customer List

✅ Task 9: Create Customer List
[ ] Create CustomerList component
[ ] Create table layout
[ ] Columns:
    Name
    Phone
    Email
    Last Visit

Next Task: Add Dummy Data

✅ Task 10: Add Dummy Data
[ ] Add hardcoded customer data
[ ] Display in CustomerList

Next Task: Create API Service

🟢 PHASE 5 — API INTEGRATION
✅ Task 11: Create API Service
[ ] Create services/api.js
[ ] Add base URL:
    http://localhost:5000/api

Next Task: Add Customer API

✅ Task 12: Add Customer API
[ ] Create function addCustomer(data)
[ ] Use axios POST /customers

Next Task: Connect Form to API

✅ Task 13: Connect Form to API
[ ] On submit → call addCustomer()
[ ] Show success message

Next Task: Fetch Customers

✅ Task 14: Fetch Customers
[ ] Create getCustomers()
[ ] Use GET /customers

Next Task: Replace Dummy Data

✅ Task 15: Replace Dummy Data
[ ] Remove hardcoded data
[ ] Use API response

Next Task: Campaign Module

🟢 PHASE 6 — CAMPAIGN MODULE
✅ Task 16: Create Campaign Form
[ ] Fields:
    Campaign Name
    Message
    Target (all/inactive)

Next Task: Connect Campaign API

✅ Task 17: Connect Campaign API
[ ] POST /campaigns
[ ] POST /campaigns/trigger

Next Task: Dashboard

🟢 PHASE 7 — DASHBOARD
✅ Task 18: Dashboard UI
[ ] Show:
    Total customers
    Active customers
    Inactive customers

Next Task: Connect Dashboard APIs

✅ Task 19: Connect Dashboard APIs
[ ] Use GET /customers
[ ] Use GET /customers/inactive

Next Task: Error Handling

🟢 PHASE 8 — FINAL
✅ Task 20: Error Handling
[ ] Show API error messages
[ ] Validate form inputs

Next Task: DONE 🎉