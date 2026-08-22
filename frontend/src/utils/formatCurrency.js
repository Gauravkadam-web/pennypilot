// frontend/src/utils/formatCurrency.js
// Centralised currency formatter — never hardcode ₹ in components

const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a number as Indian Rupee currency string.
 * @param {number|string} value
 * @returns {string} e.g. "₹1,250.50"
 */
export function formatCurrency(value) {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '₹0.00';
  return INR.format(num);
}
