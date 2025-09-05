/* global process */
// @ts-check
import { defineConfig, devices } from "@playwright/test";

export const PROJECT_NAME_MOBILE_CHROME = "Mobile Chrome";
export const PROJECT_NAME_MOBILE_SAFARI = "Mobile Safari";
export const TEST_BASE_URL = "http://localhost:5173/test-data-generator/";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* No retries (not even on CI) */
  retries: 0,
  /* Set number of parallel tests. */
  workers: undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? "github" : "list",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    {
      name: PROJECT_NAME_MOBILE_CHROME,
      use: { ...devices["Pixel 7"] },
    },
    {
      name: PROJECT_NAME_MOBILE_SAFARI,
      use: { ...devices["iPhone 15"] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /*  Single template for all assertions */
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "pnpm start",
    url: TEST_BASE_URL,
    reuseExistingServer: !process.env.CI,
  },
});
