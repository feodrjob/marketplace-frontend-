import type { AxiosRequestConfig } from 'axios';
import { apiClient } from './client';
import { respondWithMock } from './mockTransport';

/**
 * Транспорт для сгенерированных Orval функций.
 * baseURL сбрасываем: в OpenAPI пути уже начинаются с /api/v1,
 * а у apiClient baseURL тоже /api/v1.
 */
export const orvalClient = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const request = { ...config, ...options, baseURL: '' };
  const mock = await respondWithMock<T>(request);

  if (mock.handled) {
    return mock.data;
  }

  const response = await apiClient.request<T>(request);
  return response.data;
};
