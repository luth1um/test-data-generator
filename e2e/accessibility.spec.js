import { test, expect } from "@playwright/test";
import { TEST_BASE_URL } from "../playwright.config.js";
import AxeBuilder from "@axe-core/playwright";
import { GENERATOR_THEMES } from "./helpers/generatorThemes.js";
import { TEST_ID_SELECT_THEME } from "../src/theme.js";

test.describe("The test-data generator", () => {
  GENERATOR_THEMES.filter((t) => t.name.startsWith("Light")).forEach((theme) => {
    test(`should satisfy all a11y checks provided by axe-core when the page is opened (${theme.name})`, async ({
      page,
    }) => {
      // when
      await page.goto(TEST_BASE_URL);
      await page.getByTestId(TEST_ID_SELECT_THEME).selectOption(theme.optionValue);
      const a11yResults = await new AxeBuilder({ page }).analyze();

      // then
      expect(a11yResults.violations).toHaveLength(0);
    });
  });
});
