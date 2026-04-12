/**
 * Utility / helper functions
 */

// How many days since a date string (YYYY-MM-DD)
export function daysSince(dateStr) {
  if (!dateStr) return 999;
  const diff = new Date() - new Date(dateStr);
  return Math.floor(diff / 86_400_000);
}

// Format a date string to readable format
export function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Today's date as YYYY-MM-DD
export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

// Date N days ago as YYYY-MM-DD
export function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

// Determine customer status from last_visit
export function customerStatus(last_visit) {
  const d = daysSince(last_visit);
  if (d <= 30)  return 'active';
  if (d <= 90)  return 'inactive';
  return 'dormant';
}

// Generate a simple local UUID for dummy data
export function localId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// Simple HTML-escape
export function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Fake async delay (used for dummy data simulation)
export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
