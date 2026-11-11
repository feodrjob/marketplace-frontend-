import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';
import { useAuth } from '@/entities/user';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
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

  return <Outlet />;
}
