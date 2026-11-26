import type { AxiosRequestConfig } from 'axios';
import { apiClient } from './client';

/**
 * Транспорт для сгенерированных Orval функций.
 * baseURL сбрасываем: в OpenAPI пути уже начинаются с /api/v1,
 * а у apiClient baseURL тоже /api/v1.
 */
export const orvalClient = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.request<T>({
    ...config,
    ...options,
    baseURL: '',
  });
  return response.data;
};
