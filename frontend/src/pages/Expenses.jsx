// frontend/src/pages/Expenses.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, RotateCcw, Filter, Receipt } from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses.js';
import ExpenseTable from '../components/expense/ExpenseTable.jsx';
import ExpenseCard from '../components/expense/ExpenseCard.jsx';
import ExpenseForm from '../components/expense/ExpenseForm.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';
import Loader from '../components/common/Loader.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import { EXPENSE_CATEGORIES } from '../constants/expenseConstants.js';
import { todayAsInputDate } from '../utils/formatDate.js';
import { formatCurrency } from '../utils/formatCurrency.js';

const EMPTY_FILTERS = { category: '', startDate: '', endDate: '' };

// Simple in-page toast
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);
  return { toasts, show };
}

export default function Expenses() {
  const { expenses, summary, loading, error, fetchExpenses, createExpense, updateExpense, deleteExpense } = useExpenses();
  const [filters, setFilters]         = useState(EMPTY_FILTERS);
  const [addOpen, setAddOpen]         = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting]   = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toasts, show: showToast }   = useToast();
  const addBtnRef = useRef(null);

  // Initial fetch
  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }

  function handleApplyFilters() {
    fetchExpenses(filters);
  }

  function handleResetFilters() {
    setFilters(EMPTY_FILTERS);
    fetchExpenses({});
  }

  async function handleCreate(data) {
    setSubmitting(true);
    try {
      await createExpense(data);
      setAddOpen(false);
      fetchExpenses(filters);
      showToast('Expense added successfully!', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(data) {
    setSubmitting(true);
    try {
      await updateExpense(editTarget.id, data);
      setEditTarget(null);
      fetchExpenses(filters);
      showToast('Expense updated successfully!', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setDeleteLoading(true);
    try {
      await deleteExpense(deleteTarget.id);
      setDeleteTarget(null);
      fetchExpenses(filters);
      showToast('Expense deleted successfully.', 'success');
    } catch {
      showToast('Failed to delete expense.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="expenses-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">
            {loading ? 'Loading expenses…' : `${summary.totalCount} total record${summary.totalCount !== 1 ? 's' : ''} · Total amount: ${formatCurrency(summary.totalAmount)}`}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setAddOpen(true)}
          id="add-expense-btn"
          ref={addBtnRef}
        >
          <Plus size={16} aria-hidden="true" />
          Add Expense
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="filter-card" role="search" aria-label="Filter expenses">
        <div className="filter-card__title-row">
          <div className="filter-card__title">
            <Filter size={15} aria-hidden="true" />
            <span>Filter Expenses</span>
          </div>
          {(filters.category || filters.startDate || filters.endDate) && (
            <span className="filter-card__active-badge">Active Filters</span>
          )}
        </div>
        
        <div className="filter-grid">
          <div className="filter-field">
            <label htmlFor="filter-category" className="filter-label">Category</label>
            <select
              id="filter-category"
              name="category"
              className="form-select filter-input"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="filter-start-date" className="filter-label">Start Date</label>
            <input
              id="filter-start-date"
              name="startDate"
              type="date"
              className="form-input filter-input"
              value={filters.startDate}
              onChange={handleFilterChange}
              max={filters.endDate || todayAsInputDate()}
            />
          </div>

          <div className="filter-field">
            <label htmlFor="filter-end-date" className="filter-label">End Date</label>
            <input
              id="filter-end-date"
              name="endDate"
              type="date"
              className="form-input filter-input"
              value={filters.endDate}
              onChange={handleFilterChange}
              min={filters.startDate}
              max={todayAsInputDate()}
            />
          </div>

          <div className="filter-actions">
            <Button variant="primary" size="md" onClick={handleApplyFilters} id="apply-filters-btn">
              Apply Filters
            </Button>
            <Button variant="secondary" size="md" onClick={handleResetFilters} id="reset-filters-btn">
              <RotateCcw size={14} aria-hidden="true" /> Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop / Tablet: Table View */}
      <div className="desktop-table-view">
        <ExpenseTable
          expenses={expenses}
          loading={loading}
          error={error}
          onEdit={exp => setEditTarget(exp)}
          onDelete={exp => setDeleteTarget(exp)}
          onRetry={() => fetchExpenses(filters)}
        />
      </div>

      {/* Mobile: Cards View */}
      <div className="mobile-cards-view">
        {loading ? (
          <div className="mobile-skeleton-list">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card" style={{ padding: 'var(--space-4)', gap: 'var(--space-2)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="skeleton" style={{ width: '50%', height: '16px' }} />
                  <div className="skeleton" style={{ width: '25%', height: '16px' }} />
                </div>
                <div className="skeleton" style={{ width: '30%', height: '20px', borderRadius: '999px' }} />
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => fetchExpenses(filters)} />
        ) : expenses.length === 0 ? (
          <div className="card empty-state">
            <Receipt size={36} className="empty-state__icon" aria-hidden="true" />
            <p className="empty-state__title">No expenses found</p>
            <p className="empty-state__body">Add your first expense or clear filters.</p>
          </div>
        ) : (
          <div className="mobile-cards-container">
            {expenses.map(exp => (
              <ExpenseCard
                key={exp.id}
                expense={exp}
                onEdit={exp => setEditTarget(exp)}
                onDelete={exp => setDeleteTarget(exp)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      <Modal
        id="add-expense-modal"
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Expense"
      >
        <ExpenseForm
          onSubmit={handleCreate}
          onCancel={() => setAddOpen(false)}
          submitting={submitting}
        />
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        id="edit-expense-modal"
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Expense"
      >
        {editTarget && (
          <ExpenseForm
            key={editTarget.id}
            initialData={editTarget}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
            submitting={submitting}
          />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        id="delete-expense-modal"
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Delete"
      >
        {deleteTarget && (
          <div className="delete-confirm">
            <p className="delete-confirm__body">
              Are you sure you want to delete <strong>"{deleteTarget.title}"</strong>? This will permanently remove the record from your expenses.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <Button variant="secondary" size="md" onClick={() => setDeleteTarget(null)} id="delete-cancel-btn">
                Cancel
              </Button>
              <Button variant="destructive" size="md" loading={deleteLoading} onClick={handleDelete} id="delete-confirm-btn">
                Delete Expense
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Toasts */}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast--${t.type}`} role="alert">
            <span className="toast__message">{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
