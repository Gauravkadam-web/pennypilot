// frontend/src/components/expense/ExpenseCard.jsx
// Mobile card view for a single expense
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { useCategoryContext } from '../../context/CategoryContext.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  const { categoryMap } = useCategoryContext();
  const cat = categoryMap[expense.category] || { label: expense.category, color: '#6B7280' };
  const cssClass = (expense.category || 'other').toLowerCase();

  return (
    <div className="expense-card">
      <div className="expense-card__header">
        <div className="expense-card__title-wrap">
          <h3 className="expense-card__title">{expense.title}</h3>
          {expense.description && (
            <p className="expense-card__desc">{expense.description}</p>
          )}
        </div>
        <div className="expense-card__amount">
          {formatCurrency(expense.amount)}
        </div>
      </div>

      <div className="expense-card__footer">
        <div className="expense-card__meta">
          <span className={`badge badge--${cssClass}`}>
            <span className="badge__dot" style={{ backgroundColor: cat.color || `var(--color-cat-${cssClass})` }} aria-hidden="true" />
            {cat.label}
          </span>
          <span className="expense-card__date">
            <Calendar size={13} aria-hidden="true" />
            {formatDate(expense.expenseDate)}
          </span>
        </div>

        <div className="expense-card__actions">
          <button
            className="action-btn action-btn--edit"
            onClick={() => onEdit(expense)}
            aria-label={`Edit ${expense.title}`}
            id={`card-edit-btn-${expense.id}`}
            title="Edit expense"
          >
            <Pencil size={14} />
          </button>
          <button
            className="action-btn action-btn--delete"
            onClick={() => onDelete(expense)}
            aria-label={`Delete ${expense.title}`}
            id={`card-delete-btn-${expense.id}`}
            title="Delete expense"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
