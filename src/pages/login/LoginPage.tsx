import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
  Table,
  SegmentedControl,
  Checkbox,
  Anchor,
  Badge,
  Group
} from '@mantine/core';
import { useAuth } from '@/entities/user';
import classes from './LoginPage.module.css';

interface LoginPageProps {
  initialMode?: 'login' | 'register';
}

export function LoginPage({ initialMode }: LoginPageProps) {
  const { user, isAuthenticated, login, registerBuyer, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'login' | 'register'>(
    initialMode || (location.pathname === '/register' ? 'register' : 'login')
  );

  // Синхронизируем состояние вкладки с текущим URL
  useEffect(() => {
    if (location.pathname === '/register') {
      setMode('register');
    } else if (location.pathname === '/login') {
      setMode('login');
    }
  }, [location.pathname]);

  // Поля авторизации
  const [loginEmail, setLoginEmail] = useState('buyer@t-market.ru');
  const [loginPassword, setLoginPassword] = useState('secret123');

  // Поля регистрации покупателя
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regTerms, setRegTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      setError('Заполните email и пароль');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await login(loginEmail, loginPassword);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.error || 'Неверный email или пароль');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regFullName.trim()) {
      setError('Введите ваше имя или ФИО');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setError('Введите корректный email адрес');
      return;
    }

    if (regPassword.length < 6) {
      setError('Пароль должен содержать не менее 6 символов');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!regTerms) {
      setError('Необходимо согласиться с условиями использования');
      return;
    }

    setLoading(true);

    const res = await registerBuyer({
      email: regEmail.trim(),
      password: regPassword,
      fullName: regFullName.trim(),
      phone: regPhone.trim() || undefined
    });

    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.error || 'Ошибка при регистрации');
    }
  };

  // Если авторизован — страница Профиля
  if (isAuthenticated && user) {
    return (
      <Container size={440} my={30}>
        <Title className={classes.title}>Личный кабинет</Title>
        <Text className={classes.subtitle}>
          Авторизованная сессия (In-Memory JWT + Silent Refresh)
        </Text>

        <Paper className={classes.card} p={24} radius="sm" withBorder>
          <Group justify="space-between" mb="md">
            <Text fw={600} fz={15} c="#111827">
              Профиль покупателя
            </Text>
            <Badge color="brandBlue" variant="light" size="sm">
              Покупатель
            </Badge>
          </Group>

          <Table verticalSpacing="xs" mb="lg">
            <Table.Tbody>
              <Table.Tr>
                <Table.Td w={140} fw={500} fz={13} c="#374151">Имя</Table.Td>
                <Table.Td fz={13} c="#111827" fw={600}>{user.name}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={500} fz={13} c="#374151">Email</Table.Td>
                <Table.Td fz={13} c="#4b5563">{user.email}</Table.Td>
              </Table.Tr>
              {user.phone && (
                <Table.Tr>
                  <Table.Td fw={500} fz={13} c="#374151">Телефон</Table.Td>
                  <Table.Td fz={13} c="#4b5563">{user.phone}</Table.Td>
                </Table.Tr>
              )}
              <Table.Tr>
                <Table.Td fw={500} fz={13} c="#374151">Бонусный баланс</Table.Td>
                <Table.Td fz={13} c="#085fc6" fw={600} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {user.bonusBalance.toLocaleString('ru-RU')} бонусов
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={500} fz={13} c="#374151">ID покупателя</Table.Td>
                <Table.Td fz={12} c="#6b7280" style={{ fontFamily: 'monospace' }}>
                  {user.buyerId}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>

          <Button
            variant="light"
            color="red"
            fullWidth
            radius="sm"
            onClick={logout}
          >
            Выйти из аккаунта
          </Button>
        </Paper>
      </Container>
    );
  }

  // Если не авторизован — Вход или Регистрация покупателя
  return (
    <Container size={440} my={30}>
      <Title className={classes.title}>
        {mode === 'login' ? 'Вход в Т-Маркет' : 'Регистрация покупателя'}
      </Title>
      <Text className={classes.subtitle}>
        {mode === 'login'
          ? 'Войдите в личный кабинет с безопасным JWT-токеном'
          : 'Создайте аккаунт покупателя и делайте покупки на маркетплейсе'}
      </Text>

      <Paper className={classes.card} p={24} radius="sm" withBorder>
        <SegmentedControl
          fullWidth
          radius="sm"
          value={mode}
          onChange={(val) => {
            setError(null);
            setMode(val as 'login' | 'register');
          }}
          data={[
            { label: 'Вход', value: 'login' },
            { label: 'Регистрация', value: 'register' }
          ]}
          className={classes.segmented}
        />

        {error && (
          <Alert color="red" mb={16} radius="sm">
            {error}
          </Alert>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <Stack gap="md">
              <TextInput
                label="Email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.currentTarget.value)}
                placeholder="buyer@t-market.ru"
                radius="sm"
              />

              <PasswordInput
                label="Пароль"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.currentTarget.value)}
                placeholder="Ваш пароль"
                radius="sm"
              />

              <Button
                type="submit"
                color="brandBlue"
                fullWidth
                radius="sm"
                mt="xs"
                loading={loading}
              >
                Войти
              </Button>
            </Stack>

            <Text className={classes.footerSwitch}>
              Нет аккаунта?{' '}
              <Anchor
                component="button"
                type="button"
                size="sm"
                onClick={() => {
                  setError(null);
                  setMode('register');
                }}
              >
                Зарегистрироваться
              </Anchor>
            </Text>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <Stack gap="sm">
              <TextInput
                label="Имя и Фамилия"
                required
                placeholder="Иван Иванов"
                value={regFullName}
                onChange={(e) => setRegFullName(e.currentTarget.value)}
                radius="sm"
              />

              <TextInput
                label="Email"
                type="email"
                required
                placeholder="buyer@t-market.ru"
                value={regEmail}
                onChange={(e) => setRegEmail(e.currentTarget.value)}
                radius="sm"
              />

              <TextInput
                label="Телефон"
                type="tel"
                placeholder="+7 (999) 000-00-00"
                value={regPhone}
                onChange={(e) => setRegPhone(e.currentTarget.value)}
                radius="sm"
              />

              <PasswordInput
                label="Пароль"
                required
                placeholder="Не менее 6 символов"
                value={regPassword}
                onChange={(e) => setRegPassword(e.currentTarget.value)}
                radius="sm"
              />

              <PasswordInput
                label="Повторите пароль"
                required
                placeholder="Повтор пароля"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.currentTarget.value)}
                radius="sm"
              />

              <Checkbox
                label="Согласен с правилами сервиса и обработкой данных"
                checked={regTerms}
                onChange={(e) => setRegTerms(e.currentTarget.checked)}
                size="xs"
                mt="xs"
              />

              <Button
                type="submit"
                color="brandBlue"
                fullWidth
                radius="sm"
                mt="sm"
                loading={loading}
              >
                Зарегистрироваться
              </Button>
            </Stack>

            <Text className={classes.footerSwitch}>
              Уже есть аккаунт?{' '}
              <Anchor
                component="button"
                type="button"
                size="sm"
                onClick={() => {
                  setError(null);
                  setMode('login');
                }}
              >
                Войти в аккаунт
              </Anchor>
            </Text>
          </form>
        )}
      </Paper>

      {mode === 'register' && (
        <Text fz={12} c="#6b7280" ta="center" mt="md">
          Хотите продавать товары? Кабинет продавца настраивается отдельно.
        </Text>
      )}
    </Container>
  );
}

export default LoginPage;
