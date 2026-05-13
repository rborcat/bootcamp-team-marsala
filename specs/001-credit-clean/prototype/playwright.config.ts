import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Credit Clean acceptance tests.
 * - Viewport: 390x844 (mobile-first)
 * - Dev server: Vite on port 5173
 * - Chromium only for this prototype phase
 */
export default defineConfig({
  testDir: './tests/acceptance',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['iPhone 14 Pro Max'], // 430x932 — close enough base
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
