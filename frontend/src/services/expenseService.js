// frontend/src/services/expenseService.js
// All API calls for expenses — wired to the backend via api.js

import api from './api.js';

export const expenseService = {
  /**
   * GET /expenses — fetch all expenses with optional filters
   * @param {{ category?: string, startDate?: string, endDate?: string }} params
   */
  getAll(params = {}) {
    const filtered = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    );
    return api.get('/expenses', { params: filtered });
  },

  /** GET /expenses/:id */
  getById(id) {
    return api.get(`/expenses/${id}`);
  },

  /** POST /expenses */
  create(data) {
    return api.post('/expenses', data);
  },

  /** PUT /expenses/:id */
  update(id, data) {
    return api.put(`/expenses/${id}`, data);
  },

  /** DELETE /expenses/:id */
  delete(id) {
    return api.delete(`/expenses/${id}`);
  },

  /**
   * GET /expenses/summary — total amount + count with optional filters
   * @param {{ category?: string, startDate?: string, endDate?: string }} params
   */
  getSummary(params = {}) {
    const filtered = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    );
    return api.get('/expenses/summary', { params: filtered });
  },
};
