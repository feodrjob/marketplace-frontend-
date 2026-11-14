import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getAccessToken, setAccessToken, silentRefresh } from '@/shared/api';
import { ENV } from '@/shared/config';
import { getErrorMessage, getValidationErrors } from '@/shared/lib';
import { authApi } from '../api/authApi';
import type { AuthResponse, LoginCredentials, RegisterBuyerData, User } from './types';

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
        token = await silentRefresh();
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

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, unknown, LoginCredentials>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
    },
    onError: (error) => {
      if (getValidationErrors(error)) {
        return;
      }
      notifications.show({
        color: 'red',
        title: 'Ошибка авторизации',
        message: getErrorMessage(error, 'Неверный email или пароль'),
      });
    },
  });
}

export function useRegisterBuyerMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, unknown, RegisterBuyerData>({
    mutationFn: authApi.registerBuyer,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
    },
    onError: (error) => {
      if (getValidationErrors(error)) {
        return;
      }
      notifications.show({
        color: 'red',
        title: 'Ошибка регистрации',
        message: getErrorMessage(error, 'Не удалось завершить регистрацию'),
      });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, void>({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setAccessToken(null);
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, null);
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Ошибка выхода из аккаунта',
        message: getErrorMessage(error, 'Не удалось завершить сессию на сервере'),
      });
    },
  });
}
