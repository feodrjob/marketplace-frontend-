import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Badge,
  Group,
  SimpleGrid,
  Divider,
} from '@mantine/core';
import { useAuth, useLogoutMutation } from '@/entities/user';
import { Formatter } from '@/shared/lib';

export function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
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
        Авторизованная сессия (JWT + Silent Refresh через HttpOnly Cookie)
      </Text>

      <Paper p={24} radius="sm" withBorder mt={20} bg="white">
        <Group justify="space-between" mb="md">
          <Text fw={600} fz={15}>
            Профиль покупателя
          </Text>
          <Badge color="brandBlue" variant="light" size="sm">
            Покупатель
          </Badge>
        </Group>

        <Divider mb="md" />

        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="xs" verticalSpacing="sm" mb="lg">
          <Text fz={13} fw={500} c="dimmed">
            Имя
          </Text>
          <Text fz={13} fw={600}>
            {user.name}
          </Text>

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
            Бонусный баланс
          </Text>
          <Text
            fz={13}
            c="brandBlue.6"
            fw={600}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {Formatter.bonus(user.bonusBalance)}
          </Text>

          <Text fz={13} fw={500} c="dimmed">
            ID покупателя
          </Text>
          <Text fz={12} c="dimmed" ff="monospace">
            {user.buyerId}
          </Text>
        </SimpleGrid>

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
