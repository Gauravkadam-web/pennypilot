// frontend/src/components/dashboard/CategoryChart.jsx
// Donut chart: category-wise spend breakdown using Recharts

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { EXPENSE_CATEGORIES } from '../../constants/expenseConstants.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

// Map each category to its CSS variable colour value
const CAT_COLORS = {
  FOOD:          '#F59E0B',
  TRANSPORT:     '#3B82F6',
  SHOPPING:      '#EC4899',
  BILLS:         '#8B5CF6',
  HEALTH:        '#10B981',
  ENTERTAINMENT: '#F43F5E',
  OTHER:         '#6B7280',
};

const RADIAN = Math.PI / 180;

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null; // hide tiny labels
  const r   = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x   = cx + r * Math.cos(-midAngle * RADIAN);
  const y   = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x} y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip__label">{name}</span>
      <span className="chart-tooltip__value">{formatCurrency(value)}</span>
    </div>
  );
}

/**
 * @param {Array<{category: string, amount: number|string}>} expenses
 */
export default function CategoryChart({ expenses }) {
  // Aggregate spend per category
  const dataMap = {};
  for (const exp of expenses) {
    const key = exp.category;
    dataMap[key] = (dataMap[key] || 0) + parseFloat(exp.amount);
  }

  const data = EXPENSE_CATEGORIES
    .map(cat => ({
      name:  cat.label,
      value: dataMap[cat.value] || 0,
      color: CAT_COLORS[cat.value] || '#6B7280',
    }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <p>No spending data to display yet.</p>
      </div>
    );
  }

  return (
    <div className="chart-container" aria-label="Category spend breakdown chart">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={68}
            outerRadius={108}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={CustomLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
