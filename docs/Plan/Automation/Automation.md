🟣 PHASE 1: SETUP n8n (AUTOMATION ENGINE)
🧩 TASK 1: Install n8n
[ ] Install Node.js (if not already)
[ ] Run: npm install -g n8n
[ ] Start n8n → n8n start
[ ] Open: http://localhost:5678


🧩 TASK 2: Understand Interface
[ ] Create new workflow
[ ] Explore nodes:
    [ ] Cron
    [ ] HTTP Request
    [ ] Function


🟣 PHASE 2: BACKEND ↔ n8n CONNECTION

🧩 TASK 3: Create Webhook in n8n
[ ] Add Webhook node
[ ] Set path: /trigger-campaign
[ ] Save webhook URL

🧩 TASK 4: Connect Backend to n8n

From backend doc

[ ] In backend:
    call n8n webhook
[ ] POST request:
    /webhook/trigger-campaign
[ ] Send:
    campaign_id
    target

👉 Output:
✔ Backend can trigger automation


🟣 PHASE 3: INACTIVE CUSTOMER WORKFLOW

🧩 TASK 5: Create Cron Workflow
[ ] Add Cron node
[ ] Set schedule: Daily (e.g., 10 AM)

🧩 TASK 6: Fetch Inactive Customers
[ ] Add HTTP Request node
[ ] Call API:
    GET /customers/inactive?days=30

👉 Uses your API contract

🧩 TASK 7: Process Customers
[ ] Add Function node
[ ] Loop through each customer


🟣 PHASE 4: AI MESSAGE GENERATION

🧩 TASK 8: Setup OpenAI
[ ] Create OpenAI account
[ ] Get API key
[ ] Add OpenAI node in n8n

🧩 TASK 9: Generate Message
[ ] Input:
    customer_name
    business_type
[ ] Prompt:
    "Generate friendly reminder message"

👉 Output:
✔ Personalized message


🟣 PHASE 5: MESSAGE DELIVERY

🧩 TASK 10: WhatsApp API Setup
[ ] Choose provider:
    [ ] Meta API OR Twilio
[ ] Get API credentials

🧩 TASK 11: Send Message
[ ] Add HTTP Request node
[ ] Send WhatsApp message
[ ] Use:
    phone number
    generated message

🧩 TASK 12: Email Fallback (Optional)
[ ] Setup SMTP or SendGrid
[ ] Send email if WhatsApp fails


🟣 PHASE 6: LOGGING SYSTEM

🧩 TASK 13: Store Logs
[ ] Call backend API:
    POST /messages/send
[ ] Store:
    customer_id
    message
    status

🧩 TASK 14: Error Handling
[ ] Retry failed messages
[ ] Continue workflow even if one fails


🟣 PHASE 7: CAMPAIGN AUTOMATION

🧩 TASK 15: Webhook Workflow
[ ] Receive campaign data
[ ] Fetch target customers
[ ] Loop through customers
[ ] Send messages

🧩 TASK 16: Trigger from Frontend
[ ] User clicks "Send Campaign"
[ ] Frontend → Backend API
[ ] Backend → n8n webhook


🟣 PHASE 8: FULL INTEGRATION

🧩 TASK 17: Connect Everything
[ ] Frontend → Backend APIs
[ ] Backend → Database
[ ] Backend → n8n
[ ] n8n → AI
[ ] n8n → WhatsApp

🧩 TASK 18: End-to-End Testing
[ ] Add customer
[ ] Wait / simulate inactivity
[ ] Trigger automation
[ ] Message sent

🔥 FINAL SYSTEM (COMPLETE FLOW)
User → Frontend → Backend API → Database
                             ↓
                         n8n Workflow
                             ↓
                        OpenAI
                             ↓
                      WhatsApp API
                             ↓
                        Customer