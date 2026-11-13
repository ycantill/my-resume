import { defineConfig, devices } from '@playwright/test';

// Browser tests: the real app in Chromium, with the database replaced by the
// fixture in src/test/fixtures (see e2e/fixtures.ts). No real data, no network.
const PORT = 4180;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Same escape hatch as scripts/generate-pdfs.mjs: a machine with its own
        // Chromium can skip `playwright install`
        launchOptions: { executablePath: process.env.PDF_CHROMIUM_PATH || undefined },
      },
    },
  ],
  webServer: {
    command: `npx vite --port ${PORT} --strictPort --open false`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    // Process env wins over .env files, so the real database is never used here
    env: {
      VITE_DATABASE_URL: 'https://resume-fixture.test',
      VITE_FIREBASE_API_KEY: 'e2e-test-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'e2e-test.firebaseapp.com',
    },
  },
});
