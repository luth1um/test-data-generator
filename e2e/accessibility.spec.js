import { test, expect } from "@playwright/test";
import { TEST_BASE_URL } from "../playwright.config.js";
import AxeBuilder from "@axe-core/playwright";
import { GENERATOR_THEMES } from "./helpers/generatorThemes.js";
import { TEST_ID_SELECT_THEME } from "../src/theme.js";
import { generateIbanForCountry } from "./helpers/ibanHelpers.js";
import { IBAN_SUPPORTED_COUNTRIES } from "../src/generators/iban.js";

test.describe("The test-data generator", () => {
  GENERATOR_THEMES.filter((t) => t.name.startsWith("Light")).forEach((theme) => {
    test(`should satisfy all a11y checks provided by axe-core when the page is opened (${theme.name})`, async ({
      page,
    }) => {
      // given
      await page.goto(TEST_BASE_URL);
      await page.getByTestId(TEST_ID_SELECT_THEME).selectOption(theme.optionValue);

      // when
      const a11yResults = await new AxeBuilder({ page }).analyze();

      // then
      expect(a11yResults.violations).toHaveLength(0);
    });

    test(`should satisfy all a11y checks provided by axe-core when results are visible (${theme.name})`, async ({
      page,
    }) => {
      // given
      await generateIbanForCountry(page, IBAN_SUPPORTED_COUNTRIES[0].isoCode);
      await page.getByTestId(TEST_ID_SELECT_THEME).selectOption(theme.optionValue);

      // when
      const a11yResults = await new AxeBuilder({ page }).analyze();

      // then
      expect(a11yResults.violations).toHaveLength(0);
    });
  });
});
