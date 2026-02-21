import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['discourse/**/*.js', 'telegram/**/*.js', 'matrix/**/*.js', 'module/**/*.js'],
      exclude: ['**/generate_matrix_token.js']
    }
  }
});
