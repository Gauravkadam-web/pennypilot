// frontend/src/constants/expenseConstants.js
// Single source of truth for categories — never hardcode in components

export const EXPENSE_CATEGORIES = [
  { value: 'FOOD',          label: 'Food',          cssClass: 'food' },
  { value: 'TRANSPORT',     label: 'Transport',     cssClass: 'transport' },
  { value: 'SHOPPING',      label: 'Shopping',      cssClass: 'shopping' },
  { value: 'BILLS',         label: 'Bills',         cssClass: 'bills' },
  { value: 'HEALTH',        label: 'Health',        cssClass: 'health' },
  { value: 'ENTERTAINMENT', label: 'Entertainment', cssClass: 'entertainment' },
  { value: 'OTHER',         label: 'Other',         cssClass: 'other' },
];

export const CATEGORY_MAP = Object.fromEntries(
  EXPENSE_CATEGORIES.map(c => [c.value, c])
);
