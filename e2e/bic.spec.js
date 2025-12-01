import { test, expect } from "@playwright/test";
import { BIC_OPTION_VALUE, TEST_ID_SELECT_BIC_COUNTRY } from "../src/ui/bicUi.js";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";
import { generateBicForCountry, getBicSupportedCountries } from "./helpers/bicHelpers.js";
import { TEST_BASE_URL } from "../playwright.config.js";
import {
  RESULT_DIV_ID,
  TEST_ID_BUTTON_GENERATE,
  TEST_ID_DIV_RESULT,
  TEST_ID_INPUT_AMOUNT,
  TEST_ID_SELECT_TYPE,
} from "../src/ui/uiLogic.js";
import { BIC_SUPPORTED_COUNTRIES } from "../src/generators/bic.js";

test.describe("The BIC generator", () => {
  BIC_SUPPORTED_COUNTRIES.forEach((country) => {
    test(`should generate BICs for ${country.isoCode}`, async ({ page }, testInfo) => {
      skipMobileBrowsers(testInfo);

      // when
      const bic = await generateBicForCountry(page, country.isoCode);

      // then
      expect(bic.substring(4, 6)).toEqual(country.isoCode);
      expect(bic.length).toBeGreaterThanOrEqual(8);
      expect(bic.length).toBeLessThanOrEqual(11);
      expect(bic).toMatch(/^[A-Z0-9]+$/);
    });
  });

  test(`should have all ${BIC_SUPPORTED_COUNTRIES.length} implemented countries (${BIC_SUPPORTED_COUNTRIES.map((c) => c.isoCode).join(", ")}) as options`, async ({
    page,
  }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // when
    const countries = await getBicSupportedCountries(page);

    // then
    expect(countries.length).toEqual(BIC_SUPPORTED_COUNTRIES.length);
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
    const country = BIC_SUPPORTED_COUNTRIES[0];
    const amount = 3;

    // when
    await page.goto(TEST_BASE_URL);
    await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(BIC_OPTION_VALUE);
    await page.getByTestId(TEST_ID_SELECT_BIC_COUNTRY).selectOption(country.isoCode);
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
