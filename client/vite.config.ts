/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defaultClientConditions, defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // 'development' makes @accentra/shared resolve to its TypeScript source (no build step).
    conditions: ['development', ...defaultClientConditions],
  },
  server: {
    port: 5173,
    strictPort: true,
    // The browser always calls same-origin /api/v1/...; Vite forwards it to Express.
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test/setup.ts'],
  },
});
