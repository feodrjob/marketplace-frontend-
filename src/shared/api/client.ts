import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ELocalKey, ENV } from '@/shared/config';

/**
 * Хранение access-токена в localStorage для мгновенного восстановления сессии при F5.
 * Долгоживущий refresh-токен остаётся под контролем бэкенда в HttpOnly Cookie.
 */
export const setAccessToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem(ELocalKey.ACCESS_TOKEN, token);
  } else {
    localStorage.removeItem(ELocalKey.ACCESS_TOKEN);
  }
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ELocalKey.ACCESS_TOKEN);
};

// Базовый клиент Axios
export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true, // КРИТИЧНО: автоматическая отправка HttpOnly Cookie (refresh-токен)
  headers: {
    'Content-Type': 'application/json'
  }
});

// Перехватчик запросов: автоматическая инъекция JWT Bearer токена
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Очередь запросов, ожидающих завершения обновления токена
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Функция тихого обновления access-токена (Silent Refresh).
 * Браузер сам прикрепляет HttpOnly Cookie с refresh-токеном.
 */
export const silentRefresh = async (): Promise<string | null> => {
  try {
    const response = await axios.post<{ accessToken: string }>(
      `${ENV.API_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const newToken = response.data.accessToken;
    setAccessToken(newToken);
    return newToken;
  } catch {
    setAccessToken(null);
    return null;
  }
};

// Перехватчик ответов: реактивная обработка 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    // Если получили 401 Unauthorized и это не сам запрос рефреша
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // Если рефреш уже выполняется другим запросом — ждём в очереди
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await silentRefresh();
        if (newToken) {
          processQueue(null, newToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        } else {
          processQueue(error, null);
          return Promise.reject(error);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
