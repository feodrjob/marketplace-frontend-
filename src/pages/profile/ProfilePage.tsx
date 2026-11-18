import {
  Badge,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/entities/user';
import { useLogoutMutation } from '@/features/auth-by-email';

export function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  if (!user) {
    return null;
  }

  const roleLabel =
    user.role === 'SELLER' ? 'Продавец' : user.role === 'ADMIN' ? 'Администратор' : 'Покупатель';

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      // Уходим на логин независимо от ответа сервера:
      // локальная сессия уже сброшена в onSettled мутации.
      onSettled: () => {
        navigate('/login', { replace: true });
      },
    });
  };

  return (
    <Container size={480} my={30}>
      <Title order={1} ta="center" fz={22} fw={600}>
        Личный кабинет
      </Title>
      <Text fz={13} c="dimmed" ta="center" mt={4}>
        Данные вашего аккаунта
      </Text>

      <Paper p={24} radius="sm" withBorder mt={20} bg="white">
        <Group justify="space-between" mb="md">
          <Text fw={600} fz={15}>
            Профиль
          </Text>
          <Badge color="brandBlue" variant="light" size="sm">
            {roleLabel}
          </Badge>
        </Group>

        <Divider mb="md" />

        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="xs" verticalSpacing="sm" mb="lg">
          {user.fullName && (
            <>
              <Text fz={13} fw={500} c="dimmed">
                Имя
              </Text>
              <Text fz={13} fw={600}>
                {user.fullName}
              </Text>
            </>
          )}

          <Text fz={13} fw={500} c="dimmed">
            Email
          </Text>
          <Text fz={13}>{user.email}</Text>

          {user.phone && (
            <>
              <Text fz={13} fw={500} c="dimmed">
                Телефон
              </Text>
              <Text fz={13}>{user.phone}</Text>
            </>
          )}

          <Text fz={13} fw={500} c="dimmed">
            Роль
          </Text>
          <Text fz={13}>{roleLabel}</Text>

          {user.role === 'SELLER' && user.companyName && (
            <>
              <Text fz={13} fw={500} c="dimmed">
                Компания
              </Text>
              <Text fz={13}>{user.companyName}</Text>
            </>
          )}

          {user.role === 'SELLER' && user.inn && (
            <>
              <Text fz={13} fw={500} c="dimmed">
                ИНН
              </Text>
              <Text fz={13}>{user.inn}</Text>
            </>
          )}

          {user.role === 'SELLER' && user.description && (
            <>
              <Text fz={13} fw={500} c="dimmed">
                Описание
              </Text>
              <Text fz={13}>{user.description}</Text>
            </>
          )}

          {user.role === 'ADMIN' && user.department && (
            <>
              <Text fz={13} fw={500} c="dimmed">
                Отдел
              </Text>
              <Text fz={13}>{user.department}</Text>
            </>
          )}
        </SimpleGrid>

        {user.role === 'SELLER' && (
          <Button
            component={Link}
            to="/seller/products/new"
            color="brandBlue"
            fullWidth
            radius="sm"
            h={44}
            mb="sm"
          >
            Добавить товар
          </Button>
        )}

        <Button
          variant="light"
          color="red"
          fullWidth
          radius="sm"
          onClick={handleLogout}
          loading={logoutMutation.isPending}
        >
          Выйти из аккаунта
        </Button>
      </Paper>
    </Container>
  );
}

export default ProfilePage;
