import { test, expect } from "@playwright/test";
import { BIC_COUNTRIES, BIC_OPTION_VALUE, TEST_ID_SELECT_BIC_COUNTRY } from "../src/bicUi.js";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";
import { generateBicForCountry, getBicSupportedCountries } from "./helpers/bicHelpers.js";
import { TEST_BASE_URL } from "../playwright.config.js";
import {
  RESULT_DIV_ID,
  TEST_ID_BUTTON_GENERATE,
  TEST_ID_DIV_RESULT,
  TEST_ID_INPUT_AMOUNT,
  TEST_ID_SELECT_TYPE,
} from "../src/uiLogic.js";

test.describe("The BIC generator", () => {
  BIC_COUNTRIES.forEach((country) => {
    test(`should generate BICs for ${country.code}`, async ({ page }, testInfo) => {
      skipMobileBrowsers(testInfo);

      // when
      const bic = await generateBicForCountry(page, country.code);

      // then
      expect(bic.substring(4, 6)).toEqual(country.code);
      expect(bic.length).toBeGreaterThanOrEqual(8);
      expect(bic.length).toBeLessThanOrEqual(11);
      expect(bic).toMatch(/^[A-Z0-9]+$/);
    });
  });

  test(`should have all ${BIC_COUNTRIES.length} specified countries (${BIC_COUNTRIES.map((c) => c.code).join(", ")}) as options`, async ({
    page,
  }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // when
    const countries = await getBicSupportedCountries(page);

    // then
    expect(countries.length).toEqual(BIC_COUNTRIES.length);
  });

  test("should display the country dropdown when BIC is selected", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // when
    await page.goto(TEST_BASE_URL);
    await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(BIC_OPTION_VALUE);

    // then
    await expect(page.getByTestId(TEST_ID_SELECT_BIC_COUNTRY)).toBeVisible();
  });

  test("should generate multiple BICs when amount is increased", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const country = BIC_COUNTRIES[0];
    const amount = 3;

    // when
    await page.goto(TEST_BASE_URL);
    await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(BIC_OPTION_VALUE);
    await page.getByTestId(TEST_ID_SELECT_BIC_COUNTRY).selectOption(country.code);
    await page.getByTestId(TEST_ID_INPUT_AMOUNT).fill("" + amount);
    await page.getByTestId(TEST_ID_BUTTON_GENERATE).click();
    await page.getByTestId(TEST_ID_DIV_RESULT).waitFor({ state: "visible" });

    const bicResults = await page.locator(`#${RESULT_DIV_ID} div`).all();

    // then
    expect(bicResults).toHaveLength(amount);
    for (const result of bicResults) {
      const bic = await result.textContent();
      expect(bic).toMatch(/^[A-Z0-9]+$/);
    }
  });
});
