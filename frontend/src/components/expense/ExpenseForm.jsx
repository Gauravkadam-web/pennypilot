// frontend/src/components/expense/ExpenseForm.jsx
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Button from '../common/Button.jsx';
import { EXPENSE_CATEGORIES } from '../../constants/expenseConstants.js';
import { todayAsInputDate } from '../../utils/formatDate.js';

const EMPTY_FORM = {
  title: '',
  amount: '',
  category: '',
  expenseDate: todayAsInputDate(),
  description: '',
};

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = 'Title is required';
  else if (form.title.length > 120) errors.title = 'Title must be at most 120 characters';
  if (!form.amount) errors.amount = 'Amount is required';
  else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) errors.amount = 'Amount must be greater than 0';
  if (!form.category) errors.category = 'Category is required';
  if (!form.expenseDate) errors.expenseDate = 'Date is required';
  else if (form.expenseDate > todayAsInputDate()) errors.expenseDate = 'Date must not be in the future';
  if (form.description.length > 500) errors.description = 'Description must be at most 500 characters';
  return errors;
}

export default function ExpenseForm({ initialData = null, onSubmit, onCancel, submitting = false }) {
  const [form, setForm] = useState(
    initialData
      ? {
          title: initialData.title,
          amount: String(initialData.amount),
          category: initialData.category,
          expenseDate: initialData.expenseDate,
          description: initialData.description || '',
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      await onSubmit({
        title: form.title.trim(),
        amount: parseFloat(form.amount),
        category: form.category,
        expenseDate: form.expenseDate,
        description: form.description.trim() || null,
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save expense. Please try again.';
      setApiError(msg);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate id="expense-form">
      {apiError && (
        <div className="form-error" role="alert" style={{ marginBottom: 'var(--space-3)' }}>
          <AlertCircle size={14} aria-hidden="true" />
          {apiError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="field-title" className="form-label form-label--required">Title</label>
        <input
          id="field-title"
          name="title"
          type="text"
          className={`form-input ${errors.title ? 'form-input--error' : ''}`}
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Grocery Shopping"
          maxLength={120}
          autoComplete="off"
        />
        {errors.title && <span className="form-error"><AlertCircle size={12} aria-hidden="true" />{errors.title}</span>}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="field-amount" className="form-label form-label--required">Amount (₹)</label>
          <input
            id="field-amount"
            name="amount"
            type="number"
            className={`form-input ${errors.amount ? 'form-input--error' : ''}`}
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0.01"
          />
          {errors.amount && <span className="form-error"><AlertCircle size={12} aria-hidden="true" />{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="field-category" className="form-label form-label--required">Category</label>
          <select
            id="field-category"
            name="category"
            className={`form-select ${errors.category ? 'form-select--error' : ''}`}
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {EXPENSE_CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {errors.category && <span className="form-error"><AlertCircle size={12} aria-hidden="true" />{errors.category}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="field-date" className="form-label form-label--required">Date</label>
        <input
          id="field-date"
          name="expenseDate"
          type="date"
          className={`form-input ${errors.expenseDate ? 'form-input--error' : ''}`}
          value={form.expenseDate}
          onChange={handleChange}
          max={todayAsInputDate()}
        />
        {errors.expenseDate && <span className="form-error"><AlertCircle size={12} aria-hidden="true" />{errors.expenseDate}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="field-description" className="form-label">Description <span className="text-muted">(optional)</span></label>
        <textarea
          id="field-description"
          name="description"
          className={`form-input form-textarea ${errors.description ? 'form-input--error' : ''}`}
          value={form.description}
          onChange={handleChange}
          placeholder="Add notes..."
          rows={3}
          maxLength={500}
        />
        {errors.description && <span className="form-error"><AlertCircle size={12} aria-hidden="true" />{errors.description}</span>}
        <span className="form-helper">{form.description.length}/500</span>
      </div>

      {/* Footer buttons are rendered by the parent Modal via the footer prop */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
        <Button type="button" variant="secondary" size="md" onClick={onCancel} id="expense-form-cancel">
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" loading={submitting} id="expense-form-submit">
          {initialData ? 'Save changes' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
}
