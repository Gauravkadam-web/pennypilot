// frontend/src/utils/formatDate.js

/**
 * Format an ISO date string (YYYY-MM-DD) to a human-readable format.
 * e.g. "2026-08-20" → "20 Aug 2026"
 */
export function formatDate(isoDate) {
  if (!isoDate) return '—';
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Format a date for use in date input fields (YYYY-MM-DD).
 */
export function toInputDate(isoDate) {
  if (!isoDate) return '';
  return isoDate.slice(0, 10);
}

/**
 * Get today's date as a YYYY-MM-DD string.
 */
export function todayAsInputDate() {
  return new Date().toISOString().slice(0, 10);
}
