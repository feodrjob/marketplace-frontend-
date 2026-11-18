import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const scrollPositions = new Map<string, number>();

/**
 * Возвращает страницу туда, где пользователь её оставил.
 * При переходе вперёд — наверх, при возврате назад — на прошлую позицию.
 */
function restoreScroll(top: number, attemptsLeft = 60) {
  window.scrollTo(0, top);

  if (attemptsLeft <= 0 || Math.abs(window.scrollY - top) <= 1) {
    return;
  }

  // Контент может дорисовываться после возврата (ленивый чанк, данные из кеша),
  // поэтому пробуем ещё несколько кадров, пока высота документа не позволит.
  requestAnimationFrame(() => restoreScroll(top, attemptsLeft - 1));
}

export function ScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    if (navigationType === 'POP') {
      const saved = scrollPositions.get(location.key);
      if (saved !== undefined) {
        restoreScroll(saved);
        return;
      }
    }

    window.scrollTo(0, 0);
  }, [location.key, navigationType]);

  useLayoutEffect(() => {
    const key = location.key;
    const savePosition = () => scrollPositions.set(key, window.scrollY);

    window.addEventListener('scroll', savePosition, { passive: true });

    return () => {
      savePosition();
      window.removeEventListener('scroll', savePosition);
    };
  }, [location.key]);

  return null;
}
