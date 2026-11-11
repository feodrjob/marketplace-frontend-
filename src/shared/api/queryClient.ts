import { QueryClient } from '@tanstack/react-query';
import { isServerError } from '@/shared/lib';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 минута данные считаются свежими
      gcTime: 1000 * 60 * 5, // 5 минут неактивный кэш удерживается в памяти
      retry: 1, // 1 повторная попытка при сбое сети
      refetchOnWindowFocus: false, // не спамить бэк запросами при смене вкладок
      throwOnError: isServerError,
    },
    mutations: {
      retry: false,
    },
  },
});
