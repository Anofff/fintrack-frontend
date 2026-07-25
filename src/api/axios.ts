import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { logger } from '@/utils/logger';

const API_V1_SUFFIX = '/api/v1';

/** Ensure VITE_API_URL always resolves to the /api/v1 prefix (e.g. Railway root → …/api/v1). */
function normalizeApiBaseUrl(url: string | undefined): string {
  if (!url?.trim()) return API_V1_SUFFIX;

  const base = url.trim().replace(/\/+$/, '');
  if (base.endsWith(API_V1_SUFFIX)) return base;
  return `${base}${API_V1_SUFFIX}`;
}

const BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // FormData needs a browser-generated multipart boundary; default json Content-Type breaks uploads.
  if (config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type'];
  }
  logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: Error) => void }> = [];

const processQueue = (error: Error | null, token: string | null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => {
    logger.debug(`API Response: ${res.config.method?.toUpperCase()} ${res.config.url} - ${res.status}`);
    return res;
  },
  async (error: AxiosError) => {
    logger.error(`API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
    });
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const requestUrl = original.url ?? '';
    const isRefreshCall = requestUrl.includes('/auth/refresh');

    // Never retry refresh itself — avoids an infinite loop when the cookie is missing/expired.
    if (error.response?.status === 401 && !original._retry && !isRefreshCall) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post<{ accessToken: string }>('/auth/refresh');
        const { accessToken } = data;
        useAuthStore.getState().setAccessToken(accessToken);
        processQueue(null, accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
