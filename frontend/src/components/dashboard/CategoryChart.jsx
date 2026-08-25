// frontend/src/components/dashboard/CategoryChart.jsx
// Donut chart: category-wise spend breakdown using Recharts + dynamic colors from CategoryContext

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency.js';

const RADIAN = Math.PI / 180;

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null;
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

const CHART_COLORS = [
  '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6', 
  '#10B981', '#F43F5E', '#06B6D4', '#EAB308',
  '#6366F1', '#14B8A6', '#84CC16', '#A855F7',
];

/**
 * @param {Array}  expenses     Expense objects with .category and .amount
 * @param {Object} categoryMap  name → { label, icon } from CategoryContext
 */
export default function CategoryChart({ expenses, categoryMap = {} }) {
  // Aggregate spend per category
  const dataMap = {};
  for (const exp of expenses) {
    const key = exp.category;
    dataMap[key] = (dataMap[key] || 0) + parseFloat(exp.amount);
  }

  // Build chart data
  const data = Object.entries(dataMap)
    .map(([name, value], index) => {
      const cat = categoryMap[name];
      return {
        name:  cat?.label || name,
        value,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    })
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
