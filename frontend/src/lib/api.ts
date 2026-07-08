import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

type UnauthorizedHandler = (() => void) | null;

let unauthorizedHandler: UnauthorizedHandler = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  unauthorizedHandler = handler;
}

function attachAuthHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  if (typeof window === 'undefined') return config;

  config.baseURL = '/api';
  const token = localStorage.getItem('admin_token')?.trim();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
}

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(attachAuthHeader);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = String(error.config?.url || '');

    // Only invalidate session on /auth/me 401 — not on every admin API error
    if (
      status === 401 &&
      typeof window !== 'undefined' &&
      url.includes('/auth/me') &&
      localStorage.getItem('admin_token')
    ) {
      unauthorizedHandler?.();
    }

    return Promise.reject(error);
  }
);

export default api;
