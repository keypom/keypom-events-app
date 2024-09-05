import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./playwright-tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? "100%" : undefined,
  reporter: "line",
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:5173",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    contextOptions: {
      /* Can't use service workers with playwright request routing */
      serviceWorkers: "block",
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
      testIgnore: /.*\.desktop\.spec\.ts/, // Ignore desktop-specific tests
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
      testIgnore: /.*\.desktop\.spec\.ts/, // Ignore desktop-specific tests
    },
    {
      name: "Tablet",
      use: { ...devices["iPad (gen 7)"] },
      testIgnore: /.*\.desktop\.spec\.ts/, // Ignore desktop-specific tests
    },
    {
      name: "Desktop",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /.*\.desktop\.spec\.ts/, // Only run desktop-specific tests
    },
  ],

  /*  Run your local dev server before starting the tests */
  webServer: {
    command: "set VITE_IS_TEST=true && pnpm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
