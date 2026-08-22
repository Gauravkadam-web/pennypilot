// frontend/src/services/api.js
// Axios instance — single source of backend URL

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
