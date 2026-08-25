// frontend/src/components/expense/ExpenseTable.jsx
import { Pencil, Trash2, Receipt } from 'lucide-react';
import { useCategoryContext } from '../../context/CategoryContext.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
import Loader from '../common/Loader.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';

function CategoryBadge({ category }) {
  const { categoryMap } = useCategoryContext();
  const cat = categoryMap[category] || { label: category, color: '#6B7280' };
  const cssClass = (category || 'other').toLowerCase();

  return (
    <span className={`badge badge--${cssClass}`} title={cat.label}>
      <span className="badge__dot" style={{ backgroundColor: cat.color || `var(--color-cat-${cssClass})` }} aria-hidden="true" />
      {cat.label}
    </span>
  );
}

export default function ExpenseTable({ expenses, loading, error, onEdit, onDelete, onRetry }) {
  if (loading) return <div className="table-wrapper"><Loader rows={6} /></div>;
  if (error)   return <ErrorMessage message={error} onRetry={onRetry} />;

  if (!expenses.length) {
    return (
      <div className="table-wrapper">
        <div className="empty-state" role="status">
          <Receipt size={40} className="empty-state__icon" aria-hidden="true" />
          <p className="empty-state__title">No expenses found</p>
          <p className="empty-state__body">Add your first expense or clear your filters to see transactions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper" role="region" aria-label="Expense list">
      <table className="table">
        <thead>
          <tr>
            <th scope="col" style={{ width: '35%' }}>Title</th>
            <th scope="col" style={{ width: '18%' }}>Category</th>
            <th scope="col" style={{ width: '18%' }}>Date</th>
            <th scope="col" className="text-right" style={{ width: '17%' }}>Amount</th>
            <th scope="col" className="text-right" style={{ width: '12%' }}><span className="sr-only">Actions</span>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id}>
              <td>
                <div className="table__title-cell">
                  <span className="table__title-text">{exp.title}</span>
                  {exp.description && (
                    <span className="table__desc-text">{exp.description}</span>
                  )}
                </div>
              </td>
              <td>
                <CategoryBadge category={exp.category} />
              </td>
              <td>
                <span className="table__date-text">{formatDate(exp.expenseDate)}</span>
              </td>
              <td className="text-right">
                <span className="table__amount">{formatCurrency(exp.amount)}</span>
              </td>
              <td className="text-right">
                <div className="table__actions">
                  <button
                    className="action-btn action-btn--edit"
                    onClick={() => onEdit(exp)}
                    aria-label={`Edit ${exp.title}`}
                    id={`edit-btn-${exp.id}`}
                    title="Edit expense"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    className="action-btn action-btn--delete"
                    onClick={() => onDelete(exp)}
                    aria-label={`Delete ${exp.title}`}
                    id={`delete-btn-${exp.id}`}
                    title="Delete expense"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
