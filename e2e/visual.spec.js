import { expect, test } from "@playwright/test";
import { TEST_BASE_URL } from "../playwright.config.js";
import { TEST_ID_SELECT_THEME, THEME_OPTION_VALUE_DARK, THEME_OPTION_VALUE_LIGHT } from "../src/theme.js";
import { TEST_ID_BUTTON_GENERATE, TEST_ID_SELECT_TYPE } from "../src/uiLogic.js";
import { UUIDV4_OPTION_VALUE } from "../src/uuidUi.js";

class GeneratorTheme {
  /**
   * @param {string} name - name of the theme
   * @param {string} optionValue - selector test ID of the theme
   */
  constructor(name, optionValue) {
    this.name = name;
    this.optionValue = optionValue;
  }
}

const GENERATOR_THEMES = [
  new GeneratorTheme("Light Theme", THEME_OPTION_VALUE_LIGHT),
  new GeneratorTheme("Dark Theme", THEME_OPTION_VALUE_DARK),
];

test.describe("The visuals of the page", () => {
  GENERATOR_THEMES.forEach((theme) => {
    test(`should be as expected when initially opening the page (${theme.name})`, async ({ page }, testInfo) => {
      // when
      await page.goto(TEST_BASE_URL);
      await page.getByTestId(TEST_ID_SELECT_THEME).selectOption(theme.optionValue);

      // then
      await expect(page).toHaveScreenshot(createSnapshotName("initial-page", theme, testInfo), {
        maxDiffPixelRatio: 0.02,
      });
    });

    test(`should show the generated results when the button is pressed (${theme.name})`, async ({ page }, testInfo) => {
      // when
      await page.goto(TEST_BASE_URL);
      await page.getByTestId(TEST_ID_SELECT_THEME).selectOption(theme.optionValue);
      await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(UUIDV4_OPTION_VALUE);
      await page.getByTestId(TEST_ID_BUTTON_GENERATE).click();

      // then
      await expect(page).toHaveScreenshot(createSnapshotName("page-with-results", theme, testInfo), {
        maxDiffPixelRatio: 0.02,
      });
    });
  });
});

/**
 * Creates a standardized snapshot filename for visual regression testing.
 *
 * @param {string} baseName - The base name for the snapshot (e.g., "initial-page")
 * @param {GeneratorTheme} theme - The theme object containing name and optionValue properties
 * @param {import('@playwright/test').TestInfo} testInfo - Playwright test information object containing project details
 * @returns {string} A formatted filename
 *
 * @example
 * // Returns: "initial-page-light-theme-chromium.png"
 * createSnapshotName("initial-page", lightTheme, testInfo);
 */
function createSnapshotName(baseName, theme, testInfo) {
  const platformName = testInfo.project.name.split(" ").join("-");
  return [baseName, theme.optionValue, "theme", platformName].join("-") + ".png";
}
