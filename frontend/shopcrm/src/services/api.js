/**
 * API Service Layer
 * Maps directly to API_CONTRACT.md
 * Base URL: http://localhost:5000/api
 *
 * To switch from dummy data to real backend:
 *   Change USE_DUMMY_DATA to false
 */

export const USE_DUMMY_DATA = false;

const BASE_URL = 'http://localhost:5000/api';

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + path, options);
  const payload = await res.json().catch(() => ({}));

  if (!res.ok || payload.status === 'error') {
    throw new Error(payload.error || `HTTP ${res.status}`);
  }

  return payload;
}

export const addCustomer = (data) => request('POST', '/customers', data);
export const getCustomers = () => request('GET', '/customers');
export const getCampaigns = () => request('GET', '/campaigns');
export const deleteCustomer = (id) => request('DELETE', `/customers/${id}`);
export const getInactiveCustomers = (days = 30) =>
  request('GET', `/customers/inactive?days=${days}`);
export const createCampaign = (data) => request('POST', '/campaigns', data);
export const triggerCampaign = (data) => request('POST', '/campaigns/trigger', data);
export const sendAiCampaign = async (data) => {
  if (data instanceof FormData) {
    const res = await fetch(BASE_URL + '/campaigns/send-ai', { method: 'POST', body: data });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok || payload.status === 'error') throw new Error(payload.error || `HTTP ${res.status}`);
    return payload;
  }
  return request('POST', '/campaigns/send-ai', data);
};
export const generateMessage = (data) => request('POST', '/ai/generate-message', data);
export const sendMessage = (data) => request('POST', '/messages/send', data);
export const getLogs = () => request('GET', '/logs');
export const runInactiveRecovery = () =>
  request('POST', '/automation/remind-inactive');
export const getMessages = () => request('GET', '/messages');
export const getMessageSummary = () => request('GET', '/messages/summary');
