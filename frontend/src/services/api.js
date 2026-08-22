// frontend/src/services/api.js
// Axios instance — single source of backend URL

import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
