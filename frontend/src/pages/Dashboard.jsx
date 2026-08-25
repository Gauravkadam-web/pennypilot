// frontend/src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Hash, ArrowRight, TrendingUp, Receipt, Calendar, PieChart } from 'lucide-react';
import { useExpenseContext } from '../context/ExpenseContext.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';
import { CATEGORY_MAP } from '../constants/expenseConstants.js';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import CategoryChart from '../components/dashboard/CategoryChart.jsx';

function CategoryBadge({ category }) {
  const cat = CATEGORY_MAP[category] || { label: category, cssClass: 'other' };
  return (
    <span className={`badge badge--${cat.cssClass}`} title={cat.label}>
      <span className="badge__dot" style={{ backgroundColor: `var(--color-cat-${cat.cssClass})` }} aria-hidden="true" />
      {cat.label}
    </span>
  );
}

export default function Dashboard() {
  usePageTitle('Dashboard');
  const { expenses, summary, loading, error, fetchExpenses } = useExpenseContext();

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  if (error) return <ErrorMessage message={error} onRetry={fetchExpenses} />;

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate))
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      {/* Dashboard Top Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Summary of your personal spending and recent transactions</p>
        </div>
        <Link to="/expenses" className="btn btn--primary btn--md" id="dashboard-add-expense-btn">
          <Receipt size={16} aria-hidden="true" />
          Manage Expenses
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card__top">
            <div className="stat-card__icon stat-card__icon--primary" aria-hidden="true">
              <Wallet size={22} />
            </div>
            <span className="stat-card__tag">Total Spend</span>
          </div>
          <div className="stat-card__label">Total Amount</div>
          {loading ? (
            <div className="skeleton" style={{ width: '70%', height: '36px', marginTop: 'var(--space-2)' }} />
          ) : (
            <div className="stat-card__value" aria-live="polite">{formatCurrency(summary.totalAmount)}</div>
          )}
          <div className="stat-card__subtext">Across all recorded categories</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__top">
            <div className="stat-card__icon stat-card__icon--positive" aria-hidden="true">
              <Hash size={22} />
            </div>
            <span className="stat-card__tag">Transactions</span>
          </div>
          <div className="stat-card__label">Total Expenses</div>
          {loading ? (
            <div className="skeleton" style={{ width: '40%', height: '36px', marginTop: 'var(--space-2)' }} />
          ) : (
            <div className="stat-card__value" aria-live="polite">{summary.totalCount}</div>
          )}
          <div className="stat-card__subtext">Recorded expense entries</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__top">
            <div className="stat-card__icon stat-card__icon--warning" aria-hidden="true">
              <TrendingUp size={22} />
            </div>
            <span className="stat-card__tag">Average</span>
          </div>
          <div className="stat-card__label">Avg. Per Transaction</div>
          {loading ? (
            <div className="skeleton" style={{ width: '60%', height: '36px', marginTop: 'var(--space-2)' }} />
          ) : (
            <div className="stat-card__value" aria-live="polite">
              {summary.totalCount > 0
                ? formatCurrency(summary.totalAmount / summary.totalCount)
                : formatCurrency(0)}
            </div>
          )}
          <div className="stat-card__subtext">Average spend per entry</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="dashboard-charts-row">
        <div className="card dashboard-chart-card">
          <div className="card__header">
            <div>
              <h2 className="card__title">Spend by Category</h2>
              <p className="card__subtitle">Distribution across all your expense categories</p>
            </div>
            <div className="stat-card__icon stat-card__icon--primary" aria-hidden="true">
              <PieChart size={18} />
            </div>
          </div>
          {loading ? (
            <div className="chart-skeleton">
              <div className="skeleton" style={{ width: '180px', height: '180px', borderRadius: '50%', margin: '0 auto' }} />
            </div>
          ) : (
            <CategoryChart expenses={expenses} />
          )}
        </div>
      </div>

      {/* Recent Expenses Section */}
      <div className="card dashboard-table-card">
        <div className="card__header">
          <div>
            <h2 className="card__title">Recent Transactions</h2>
            <p className="card__subtitle">Your 5 most recent expense entries</p>
          </div>
          <Link
            to="/expenses"
            id="view-all-expenses-link"
            className="btn btn--secondary btn--sm"
          >
            <span>View All Expenses</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div className="table-wrapper">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="skeleton-row">
                <div className="skeleton" style={{ width: '35%', height: '16px' }} />
                <div className="skeleton" style={{ width: '15%', height: '22px', borderRadius: '999px' }} />
                <div className="skeleton" style={{ width: '15%', height: '14px' }} />
                <div className="skeleton" style={{ width: '20%', height: '16px', marginLeft: 'auto' }} />
              </div>
            ))}
          </div>
        ) : recentExpenses.length === 0 ? (
          <div className="empty-state" style={{ padding: 'var(--space-10) var(--space-4)' }}>
            <Receipt size={36} className="empty-state__icon" aria-hidden="true" />
            <p className="empty-state__title">No transactions recorded yet</p>
            <p className="empty-state__body">Start tracking your spending by adding your first expense.</p>
            <Link to="/expenses" className="btn btn--primary btn--sm" style={{ marginTop: 'var(--space-2)' }}>
              Add First Expense
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop / Tablet Recent Table */}
            <div className="desktop-table-view">
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: '40%' }}>Title</th>
                      <th scope="col" style={{ width: '20%' }}>Category</th>
                      <th scope="col" style={{ width: '20%' }}>Date</th>
                      <th scope="col" className="text-right" style={{ width: '20%' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentExpenses.map(exp => (
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Recent Cards */}
            <div className="mobile-cards-view">
              <div className="mobile-cards-container">
                {recentExpenses.map(exp => {
                  const cat = CATEGORY_MAP[exp.category] || { label: exp.category, cssClass: 'other' };
                  return (
                    <div key={exp.id} className="expense-card">
                      <div className="expense-card__header">
                        <div className="expense-card__title-wrap">
                          <h3 className="expense-card__title">{exp.title}</h3>
                          {exp.description && (
                            <p className="expense-card__desc">{exp.description}</p>
                          )}
                        </div>
                        <div className="expense-card__amount">
                          {formatCurrency(exp.amount)}
                        </div>
                      </div>
                      <div className="expense-card__footer">
                        <div className="expense-card__meta">
                          <span className={`badge badge--${cat.cssClass}`}>
                            <span className="badge__dot" style={{ backgroundColor: `var(--color-cat-${cat.cssClass})` }} aria-hidden="true" />
                            {cat.label}
                          </span>
                          <span className="expense-card__date">
                            <Calendar size={13} aria-hidden="true" />
                            {formatDate(exp.expenseDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
