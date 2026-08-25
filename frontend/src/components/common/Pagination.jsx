// frontend/src/components/common/Pagination.jsx
// Reusable pagination control component

import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * @param {number}   page         Current page (1-indexed)
 * @param {number}   totalPages   Total number of pages
 * @param {Function} onPageChange Callback with new page number
 */
export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = buildPageNumbers(page, totalPages);

  return (
    <nav className="pagination" aria-label="Expense list pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        id="pagination-prev"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="pagination__pages">
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`pagination__page-btn${p === page ? ' pagination__page-btn--active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
              id={`pagination-page-${p}`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className="pagination__btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        id="pagination-next"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

/**
 * Builds page number array with ellipsis for large page counts.
 * e.g. [1, '…', 4, 5, 6, '…', 20]
 */
function buildPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];
  pages.push(1);

  if (current > 3) pages.push('…');

  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }

  if (current < total - 2) pages.push('…');

  pages.push(total);
  return pages;
}
