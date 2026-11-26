import { getAccessToken } from '@/shared/api';
import { useGetCurrentUser } from '@/shared/api/generated/auth';
import { ENV } from '@/shared/config';
import type { User } from './types';

export function useCurrentUserQuery() {
  const query = useGetCurrentUser({
    query: {
      staleTime: 1000 * 60 * 5,
      retry: false,
      // В моках нет refresh-cookie: без токена профиль не запрашиваем.
      enabled: ENV.USE_MOCKS ? Boolean(getAccessToken()) : true,
    },
  });

  return { ...query, data: (query.data ?? null) as User | null };
}
