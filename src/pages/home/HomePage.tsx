import { Alert, Button, Code, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useAuth } from '@/entities/user';
import { apiClient } from '@/shared/api';
import { getErrorMessage } from '@/shared/lib';
import classes from './HomePage.module.css';

const ENVIRONMENT_SPECS = [
  {
    label: 'Сетевой клиент',
    value: 'Axios (baseURL: /api/v1, withCredentials: true)',
  },
  {
    label: 'Серверное состояние',
    value: 'TanStack Query v5 (useQuery, useMutation, фильтрованный throwOnError)',
  },
  {
    label: 'Хранение токенов',
    value:
      'Access-токен в localStorage (ELocalKey.ACCESS_TOKEN) + Silent Refresh через HttpOnly Cookie',
  },
  {
    label: 'Валидация форм',
    value: '@mantine/form + Zod + серверные ошибки RFC 7807 (422 details)',
  },
] as const;

export function HomePage() {
  const { user, isAuthenticated } = useAuth();

  const testRequestMutation = useMutation({
    mutationFn: async () => {
      const start = performance.now();
      const res = await apiClient.get('/products', {
        params: {
          'f[category]': 'electronics',
          'f[price]': '1000,25000',
          sort: 'price,asc',
          limit: 4,
        },
      });
      const duration = Math.round(performance.now() - start);
      return `HTTP 200 OK (${duration} ms)\n\nPayload:\n${JSON.stringify(res.data, null, 2)}`;
    },
  });

  return (
    <Stack gap={32}>
      {/* Hero-блок */}
      <Paper className={classes.heroCard} withBorder radius="sm">
        <Title order={1} className={classes.title}>
          Маркетплейс «Т-Маркет»
        </Title>
        <Text className={classes.description}>
          Стек проекта: React 18, TypeScript, Mantine v7, TanStack Query v5, Axios с
          Bearer-авторизацией и Silent Refresh через HttpOnly Cookie, React Router v7. Архитектура
          построена по методологии Feature-Sliced Design.
        </Text>

        <div className={classes.actionRow}>
          <Button
            size="sm"
            color="brandBlue"
            radius="sm"
            onClick={() => testRequestMutation.mutate()}
            loading={testRequestMutation.isPending}
          >
            Отправить тестовый запрос через Axios
          </Button>
          {isAuthenticated && (
            <Text fz={13} c="dimmed">
              Активная сессия:{' '}
              <Text component="span" fw={600} c="var(--mantine-color-text)">
                {user?.name}
              </Text>
            </Text>
          )}
        </div>
      </Paper>

      {/* Результат мутации тестового запроса */}
      {testRequestMutation.data && (
        <Paper className={classes.terminalCard} radius="sm" withBorder>
          <Text fz={12} fw={500} c="dimmed" mb={8}>
            Результат выполнения Axios-запроса:
          </Text>
          <Code block className={classes.terminalCode}>
            {testRequestMutation.data}
          </Code>
        </Paper>
      )}

      {testRequestMutation.isError && (
        <Alert color="red" radius="sm" title="Запрос завершился с ошибкой">
          <Text fz={13}>{getErrorMessage(testRequestMutation.error)}</Text>
        </Alert>
      )}

      {/* Спецификация сетевого слоя */}
      <div>
        <Title order={2} className={classes.sectionTitle}>
          Конфигурация окружения
        </Title>
        <Paper p="md" withBorder radius="sm" bg="white">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="sm">
            {ENVIRONMENT_SPECS.map((spec) => (
              <React.Fragment key={spec.label}>
                <Text fw={500} fz={13} c="dimmed">
                  {spec.label}
                </Text>
                <Text fz={13}>{spec.value}</Text>
              </React.Fragment>
            ))}
          </SimpleGrid>
        </Paper>
      </div>
    </Stack>
  );
}

export default HomePage;
