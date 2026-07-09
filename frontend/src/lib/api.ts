import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

type UnauthorizedHandler = (() => void) | null;

let unauthorizedHandler: UnauthorizedHandler = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  unauthorizedHandler = handler;
}

function setHeader(config: InternalAxiosRequestConfig, key: string, value: string) {
  if (typeof config.headers.set === 'function') {
    config.headers.set(key, value);
  } else {
    (config.headers as Record<string, string>)[key] = value;
  }
}

function attachAuthHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  if (typeof window === 'undefined') return config;

  config.baseURL = '/api';
  const token = localStorage.getItem('admin_token')?.trim();
  if (token) {
    // Some reverse proxies strip the Authorization header — also send X-Access-Token + cookie
    setHeader(config, 'Authorization', `Bearer ${token}`);
    setHeader(config, 'X-Access-Token', token);
  }
  return config;
}

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(attachAuthHeader);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = String(error.config?.url || '');

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
