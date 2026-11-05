import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Хранение access-токена ИСКЛЮЧИТЕЛЬНО в оперативной памяти модуля (JS closure).
 * Токен не сохраняется в localStorage/sessionStorage, что исключает его кражу через XSS.
 */
let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  inMemoryAccessToken = token;
};

export const getAccessToken = (): string | null => {
  return inMemoryAccessToken;
};

// Базовый клиент Axios
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true, // КРИТИЧНО: автоматическая отправка HttpOnly Cookie (refresh-токен)
  headers: {
    'Content-Type': 'application/json'
  }
});

// Перехватчик запросов: автоматическая инъекция JWT Bearer токена из памяти
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (inMemoryAccessToken && config.headers) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
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
      `${import.meta.env.VITE_API_URL || '/api/v1'}/auth/refresh`,
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
