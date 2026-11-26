import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import type { UserProfile } from '@/entities/user';
import { setAccessToken } from '@/shared/api';
import {
  getGetCurrentUserQueryKey,
  useLogin,
  useLogout,
  useRegisterBuyer,
} from '@/shared/api/generated/auth';
import { getErrorMessage, getValidationErrors } from '@/shared/lib';

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useLogin({
    mutation: {
      onSuccess: (data) => {
        setAccessToken(data.accessToken);
        queryClient.setQueryData(getGetCurrentUserQueryKey(), data.user);
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
    },
  });
}

export function useRegisterBuyerMutation() {
  const queryClient = useQueryClient();

  return useRegisterBuyer({
    mutation: {
      onSuccess: (data) => {
        setAccessToken(data.accessToken);
        queryClient.setQueryData(getGetCurrentUserQueryKey(), data.user);
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
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useLogout({
    mutation: {
      // Локальная сессия сбрасывается в любом случае: если сервер не ответил,
      // пользователь не должен остаться в интерфейсе с валидным access-токеном.
      onSettled: () => {
        setAccessToken(null);
        const profileKey = getGetCurrentUserQueryKey();
        // setQueryData с null сразу уведомляет AuthProvider, clear() этого не делает.
        queryClient.setQueryData(profileKey, null as unknown as UserProfile);
        queryClient.removeQueries({
          predicate: (query) => query.queryKey[0] !== profileKey[0],
        });
      },
      onError: (error) => {
        notifications.show({
          color: 'red',
          title: 'Ошибка выхода из аккаунта',
          message: getErrorMessage(error, 'Не удалось завершить сессию на сервере'),
        });
      },
    },
  });
}
