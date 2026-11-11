import axios from 'axios';

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  details?: Record<string, string>;
  instance?: string;
  timestamp?: string;
}

export function getValidationErrors(error: unknown): Record<string, string> | null {
  if (!axios.isAxiosError<ProblemDetails>(error)) {
    return null;
  }

  const status = error.response?.status;
  const details = error.response?.data?.details;

  if (status === 422 && details && typeof details === 'object' && !Array.isArray(details)) {
    return details;
  }

  return null;
}

export function getErrorMessage(
  error: unknown,
  fallback = 'Произошла ошибка. Попробуйте повторить позже.'
): string {
  if (axios.isAxiosError<ProblemDetails>(error)) {
    const data = error.response?.data;
    if (data?.detail) {
      return data.detail;
    }
    if (data?.title) {
      return data.title;
    }
    if (!error.response) {
      return 'Сервер недоступен. Проверьте подключение или настройки API.';
    }
    return fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

/**
 * Пропускает в ErrorBoundary только критичные серверные сбои (5xx)
 * и неожиданные ошибки выполнения, чтобы ожидаемые 4xx (например, 401/422)
 * обрабатывались локально в компонентах или формах.
 */
export function isServerError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    return status !== undefined && status >= 500;
  }

  return true;
}
