const API_URL = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/+$/, '');

export const ENV = {
  API_URL,
  // Моки доступны только в dev и только при явном флаге.
  // В production-сборке всегда false, даже если .env содержит VITE_USE_MOCKS=true.
  USE_MOCKS: import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true',
} as const;
