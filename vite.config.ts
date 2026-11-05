import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api/v1': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
