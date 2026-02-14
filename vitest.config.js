import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Browser mode configuration
    browser: {
      enabled: true,
      provider: 'playwright',
      name: 'chromium',
      headless: true,
    },
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['js/**/*.js'],
      exclude: [],
    },
    // Test file pattern
    include: ['tests/**/*.test.js'],
  },
})
