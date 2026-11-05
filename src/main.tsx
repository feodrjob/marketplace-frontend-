import React from 'react';
import ReactDOM from 'react-dom/client';
import { App, AppProviders } from './app';
import '@mantine/core/styles.css';
import './index.css';

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
