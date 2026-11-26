import { defineConfig } from 'orval';

export default defineConfig({
  auth: {
    input: {
      target: './openapi/auth.yaml',
    },
    output: {
      target: './src/shared/api/generated/auth.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'single',
      override: {
        mutator: {
          path: './src/shared/api/orvalClient.ts',
          name: 'orvalClient',
        },
      },
    },
  },
});
