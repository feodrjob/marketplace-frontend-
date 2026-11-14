import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/entities/user';
import { queryClient } from '@/shared/api';
import { ErrorBoundary } from '@/shared/ui';
import { theme } from '@/theme';

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
