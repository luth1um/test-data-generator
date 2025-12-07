import { expect, test } from "@playwright/test";
import { GENERATOR_THEMES } from "./helpers/generatorThemes.js";
import { GENERATOR_TYPES } from "./helpers/generatorTypes.js";
import { TestDataGenPage } from "./helpers/testDataGenPage.js";

test.describe("The visuals of the page", () => {
  GENERATOR_THEMES.forEach((theme) => {
    test(`should be as expected when initially opening the page (${theme.name})`, async ({ page }, testInfo) => {
      // given
      const pom = new TestDataGenPage(page);

      // when
      await pom.goto();
      await pom.selectTheme(theme.optionValue);

      // then
      await expect(page).toHaveScreenshot(createSnapshotName("initial-page", theme, testInfo), {
        maxDiffPixelRatio: 0.02,
      });
    });

    test(`should show the generated results when the button is pressed (${theme.name})`, async ({ page }, testInfo) => {
      // given
      const pom = new TestDataGenPage(page);

      // when
      await pom.goto();
      await pom.selectTheme(theme.optionValue);
      await pom.selectUuid4Generator();
      await pom.clickGenerate();

      // then
      await expect(page).toHaveScreenshot(createSnapshotName("page-with-results", theme, testInfo), {
        maxDiffPixelRatio: 0.03,
      });
    });

    GENERATOR_TYPES.forEach((type) => {
      test(`should be as expected when selecting ${type.name} (${theme.name})`, async ({ page }, testInfo) => {
        //given
        const screenshotBaseName = "selected-" + type.name.toLowerCase().replaceAll(" ", "-");
        const pom = new TestDataGenPage(page);

        // when
        await pom.goto();
        await pom.selectGeneratorType(type.optionValue);
        await pom.selectTheme(theme.optionValue);

        // then
        await expect(page).toHaveScreenshot(createSnapshotName(screenshotBaseName, theme, testInfo), {
          maxDiffPixelRatio: 0.02,
        });
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
