// frontend/src/hooks/useExpenses.js
import { useState, useCallback } from 'react';
import { expenseService } from '../services/expenseService.js';

export function useExpenses() {
  const [expenses, setExpenses]   = useState([]);
  const [summary, setSummary]     = useState({ totalAmount: 0, totalCount: 0 });
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const fetchExpenses = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const [expRes, sumRes] = await Promise.all([
        expenseService.getAll(filters),
        expenseService.getSummary(filters),
      ]);
      setExpenses(expRes.data);
      setSummary(sumRes.data);
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

  return {
    expenses, summary, loading, error,
    fetchExpenses, createExpense, updateExpense, deleteExpense,
  };
}
