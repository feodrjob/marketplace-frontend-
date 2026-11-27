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
    const [{ respondToAuthMock }, { respondToProductMock }] = await Promise.all([
      import('@/entities/user/api/authMocks'),
      import('@/entities/product/api/productMocks'),
    ]);

    registerMockResponder((config) => {
      const url = config.url ?? '';
      return url.startsWith('/api/v1/catalog/')
        ? respondToProductMock(config)
        : respondToAuthMock(config);
    });
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
