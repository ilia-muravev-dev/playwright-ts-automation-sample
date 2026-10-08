import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.isCI ? 1 : 0,
  workers: env.isCI ? 2 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    baseURL: env.baseURL,
    // The application is marked up with data-test, not data-testid.
    testIdAttribute: 'data-test',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'ui',
      testDir: './tests/ui',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: env.storageStatePath,
      },
    },
    {
      // Smoke only: below the desktop breakpoint this application does not
      // render the product grid at all.
      name: 'ui-mobile',
      testDir: './tests/ui',
      grep: /@mobile/,
      dependencies: ['setup'],
      use: {
        ...devices['Pixel 7'],
        storageState: env.storageStatePath,
      },
    },
    {
      // No browser is started for this project.
      name: 'api',
      testDir: './tests/api',
    },
  ],
});
