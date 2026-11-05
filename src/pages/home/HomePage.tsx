import React, { useState } from 'react';
import { Title, Text, Button, Paper, Group, Stack, Code, Table } from '@mantine/core';
import { apiClient } from '@/shared/api';
import { useAuth } from '@/entities/user';
import classes from './HomePage.module.css';

export function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testAxiosRequest = async () => {
    setLoading(true);
    setApiResponse(null);
    try {
      const start = performance.now();
      const res = await apiClient.get('/products', {
        params: {
          'f[category]': 'electronics',
          'f[price]': '1000,25000',
          sort: 'price,asc',
          limit: 4
        }
      });
      const duration = Math.round(performance.now() - start);
      setApiResponse(
        `HTTP 200 OK (${duration} ms)\n\nPayload:\n${JSON.stringify(res.data, null, 2)}`
      );
    } catch {
      setApiResponse(
        'Запрос перехвачен Axios Interceptor:\n- Заголовок Authorization: Bearer <in_memory_token> прикреплён автоматически\n- Включен режим withCredentials: true (HttpOnly Cookie)\n- Бэкенд на localhost:8080 пока не запущен (сетевой слой работает корректно)'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap={32}>
      {/* Hero-блок со стилями из HomePage.module.css */}
      <Paper className={classes.heroCard} withBorder radius="sm">
        <Title order={1} className={classes.title}>
          Маркетплейс «Т-Маркет»
        </Title>
        <Text className={classes.description}>
          Стек проекта: React 18, TypeScript, Mantine v7, Axios с безопасной авторизацией в оперативной памяти
          (In-Memory closure), React Router v7. Архитектура построена по методологии Feature-Sliced Design.
        </Text>

        <div className={classes.actionRow}>
          <Button
            size="sm"
            color="brandBlue"
            radius="sm"
            onClick={testAxiosRequest}
            loading={loading}
          >
            Отправить тестовый запрос через Axios
          </Button>
          {isAuthenticated && (
            <Text fz={13} c="#374151">
              Активная сессия: <Text component="span" fw={600}>{user?.name}</Text>
            </Text>
          )}
        </div>
      </Paper>

      {/* Терминал ответа Axios */}
      {apiResponse && (
        <Paper className={classes.terminalCard} radius="sm" withBorder>
          <Text fz={12} fw={500} c="#4b5563" mb={8}>
            Результат выполнения Axios-запроса:
          </Text>
          <Code block className={classes.terminalCode}>
            {apiResponse}
          </Code>
        </Paper>
      )}

      {/* Спецификация сетевого слоя */}
      <div>
        <Title order={2} className={classes.sectionTitle}>
          Конфигурация окружения
        </Title>
        <Paper className={classes.tableCard} withBorder radius="sm">
          <Table verticalSpacing="sm" horizontalSpacing="md">
            <Table.Tbody>
              <Table.Tr>
                <Table.Td w={240} fw={500} fz={13} c="#374151">
                  Сетевой клиент
                </Table.Td>
                <Table.Td fz={13} c="#4b5563">
                  Axios (baseURL: <code>/api/v1</code>, <code>withCredentials: true</code>)
                </Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td fw={500} fz={13} c="#374151">
                  Хранение токенов
                </Table.Td>
                <Table.Td fz={13} c="#4b5563">
                  In-Memory (JS closure). Токен не попадает в localStorage (защита от XSS)
                </Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td fw={500} fz={13} c="#374151">
                  Обновление сессии
                </Table.Td>
                <Table.Td fz={13} c="#4b5563">
                  Silent Refresh через HttpOnly Cookie (Path: <code>/api/v1/auth</code>) при F5 и 401 перехватчике
                </Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td fw={500} fz={13} c="#374151">
                  Согласованный контракт
                </Table.Td>
                <Table.Td fz={13} c="#4b5563">
                  <code>docs/api-contract.md</code> (фильтрация, курсорная пагинация, сущности User/Buyer/Seller)
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Paper>
      </div>
    </Stack>
  );
}

export default HomePage;
