# 🎨 FRONTEND DESIGN DOCUMENT

---

# 📘 Overview

This document defines the frontend architecture, UI structure, and implementation plan for the **AI Customer Retention System**.

The frontend is responsible for:

* Providing user interface (UI)
* Handling user interactions
* Communicating with backend APIs
* Displaying data in a clear and simple way

---

# 🎯 Frontend Goals

* Simple and clean UI
* Easy navigation for non-technical users
* Fast and responsive design
* Seamless API integration

---

# 🧱 Tech Stack

* **Framework:** React.js / Next.js
* **Styling:** Tailwind CSS
* **HTTP Client:** Axios / Fetch API
* **State Management:** useState / useEffect (basic)

---

# 📂 Folder Structure

```id="x2p8z1"
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/   # API calls
│   ├── hooks/
│   ├── utils/
│   └── App.js
│
├── public/
├── package.json
```

---

# 🧩 Pages Structure

---

## 🏠 1. Dashboard Page

### Purpose

* Show overview of system

### Features

* Total customers
* Active customers
* Inactive customers
* Recent activity

---

## 👥 2. Customers Page

### Purpose

* Manage customer data

### Features

* Add new customer form
* List of customers
* Search / filter (optional)

---

## 📢 3. Campaign Page

### Purpose

* Create and trigger campaigns

### Features

* Create campaign form
* Select target (all / inactive)
* Trigger campaign button

---

## 📜 4. Logs Page (Optional)

### Purpose

* View message history

---

# 🧱 Components

---

## 🔹 Navbar

* Navigation between pages

---

## 🔹 CustomerForm

* Input fields:

  * Name
  * Phone
  * Email
  * Last visit

---

## 🔹 CustomerList

* Table view of customers

---

## 🔹 CampaignForm

* Campaign name
* Message
* Target selection

---

## 🔹 StatsCard

* Display metrics (dashboard)

---

# 🔗 API Integration

All API calls handled via `services/` folder.

---

## Example: Add Customer

```javascript
const addCustomer = async (data) => {
  const response = await fetch('/api/customers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

---

## Example: Get Customers

```javascript
const getCustomers = async () => {
  const response = await fetch('/api/customers');
  return response.json();
};
```

---

# 🔄 User Flow

1. User opens dashboard
2. Navigates to Customers page
3. Adds customer
4. Data sent to backend
5. Customer appears in list
6. User creates campaign   
7. Triggers campaign

---

# 🎨 UI/UX Guidelines

* Minimal design
* Large buttons
* Clear labels
* Mobile-friendly layout

---

# ⚡ State Management

* Local state using React hooks
* No complex state library needed for MVP

---

# 🧪 Error Handling

* Show error messages on failed API calls
* Validate inputs before submission

---

# 🚀 Future Enhancements

* Authentication UI
* Role-based dashboards
* Advanced filters
* Analytics charts

---

# 📌 Design Principles

* Keep UI simple
* Avoid clutter
* Focus on usability
* Fast loading experience

---

# 📊 Summary

The frontend serves as the **interaction layer** between user and system:

* Captures user input
* Displays data clearly
* Communicates with backend APIs
* Enables campaign execution

It is designed to be:

* Lightweight
* Intuitive
* Easily extendable
