import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const buildingService = {
  getAll: () => api.get('/buildings'),
  add: (data) => api.post('/buildings', data),
};

export const departmentService = {
  getAll: () => api.get('/departments'),
  add: (data) => api.post('/departments', data),
};

export const energyService = {
  addEntry: (data) => api.post('/energy/entry', data),
  getSummary: () => api.get('/analytics/summary'),
};

export default api;
