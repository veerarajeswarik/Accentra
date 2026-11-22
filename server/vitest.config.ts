import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Read @accentra/shared from its TypeScript source (no build step needed).
    conditions: ['development'],
  },
  ssr: {
    resolve: {
      conditions: ['development'],
      externalConditions: ['development'],
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    globalSetup: ['src/tests/global-setup.ts'],
    setupFiles: ['src/tests/setup-env.ts'],
    // The in-memory MongoDB replica set can take a while to start the first time
    // (it downloads a mongod binary once, then caches it).
    hookTimeout: 120_000,
    testTimeout: 30_000,
  },
});
