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

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((item) => typeof item === 'string')
  );
}

export function getValidationErrors(error: unknown): Record<string, string> | null {
  if (!axios.isAxiosError<ProblemDetails>(error)) {
    return null;
  }

  const status = error.response?.status;
  const details = error.response?.data?.details;

  if (status === 422 && isStringRecord(details)) {
    return details;
  }

  return null;
}

export function getErrorMessage(
  error: unknown,
  fallback = 'Произошла ошибка. Попробуйте повторить позже.'
): string {
  if (axios.isAxiosError<ProblemDetails>(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    // Текст от бэкенда показываем только для клиентских ошибок (4xx).
    // Для 5xx detail может содержать внутренние детали, поэтому — только fallback.
    if (status === undefined || status < 500) {
      if (typeof data?.detail === 'string' && data.detail.trim()) {
        return data.detail;
      }
      if (typeof data?.title === 'string' && data.title.trim()) {
        return data.title;
      }
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
