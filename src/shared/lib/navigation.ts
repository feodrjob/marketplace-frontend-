/**
 * Проверяет, что путь ведёт внутрь приложения.
 * Отсекает абсолютные URL, protocol-relative `//host` и `javascript:`,
 * чтобы редирект после логина нельзя было увести на чужой сайт.
 */
export function getSafeRedirect(path: unknown, fallback: string): string {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) {
    return fallback;
  }
  return path;
}
