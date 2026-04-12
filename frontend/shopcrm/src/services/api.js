/**
 * API Service Layer
 * Maps directly to API_CONTRACT.md
 * Base URL: http://localhost:5000/api
 *
 * To switch from dummy data to real backend:
 *   Change USE_DUMMY_DATA to false
 */

export const USE_DUMMY_DATA = false; // ← flip to false when backend is ready

const BASE_URL = 'http://localhost:5000/api';

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(BASE_URL + path, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── 1. Add Customer ──────────────────────────────────────────────────────────
// POST /customers
// Body: { name, phone, email, last_visit }
// Returns: { status, customer_id }
export const addCustomer = (data) => request('POST', '/customers', data);

// ─── 2. Get All Customers ─────────────────────────────────────────────────────
// GET /customers
// Returns: { status, data: [...customers] }
export const getCustomers = () => request('GET', '/customers');

// ─── 3. Get Inactive Customers ────────────────────────────────────────────────
// GET /customers/inactive?days=30
// Returns: { status, data: [...customers] }
export const getInactiveCustomers = (days = 30) =>
  request('GET', `/customers/inactive?days=${days}`);

// ─── 4. Create Campaign ───────────────────────────────────────────────────────
// POST /campaigns
// Body: { name, message, type }
// Returns: { status, campaign_id }
export const createCampaign = (data) => request('POST', '/campaigns', data);

// ─── 5. Trigger Campaign ──────────────────────────────────────────────────────
// POST /campaigns/trigger
// Body: { campaign_id, target }
// Returns: { status, messages_sent }
export const triggerCampaign = (data) => request('POST', '/campaigns/trigger', data);

// ─── 6. AI Message Generation ─────────────────────────────────────────────────
// POST /ai/generate-message
// Body: { type, customer_name, business_type }
// Returns: { status, message }
export const generateMessage = (data) => request('POST', '/ai/generate-message', data);

// ─── 7. Send Message (internal) ───────────────────────────────────────────────
// POST /messages/send
// Body: { customer_id, message, channel }
// Returns: { status }
export const sendMessage = (data) => request('POST', '/messages/send', data);

// ─── 8. Logs ──────────────────────────────────────────────────────────────────
// GET /logs
// Returns: { status, data: [...logs] }
export const getLogs = () => request('GET', '/logs');
