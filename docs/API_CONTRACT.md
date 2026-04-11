# 🔗 API CONTRACT DOCUMENT

## 📘 Overview

This document defines all backend APIs that will be used by:

* Frontend
* Automation (n8n)
* External integrations

---

## 🌐 Base URL

```
http://localhost:5000/api
```

---

## 📌 1. Add Customer

### Endpoint

```
POST /customers
```

### Request Body

```json
{
  "name": "string",
  "phone": "string",
  "email": "string",
  "last_visit": "YYYY-MM-DD"
}
```

### Response

```json
{
  "status": "success",
  "customer_id": "uuid"
}
```

---

## 📌 2. Get All Customers

### Endpoint

```
GET /customers
```

### Response

```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "phone": "string",
      "email": "string",
      "last_visit": "date"
    }
  ]
}
```

---

## 📌 3. Get Inactive Customers

### Endpoint

```
GET /customers/inactive?days=30
```

### Description

Returns customers who have not visited in given days.

### Response

```json
{
  "status": "success",
  "data": []
}
```

---

## 📌 4. Create Campaign

### Endpoint

```
POST /campaigns
```

### Request

```json
{
  "name": "Festival Offer",
  "message": "string",
  "type": "manual | automated"
}
```

### Response

```json
{
  "status": "success",
  "campaign_id": "uuid"
}
```

---

## 📌 5. Trigger Campaign

### Endpoint

```
POST /campaigns/trigger
```

### Request

```json
{
  "campaign_id": "uuid",
  "target": "all | inactive"
}
```

### Response

```json
{
  "status": "success",
  "messages_sent": 120
}
```

---

## 📌 6. AI Message Generation

### Endpoint

```
POST /ai/generate-message
```

### Request

```json
{
  "type": "reminder | offer | festival",
  "customer_name": "string",
  "business_type": "string"
}
```

### Response

```json
{
  "status": "success",
  "message": "Generated message text"
}
```

---

## 📌 7. Send Message (Internal Use)

### Endpoint

```
POST /messages/send
```

### Request

```json
{
  "customer_id": "uuid",
  "message": "string",
  "channel": "whatsapp | email"
}
```

### Response

```json
{
  "status": "success"
}
```

---

## 📌 8. Logs

### Endpoint

```
GET /logs
```

### Response

```json
{
  "status": "success",
  "data": []
}
```

---

## ⚠️ Notes

* All responses must include `"status"`
* Use JSON format only
* UUID should be used for IDs
* Error responses must include `"error"` field

---

## 🚀 Summary

This API contract ensures:

* Clear communication between frontend & backend
* Easy integration with automation (n8n)
* Scalable architecture for future features
