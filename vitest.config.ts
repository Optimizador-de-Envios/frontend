import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.spec.ts', 'tests/**/*.spec.tsx'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.ts'],
  },
})
