import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.GOS_E2E_BASE_URL?.trim() || 'http://127.0.0.1:3100';
const reuseExistingServer = process.env.GOS_E2E_REUSE_SERVER === 'true';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  // Webpack dev compilation and server actions on Windows can exceed the defaults.
  // Keep value/security assertions intact while bounding the complete interaction.
  timeout: 90000,
  expect: { timeout: 20000 },
  globalSetup:
    process.env.GOS_E2E_WARM_ROUTES === 'true' ? './scripts/warm-preview-routes.ts' : undefined,
  reporter: 'list',
  outputDir: process.env.GOS_E2E_OUTPUT_DIR || 'test-results',
  use: {
    baseURL,
    navigationTimeout: 60000,
    actionTimeout: 30000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: reuseExistingServer
    ? undefined
    : {
        command:
          process.env.GOS_E2E_WEBPACK === 'true'
            ? 'npm run dev -- --webpack --port 3100'
            : 'npm run dev -- --port 3100',
        url: baseURL + '/api/v1/health/live',
        reuseExistingServer: false,
        timeout: 120_000,
        env: {
          ENVIRONMENT: 'development',
          LOG_LEVEL: 'error',
          DATABASE_URL: '',
          DATA_DATABASE_URL: '',
          ONBOARDING_DATABASE_URL: '',
          OWNER_ENROLLMENT_DATABASE_URL: '',
          IDENTITY_EVENTS_DATABASE_URL: '',
          BILLING_FIXED_DATABASE_URL: '',
          BILLING_FIXED_WORKER_DATABASE_URL: '',
          SOCIAL_FIXED_DATABASE_URL: '',
          SOCIAL_FIXED_WORKER_DATABASE_URL: '',
          GOS_PRIVATE_IMPORT_STORAGE_DIR: '',
          GOS_AI_EXECUTION_MODE: '',
          DATABASE_WORKER_URL: '',
          EXTERNAL_IDENTITY_DATABASE_URL: '',
          IDENTITY_VERIFIER_DATABASE_URL: '',
          SESSION_WRITER_DATABASE_URL: '',
          BILLING_READ_DATABASE_URL: '',
          BILLING_MIGRATION_DATABASE_URL: '',
          SOCIAL_MIGRATION_DATABASE_URL: '',
          TEST_DATABASE_URL: '',
          WORKOS_CLIENT_ID: '',
          WORKOS_API_KEY: '',
          WORKOS_WEBHOOK_SECRET: '',
          WORKOS_COOKIE_PASSWORD: '',
          NEXT_PUBLIC_WORKOS_REDIRECT_URI: '',
          WORKOS_ISSUER: '',
          RAZORPAY_KEY_ID: '',
          RAZORPAY_KEY_SECRET: '',
          RAZORPAY_WEBHOOK_SECRET: '',
          RAZORPAY_MODE: 'test',
          META_APP_ID: '',
          META_APP_SECRET: '',
          META_TOKEN_KEYS: '{}',
          META_TOKEN_KEY_ID: '',
          META_APP_ORIGIN: '',
          META_FACEBOOK_LOGIN_CONFIG_ID: '',
          META_INSTAGRAM_LOGIN_CONFIG_ID: '',
          API_ALLOWED_ORIGINS: baseURL,
        },
      },
});
