import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerMockResponder } from '@/shared/api/mockTransport';
import { App, AppProviders } from './app';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';

async function bootstrap() {
  // Проверяем env напрямую, чтобы Vite вырезал ветку моков из прод-сборки.
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true') {
    const { respondToAuthMock } = await import('@/entities/user/api/authMocks');
    registerMockResponder(respondToAuthMock);
  }

  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <AppProviders>
          <App />
        </AppProviders>
      </React.StrictMode>
    );
  }
}

void bootstrap();
