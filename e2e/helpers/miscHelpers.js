import {
  PROJECT_NAME_DESKTOP_SAFARI,
  PROJECT_NAME_MOBILE_CHROME,
  PROJECT_NAME_MOBILE_SAFARI,
} from "../../playwright.config.js";
import { test } from "@playwright/test";

/**
 * @param {import('@playwright/test').TestInfo} testInfo
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

/**
 * @param {import('@playwright/test').TestInfo} testInfo
 */
export function skipDesktopSafari(testInfo) {
  const browser = testInfo.project.name;
  test.skip(browser === PROJECT_NAME_DESKTOP_SAFARI, `Skipping test for ${PROJECT_NAME_DESKTOP_SAFARI}`);
}
