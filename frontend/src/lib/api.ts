import axios from 'axios';

// Browser: always use same-origin /api (Nginx/Docker routes to backend).
// SSR/build: fall back to env or localhost.
function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  return `${base.replace(/\/$/, '')}/api`;
}

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token for admin requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/admin') && path !== '/admin/login') {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
