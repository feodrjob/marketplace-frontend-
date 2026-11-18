import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterBuyerData,
  RegisterSellerData,
} from '@/entities/user';
import { AUTH_QUERY_KEYS, authApi } from '@/entities/user';
import { setAccessToken } from '@/shared/api';
import { getErrorMessage, getValidationErrors } from '@/shared/lib';

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

export function useRegisterSellerMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, unknown, RegisterSellerData>({
    mutationFn: authApi.registerSeller,
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
        title: 'Ошибка регистрации продавца',
        message: getErrorMessage(error, 'Не удалось создать профиль продавца'),
      });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, void>({
    mutationFn: authApi.logout,
    // Локальная сессия сбрасывается в любом случае: если сервер не ответил,
    // пользователь не должен остаться в интерфейсе с валидным access-токеном.
    onSettled: () => {
      setAccessToken(null);
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, null);
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== 'user',
      });
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
