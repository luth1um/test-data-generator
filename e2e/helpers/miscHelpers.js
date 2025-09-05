import { test } from "@playwright/test";
import { PROJECT_NAME_MOBILE_CHROME, PROJECT_NAME_MOBILE_SAFARI } from "../../playwright.config.js";

/**
 * Skips test execution on mobile browsers (Mobile Chrome and Mobile Safari)
 * to avoid redundant testing since the same functionality is already tested
 * on their desktop counterparts.
 *
 * @param {import('@playwright/test').TestInfo} testInfo - The test information object
 *   containing details about the current test run, including the browser/project name
 *
 * @example
 * // Usage in a test file:
 * test('some test', async ({ page }, testInfo) => {
 *   skipMobileBrowsers(testInfo);
 *   // ... rest of test code
 * });
 */
export function skipMobileBrowsers(testInfo) {
  const browser = testInfo.project.name;
  test.skip(
    browser === PROJECT_NAME_MOBILE_CHROME,
    `Skip functional test on ${PROJECT_NAME_MOBILE_CHROME} as it is already tested on Desktop Chrome`
  );
  test.skip(
    browser === PROJECT_NAME_MOBILE_SAFARI,
    `Skip functional test on ${PROJECT_NAME_MOBILE_SAFARI} as it is already tested on Desktop Safari`
  );
}
