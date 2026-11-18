import { Button, Center, Loader, Paper, Stack, Text } from '@mantine/core';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/entities/user';

export function SellerRoute() {
  const { isAuthenticated, isSeller, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Center mih={240}>
        <Loader size="sm" color="brandBlue" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isSeller) {
    return (
      <Paper p="lg" radius="sm" withBorder ta="center" maw={520} mx="auto">
        <Stack align="center" gap="sm">
          <Text fz={14} c="dimmed">
            Добавлять товары могут только продавцы.
          </Text>
          <Button component={Link} to="/profile" variant="default" size="sm" h={44}>
            Перейти в профиль
          </Button>
        </Stack>
      </Paper>
    );
  }

  return <Outlet />;
}
