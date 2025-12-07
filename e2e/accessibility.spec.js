import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { GENERATOR_THEMES } from "./helpers/generatorThemes.js";
import { skipDesktopSafari, skipMobileBrowsers } from "./helpers/miscHelpers.js";
import { KEYBOARD_KEYS } from "../src/misc/testgenConstants.js";
import { TestDataGenPage } from "./helpers/testDataGenPage.js";
import { COUNTRIES } from "../src/misc/countries.js";

test.describe("The test-data generator", () => {
  GENERATOR_THEMES.filter((t) => t.name.startsWith("Light")).forEach((theme) => {
    test(`should satisfy all a11y checks provided by axe-core when the page is opened (${theme.name})`, async ({
      page,
    }) => {
      // given
      const pom = new TestDataGenPage(page);

      // when
      await pom.goto();
      await pom.selectTheme(theme.optionValue);

      const a11yResults = await new AxeBuilder({ page }).analyze();

      // then
      expect(a11yResults.violations).toHaveLength(0);
    });

    test(`should satisfy all a11y checks provided by axe-core when results are visible (${theme.name})`, async ({
      page,
    }) => {
      // given
      const pom = new TestDataGenPage(page);
      const countryIsoCode = COUNTRIES.GERMANY.isoCode;

      // when
      await pom.goto();
      await pom.selectTheme(theme.optionValue);
      await pom.selectIbanWithCountry(countryIsoCode);
      await pom.clickGenerate();

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
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();

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
