import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.js'],
    setupFiles: ['test/setup.js'],
    clearMocks: true,
    restoreMocks: true,
  },
  coverage: {
    provider: 'v8',
    reporter: ['text', 'lcov', 'html'],
    reportsDirectory: 'coverage',
    include: [
      'discourse/**/*.js',
      'matrix/**/*.js',
      'telegram/**/*.js',
      'module/**/*.js',
    ],
  },
});
