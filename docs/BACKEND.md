# ⚙️ BACKEND DESIGN DOCUMENT

---

# 📘 Overview

This document defines the backend architecture, structure, and implementation plan for the **AI Customer Retention System**.

The backend is responsible for:

* Handling API requests
* Managing business logic
* Interacting with the database
* Triggering automation workflows

---

# 🎯 Backend Goals

* Clean and modular code structure
* API-first development
* Easy integration with frontend and automation (n8n)
* Scalable design

---

# 🧱 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (via Supabase)
* **API Format:** REST (JSON)

---

# 📂 Folder Structure

```id="n4y2g1"
backend/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── middlewares/
│   ├── utils/
│   └── app.js
│
├── config/
│   └── db.js
│
├── .env
├── package.json
```

---

# 🔗 API Layer

Backend exposes REST APIs defined in `API_CONTRACT.md`.

---

## 📌 Core Endpoints

### Customers

* POST `/customers`
* GET `/customers`
* GET `/customers/inactive`

### Campaigns

* POST `/campaigns`
* POST `/campaigns/trigger`

### AI

* POST `/ai/generate-message`

### Messages

* POST `/messages/send`

### Logs

* GET `/logs`

---

# 🧠 Business Logic Layer

## Responsibilities

* Validate incoming data
* Process customer activity
* Identify inactive customers
* Trigger automation workflows
* Handle campaign logic

---

## Example Flow: Add Customer

1. Receive request
2. Validate input
3. Save to database
4. Return response

---

## Example Flow: Trigger Campaign

1. Receive campaign request
2. Fetch target customers
3. Call automation webhook (n8n)
4. Return success response

---

# 🗄️ Database Interaction

* Use SQL queries or ORM (optional)
* All DB access handled in `services/` layer

---

# 🔄 Automation Integration (n8n)

## Method

* Backend triggers n8n via webhook

### Example

```id="1c4m9k"
POST http://n8n-server/webhook/trigger-campaign
```

### Payload

```json id="k2r7px"
{
  "campaign_id": "uuid",
  "target": "inactive"
}
```

---

# 🤖 AI Integration

## Method

* Backend calls OpenAI API

## Responsibilities

* Generate message templates
* Pass context data

---

# 📩 Messaging Integration

Handled via backend OR n8n:

* WhatsApp API
* Email API

---

# 🧪 Error Handling

* All APIs must return:

  * status
  * error (if any)

### Example

```json id="q0xb4m"
{
  "status": "error",
  "error": "Invalid input"
}
```

---

# 🔐 Basic Security

* Input validation
* Rate limiting (optional)
* Environment variables for secrets

---

# ⚡ Performance Considerations

* Use indexing (DB level)
* Avoid blocking operations
* Keep APIs stateless

---

# 🚀 Future Enhancements

* Authentication (JWT)
* Role-based access
* Microservices architecture
* Queue system (Redis)

---

# 📌 Design Principles

* Separation of concerns
* Reusable services
* Clean code structure
* Minimal coupling

---

# 📊 Summary

The backend acts as the **central brain** of the system:

* Receives requests from frontend
* Processes logic
* Stores/retrieves data
* Triggers automation workflows
* Integrates with AI and messaging systems

It is designed to be:

* Scalable
* Maintainable
* Easy to extend
