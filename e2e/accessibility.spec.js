import { test, expect } from "@playwright/test";
import { TEST_BASE_URL } from "../playwright.config.js";
import AxeBuilder from "@axe-core/playwright";
import { GENERATOR_THEMES } from "./helpers/generatorThemes.js";
import { TEST_ID_SELECT_THEME } from "../src/ui/theme.js";
import { generateIbanForCountry } from "./helpers/ibanHelpers.js";
import { IBAN_SUPPORTED_COUNTRIES } from "../src/generators/iban.js";
import { skipDesktopSafari, skipMobileBrowsers } from "./helpers/miscHelpers.js";
import { KEYBOARD_KEYS } from "../src/misc/testgenConstants.js";

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

  test("should have the correct order of elements when navigating with the tab button on the initial page", async ({
    page,
  }, testInfo) => {
    skipMobileBrowsers(testInfo); // tab order does not make sense for smartphones
    skipDesktopSafari(testInfo); // Safari only focuses on inputs when a11y is not specifically activated

    // given
    const expectedElementOrder = [
      "select#type-select",
      "select#country-select-iban",
      "input#amount-input",
      "button#minus-button",
      "button#plus-button",
      "button#generate-button",
      "select#theme-select",
    ];
    await page.goto(TEST_BASE_URL);

    // when
    const actualElementSelectors = [];
    for (let i = 0; i < expectedElementOrder.length; i++) {
      await page.keyboard.press(KEYBOARD_KEYS.TAB);
      actualElementSelectors.push(await getActiveElementSelector(page));
    }

    // then
    expect(actualElementSelectors).toEqual(expectedElementOrder);
  });
});

/**
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<string>}
 */
async function getActiveElementSelector(page) {
  return await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) {
      throw Error("No active element found");
    }

    let selector = el.tagName.toLowerCase();
    if (el.id) {
      selector += `#${el.id}`;
    }
    return selector;
  });
}
