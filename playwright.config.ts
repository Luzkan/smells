import { defineConfig, devices } from '@playwright/test';

const LOCAL_BASE_URL = 'http://localhost:4324';
const remoteBaseURL = process.env.BASE_URL?.trim();
const baseURL = remoteBaseURL || LOCAL_BASE_URL;

export default defineConfig({
  testDir: 'tests/e2e',
  use: {
    baseURL,
  },
  webServer: remoteBaseURL
    ? undefined
    : {
        command: 'pnpm build && pnpm preview -- --port 4324',
        env: {
          ...process.env,
          PUBLIC_GA_TRACKING_ID: process.env.PUBLIC_GA_TRACKING_ID ?? 'G-TEST123456',
        },
        url: LOCAL_BASE_URL,
        reuseExistingServer: false,
      },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'reduced-motion',
      use: {
        ...devices['Desktop Chrome'],
        contextOptions: { reducedMotion: 'reduce' },
      },
    },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
});
