import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getAccessToken, refreshAccessToken, setAccessToken } from '@/shared/api';
import { ENV } from '@/shared/config';
import { authApi } from '../api/authApi';
import type { User } from './types';

export const AUTH_QUERY_KEYS = {
  all: ['user'] as const,
  profile: ['user', 'profile'] as const,
} as const;

export function useCurrentUserQuery() {
  return useQuery<User | null>({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: async () => {
      if (ENV.USE_MOCKS) {
        return getAccessToken() ? authApi.getProfile() : null;
      }

      let token = getAccessToken();
      if (!token) {
        token = await refreshAccessToken();
      }
      if (!token) {
        return null;
      }

      try {
        return await authApi.getProfile();
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          (error.response?.status === 401 || error.response?.status === 403)
        ) {
          setAccessToken(null);
          return null;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
