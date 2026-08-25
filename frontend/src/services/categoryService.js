// frontend/src/services/categoryService.js
// API calls for dynamic categories

import api from './api.js';

export const categoryService = {
  /** GET /categories — list all categories */
  getAll() {
    return api.get('/categories');
  },

  /** POST /categories — create custom category */
  create(data) {
    return api.post('/categories', data);
  },

  /** PUT /categories/:id — update label/color */
  update(id, data) {
    return api.put(`/categories/${id}`, data);
  },

  /** DELETE /categories/:id — blocked if in use */
  delete(id) {
    return api.delete(`/categories/${id}`);
  },
};
