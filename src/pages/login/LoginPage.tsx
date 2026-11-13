import {
  Alert,
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/entities/user';
import classes from './LoginPage.module.css';

export function LoginPage() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('buyer@t-market.ru');
  const [password, setPassword] = useState('secret123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.error || 'Ошибка входа');
    }
  };

  // Если авторизован — страница Профиля
  if (isAuthenticated && user) {
    return (
      <Container size={420} my={30}>
        <Title className={classes.title}>Личный кабинет</Title>
        <Text className={classes.subtitle}>Авторизованная сессия (In-Memory JWT)</Text>

        <Paper className={classes.card} p={24} radius="sm" withBorder>
          <Table verticalSpacing="xs" mb="lg">
            <Table.Tbody>
              <Table.Tr>
                <Table.Td w={140} fw={500} fz={13} c="#374151">
                  Имя
                </Table.Td>
                <Table.Td fz={13} c="#111827" fw={600}>
                  {user.name}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={500} fz={13} c="#374151">
                  Email
                </Table.Td>
                <Table.Td fz={13} c="#4b5563">
                  {user.email}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={500} fz={13} c="#374151">
                  Бонусный баланс
                </Table.Td>
                <Table.Td
                  fz={13}
                  c="#085fc6"
                  fw={600}
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {user.bonusBalance.toLocaleString('ru-RU')} бонусов
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={500} fz={13} c="#374151">
                  Роль в системе
                </Table.Td>
                <Table.Td fz={13} c="#4b5563">
                  {user.roles.includes('ROLE_BUYER') ? 'Покупатель (BuyerProfile)' : 'Пользователь'}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>

          <Button variant="light" color="red" fullWidth radius="sm" onClick={logout}>
            Выйти из аккаунта
          </Button>
        </Paper>
      </Container>
    );
  }

  // Если не авторизован — форма входа
  return (
    <Container size={420} my={30}>
      <Title className={classes.title}>Вход в систему</Title>
      <Text className={classes.subtitle}>
        Токен сохраняется в памяти приложения (In-Memory closure)
      </Text>

      <Paper className={classes.card} p={24} radius="sm" withBorder>
        {error && (
          <Alert color="red" mb={16} radius="sm">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              placeholder="user@t-market.ru"
              radius="sm"
            />

            <PasswordInput
              label="Пароль"
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              placeholder="Пароль"
              radius="sm"
            />

            <Button type="submit" color="brandBlue" fullWidth radius="sm" mt="md" loading={loading}>
              Войти
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginPage;
