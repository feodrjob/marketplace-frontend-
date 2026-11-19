import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
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
    'Content-Type': 'application/json',
  },
});

// Перехватчик запросов: автоматическая инъекция JWT Bearer токена
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Единый промис обновления access-токена.
 * Все параллельные 401 и старт приложения ждут один и тот же запрос,
 * чтобы не ловить гонку с ротацией refresh-токена на бэкенде.
 */
let refreshPromise: Promise<string | null> | null = null;

export function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ accessToken?: unknown }>(`${ENV.API_URL}/auth/refresh`, {}, { withCredentials: true })
      .then(({ data }) => {
        if (typeof data?.accessToken !== 'string' || !data.accessToken) {
          return null;
        }
        setAccessToken(data.accessToken);
        return data.accessToken;
      })
      .catch((error: unknown) => {
        // 401/403 — refresh отозван или истёк, сессию нужно сбросить.
        // Сетевую ошибку не считаем разлогином: access-токен остаётся.
        if (
          axios.isAxiosError(error) &&
          (error.response?.status === 401 || error.response?.status === 403)
        ) {
          setAccessToken(null);
        }
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// Обратная совместимость: раньше функция называлась silentRefresh.
export const silentRefresh = refreshAccessToken;

// На этих ручках 401 — это бизнес-ошибка, а не истёкшая сессия.
const SKIP_REFRESH = /\/auth\/(login|register|refresh|logout)/;

// Перехватчик ответов: реактивная обработка 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      SKIP_REFRESH.test(originalRequest.url ?? '')
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Все параллельные 401 ждут один и тот же refresh.
    const newToken = await refreshAccessToken();
    if (!newToken) {
      return Promise.reject(error);
    }

    if (originalRequest.headers) {
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
    }
    return apiClient(originalRequest);
  }
);

export default apiClient;
