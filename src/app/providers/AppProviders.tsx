import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import { theme } from '@/theme';
import { queryClient } from '@/shared/api';
import { ErrorBoundary } from '@/shared/ui';
import { AuthProvider } from '@/entities/user';

export interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset}>
              <BrowserRouter>
                <AuthProvider>{children}</AuthProvider>
              </BrowserRouter>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default AppProviders;
