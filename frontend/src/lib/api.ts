import axios from 'axios';

function normalizeApiBase(url?: string): string {
  const fallback = 'http://localhost:4000';
  let base = (url || fallback).trim().replace(/\/$/, '');

  // Remove accidental quotes from .env
  base = base.replace(/^["']|["']$/g, '');

  // Fix: esimviet.com → https://esimviet.com (prevents axios "Unsupported protocol")
  if (base && !/^https?:\/\//i.test(base)) {
    base = `https://${base}`;
  }

  return `${base}/api`;
}

// Browser MUST use same-origin relative path (fixes CORS + wrong protocol)
function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return normalizeApiBase(process.env.NEXT_PUBLIC_API_URL);
}

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token for admin requests
api.interceptors.request.use((config) => {
  // Ensure browser always hits same-origin /api
  if (typeof window !== 'undefined') {
    config.baseURL = '/api';
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
