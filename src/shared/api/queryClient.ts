import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 минута данные считаются свежими
      gcTime: 1000 * 60 * 5, // 5 минут неактивный кэш удерживается в памяти
      retry: 1, // 1 повторная попытка при сбое сети
      refetchOnWindowFocus: false, // не спамить бэк запросами при смене вкладок
      // Любая ошибка query пробрасывается в ErrorBoundary.
      // Ожидаемые доменные состояния (например, 401 = нет сессии)
      // обрабатываются внутри queryFn и возвращаются как null.
      throwOnError: true,
    },
    mutations: {
      retry: false,
    },
  },
});
