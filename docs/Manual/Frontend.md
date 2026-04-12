Make a simple dashboard where a shop owner can manage customers & campaigns

User should be able to:
Add customer
See customers
Create campaign
Trigger campaign
That’s it.

🔵 PHASE 1: Setup (Foundation)

Goal:
👉 Get React app running

Tasks:

Create React app
Install Tailwind
Setup folder structure
🔵 PHASE 2: UI Foundation

Goal:
👉 Create reusable components

Components:

Navbar
Button
Card
Input fields

👉 Based on your UI rules

🔵 PHASE 3: Pages Creation

Goal:
👉 Create full UI screens

Pages:

Dashboard
Customers
Campaigns
🔵 PHASE 4: Customer Module

Goal:
👉 Customer management UI

Features:

Add customer form
Customer list (table)
🔵 PHASE 5: API Integration (Later)

Goal:
👉 Connect frontend → backend

POST customer
GET customers
🔵 PHASE 6: Campaign Module

Goal:
👉 Campaign UI

Create campaign
Trigger campaign
🔵 PHASE 7: Dashboard

Goal:
👉 Show stats

Total customers
Active/inactive
🔵 PHASE 8: Error Handling

Goal:
👉 Make UI stable

Show errors
Validate inputs
⚠️ IMPORTANT STRATEGY (CRITICAL)

👉 FIRST build UI with dummy data

❌ Do NOT wait for backend
❌ Do NOT connect APIs initially

👉 Why?

Because:

Backend is not ready yet
You will get stuck


src/
│
├── components/       # reusable UI parts
│   ├── Navbar.jsx
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Card.jsx
│   └── StatsCard.jsx
│
├── pages/            # full screens
│   ├── Dashboard.jsx
│   ├── Customers.jsx
│   ├── Campaigns.jsx
│
├── services/         # API calls (later)
│   └── api.js
│
├── hooks/            # optional (later)
│
├── utils/            # helper functions
│
├── App.js
└── index.js

🧩 2. COMPONENT ARCHITECTURE (CRITICAL)

👉 Think in building blocks

🔹 Level 1: Basic Components
Button
Input
Card
👉 Used everywhere

🔹 Level 2: Feature Components
CustomerForm
CustomerList
CampaignForm
👉 Built using basic components

🔹 Level 3: Pages
Customers Page
Dashboard Page
👉 Combine multiple components


🧠 HIERARCHY
Page
 ├── Component
 │     ├── Button
 │     ├── Input
 │     └── Card


 🎯 4. EXACT SCREEN BREAKDOWN

🏠 DASHBOARD PAGE
Show:
Total customers
Active customers
Inactive customers
👉 Use StatsCard

👥 CUSTOMERS PAGE
Components:
1. CustomerForm
Fields:
Name
Phone
Email
Last visit

2. CustomerList
Table:
| Name | Phone | Email |

📢 CAMPAIGNS PAGE
Components:
CampaignForm
Target selection (All / Inactive)
Send button

❌ Mistake : Direct API calls everywhere
👉 Messy code

✅ Solution:
All APIs inside services/