import { Center, Loader } from '@mantine/core';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/entities/user';
import { getSafeRedirect } from '@/shared/lib';

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Center mih={240}>
        <Loader size="sm" color="brandBlue" />
      </Center>
    );
  }

  if (isAuthenticated) {
    const from = (location.state as LocationState | null)?.from?.pathname;
    const redirectTo =
      from === '/login' || from === '/register' ? '/profile' : getSafeRedirect(from, '/profile');
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
