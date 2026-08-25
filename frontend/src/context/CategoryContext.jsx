// frontend/src/context/CategoryContext.jsx
// Provides dynamic category list fetched from the backend API.
// Replaces hardcoded EXPENSE_CATEGORIES and CATEGORY_MAP constants.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/categoryService.js';

// Fallback palette while loading (matches the seeded defaults)
const FALLBACK_CATEGORIES = [
  { id: null, name: 'FOOD',          label: 'Food',          color: '#F59E0B', isDefault: true },
  { id: null, name: 'TRANSPORT',     label: 'Transport',     color: '#3B82F6', isDefault: true },
  { id: null, name: 'SHOPPING',      label: 'Shopping',      color: '#EC4899', isDefault: true },
  { id: null, name: 'BILLS',         label: 'Bills',         color: '#8B5CF6', isDefault: true },
  { id: null, name: 'HEALTH',        label: 'Health',        color: '#10B981', isDefault: true },
  { id: null, name: 'ENTERTAINMENT', label: 'Entertainment', color: '#F43F5E', isDefault: true },
  { id: null, name: 'OTHER',         label: 'Other',         color: '#6B7280', isDefault: true },
];

const CategoryContext = createContext(null);

export function CategoryProvider({ children }) {
  const [categories, setCategories]     = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await categoryService.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories — using fallback', err);
      setError('Could not load categories from server.');
      setCategories(FALLBACK_CATEGORIES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const createCategory = useCallback(async (data) => {
    const res = await categoryService.create(data);
    await fetchCategories(); // refresh list
    return res.data;
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id, data) => {
    const res = await categoryService.update(id, data);
    await fetchCategories();
    return res.data;
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id) => {
    await categoryService.delete(id);
    await fetchCategories();
  }, [fetchCategories]);

  /** Build a lookup map: name → category object */
  const categoryMap = Object.fromEntries(categories.map(c => [c.name, c]));

  return (
    <CategoryContext.Provider value={{
      categories,
      categoryMap,
      loading,
      error,
      fetchCategories,
      createCategory,
      updateCategory,
      deleteCategory,
    }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryContext() {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error('useCategoryContext must be used within CategoryProvider');
  return ctx;
}
