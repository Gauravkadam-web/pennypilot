// frontend/src/context/ExpenseContext.jsx
// Shared expense state — consumed by Dashboard and Expenses pages.
// Eliminates double API fetches when navigating between routes.

import { createContext, useContext, useState, useCallback } from 'react';
import { expenseService } from '../services/expenseService.js';

const ExpenseContext = createContext(null);

const PAGE_SIZE = 10;

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses]     = useState([]);
  const [summary, setSummary]       = useState({ totalAmount: 0, totalCount: 0 });
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  // Pagination state
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize]                  = useState(PAGE_SIZE);

  const fetchExpenses = useCallback(async (filters = {}, requestedPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = { ...filters, page: requestedPage, limit: PAGE_SIZE };
      const [expRes, sumRes] = await Promise.all([
        expenseService.getAll(params),
        expenseService.getSummary(filters),
      ]);

      // Support both paginated { data, totalPages } and plain array responses
      const raw = expRes.data;
      if (Array.isArray(raw)) {
        setExpenses(raw);
        setTotalPages(1);
      } else {
        setExpenses(raw.data ?? raw.expenses ?? raw);
        setTotalPages(raw.totalPages ?? 1);
      }

      setSummary(sumRes.data);
      setPage(requestedPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenses.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createExpense = useCallback(async (data) => {
    const res = await expenseService.create(data);
    return res.data;
  }, []);

  const updateExpense = useCallback(async (id, data) => {
    const res = await expenseService.update(id, data);
    return res.data;
  }, []);

  const deleteExpense = useCallback(async (id) => {
    await expenseService.delete(id);
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        summary,
        loading,
        error,
        page,
        totalPages,
        pageSize,
        fetchExpenses,
        createExpense,
        updateExpense,
        deleteExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenseContext() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenseContext must be used within ExpenseProvider');
  return ctx;
}
