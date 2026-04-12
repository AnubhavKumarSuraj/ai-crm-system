# ShopCRM — Frontend

> Customer & Campaign management dashboard for shop owners.
> Built with React + Tailwind CSS. Currently runs on **dummy data** — backend-ready.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm start

# 3. Open in browser
http://localhost:3000
```

To create a production build:
```bash
npm run build
# Output goes to /build folder — hand this to the backend team
```

---

## Folder Structure

```
src/
├── components/         # Reusable UI building blocks
│   ├── Navbar.jsx      # Sidebar navigation (links to all pages)
│   ├── Layout.jsx      # App shell: sidebar + topbar + global state
│   ├── Button.jsx      # Button (variants: default, outline, ghost, hero, danger)
│   ├── Input.jsx       # Input, Textarea, Select, FormField
│   ├── Card.jsx        # Card, CardHeader, CardContent, CardFooter
│   ├── StatsCard.jsx   # Metric card (label + big number)
│   ├── Badge.jsx       # Status badges (success, warn, info, accent, neutral)
│   ├── Modal.jsx       # Modal wrapper with header, body, footer
│   └── Toast.jsx       # Toast notifications (bottom-right)
│
├── pages/              # Full screen views
│   ├── Dashboard.jsx   # Stats overview + recent customers/campaigns
│   ├── Customers.jsx   # Customer list, search, filter, add modal
│   └── Campaigns.jsx   # Campaign cards, create modal, trigger modal
│
├── services/
│   └── api.js          # ← ALL API calls live here (matches API_CONTRACT.md)
│
├── hooks/
│   └── useToast.js     # Toast state hook
│
├── utils/
│   ├── helpers.js      # daysSince, formatDate, localId, sleep, etc.
│   └── dummyData.js    # Seed data (used until backend is live)
│
├── App.js              # React Router setup
├── index.js            # Entry point
└── index.css           # Global styles + CSS variables
```

---

## Pages & Navigation

| URL | Page | What it does |
|-----|------|-------------|
| `/dashboard` | Dashboard | Stats cards + recent customer/campaign previews |
| `/customers` | Customers | Full table with search, filter, add customer, remove |
| `/campaigns` | Campaigns | Card grid, create campaign, trigger to all/inactive |

Navigation is handled by **React Router** via the `<Navbar />` sidebar.  
The active route is highlighted automatically.

---

## Connecting to the Real Backend

**One change, everything works.**

Open `src/services/api.js` and change line 10:

```js
// Before (dummy data mode)
export const USE_DUMMY_DATA = true;

// After (real backend)
export const USE_DUMMY_DATA = false;
```

The base URL is already set:
```js
const BASE_URL = 'http://localhost:5000/api';
```

If the backend runs on a different port or domain, update `BASE_URL` here.

---

## API Endpoints Wired (from API_CONTRACT.md)

| Function | Method | Endpoint |
|----------|--------|----------|
| `addCustomer(data)` | POST | `/customers` |
| `getCustomers()` | GET | `/customers` |
| `getInactiveCustomers(days)` | GET | `/customers/inactive?days=N` |
| `createCampaign(data)` | POST | `/campaigns` |
| `triggerCampaign(data)` | POST | `/campaigns/trigger` |
| `generateMessage(data)` | POST | `/ai/generate-message` |
| `sendMessage(data)` | POST | `/messages/send` |
| `getLogs()` | GET | `/logs` |

All functions are in `src/services/api.js`. Pages call them through this service — never directly in components.

---

## Global State

State is managed in `Layout.jsx` via React Context (`AppContext`).

| State | What it holds |
|-------|--------------|
| `customers` | Array of all customers |
| `campaigns` | Array of all campaigns |
| `logs` | Array of activity log entries |
| `showToast(msg, type)` | Show a notification |
| `addLog(event, detail, status)` | Add an activity entry |

Any page can access this via:
```js
import { useApp } from '../components/Layout';
const { customers, showToast } = useApp();
```

---

## What's Complete (Hand-off Checklist)

- [x] Dashboard with live stats
- [x] Customer list with search + status filter
- [x] Add Customer form (validated)
- [x] Remove Customer
- [x] Campaign card grid
- [x] Create Campaign form (validated)
- [x] Trigger Campaign (All / Inactive) with count estimate
- [x] Toast notifications for all actions
- [x] API service layer wired to all 8 endpoints
- [x] Dummy data mode (flip one flag to go live)
- [x] Responsive modals with keyboard (Escape) close
- [x] Error states on all forms

---

## What's Pending (Future Sprints)

- [ ] Connect `GET /customers` on page load (replace dummy data)
- [ ] AI Message Generation UI (`/ai/generate-message`)
- [ ] Activity Logs page (calls `GET /logs`)
- [ ] Pagination for large customer lists
- [ ] Edit customer details

---

## Notes for Project Head / Backend Team

- All API calls go through `src/services/api.js` — no direct fetch calls anywhere else
- Request/response shapes match `API_CONTRACT.md` exactly
- Error handling is in place — failed API calls show user-friendly messages
- `USE_DUMMY_DATA = false` is the only change needed to go live
