# 🗄️ DATABASE DESIGN DOCUMENT

## 📘 Overview

This document defines the database schema for the AI Customer Retention System.

The database is designed to be:

* Scalable
* Modular
* Easy to extend for future features

---

## 🧱 Database Choice

Recommended:

* **PostgreSQL (via Supabase)**

Why:

* Structured data
* Strong relationships
* Easy integration with APIs

---

## 📊 Tables Overview

1. customers
2. campaigns
3. messages
4. logs

---

## 📌 1. Customers Table

### Description

Stores all customer-related data.

### Schema

```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    last_visit DATE,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📌 2. Campaigns Table

### Description

Stores campaign details created by the user.

### Schema

```sql
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('manual', 'automated')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📌 3. Messages Table

### Description

Tracks all messages sent to customers.

### Schema

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    channel TEXT CHECK (channel IN ('whatsapp', 'email')),
    status TEXT CHECK (status IN ('sent', 'failed', 'pending')),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📌 4. Logs Table

### Description

Stores system logs for debugging and tracking.

### Schema

```sql
CREATE TABLE logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔗 Relationships

* One customer → many messages
* One campaign → many messages
* Messages act as linking entity between customers and campaigns

---

## ⚡ Indexing (Performance Optimization)

```sql
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_messages_customer_id ON messages(customer_id);
CREATE INDEX idx_messages_campaign_id ON messages(campaign_id);
```

---

## 🔄 Future Scalability

Planned extensions:

* Add `users` table (multi-login system)
* Add `appointments` table
* Add `payments` table
* Add `business_profiles` table

---

## ⚠️ Constraints & Rules

* Phone number must be unique
* UUID used for all primary keys
* Cascade delete for customer → messages
* Campaign deletion does not remove messages

---

## 🧠 Design Philosophy

* Keep schema minimal for MVP
* Allow easy expansion
* Avoid over-engineering

---

## 🚀 Summary

This database structure ensures:

* Clean data relationships
* Efficient querying
* Easy integration with backend APIs
* Future scalability without redesign
