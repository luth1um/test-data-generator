import { test, expect } from "@playwright/test";
import { generateIbanForCountry, getIbanSupportedCountries } from "./helpers/ibanHelpers.js";
import { TEST_BASE_URL } from "../playwright.config.js";
import { IBAN_COUNTRIES, IBAN_OPTION_VALUE, TEST_ID_SELECT_IBAN_COUNTRY } from "../src/ibanUi.js";
import {
  RESULT_DIV_ID,
  TEST_ID_BUTTON_GENERATE,
  TEST_ID_DIV_RESULT,
  TEST_ID_INPUT_AMOUNT,
  TEST_ID_SELECT_TYPE,
} from "../src/uiLogic.js";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";

test.describe("The IBAN generator", () => {
  IBAN_COUNTRIES.forEach((country) => {
    test(`should generate IBANs for ${country.code}`, async ({ page }, testInfo) => {
      skipMobileBrowsers(testInfo);

      // when
      const iban = await generateIbanForCountry(page, country.code);

      // then
      expect(iban.substring(0, 2)).toEqual(country.code);
      expect(iban.length).toBeGreaterThanOrEqual(15);
      expect(iban.length).toBeLessThanOrEqual(34);
      expect(iban).toMatch(/^[A-Z0-9]+$/);
    });
  });

  test(`should have all ${IBAN_COUNTRIES.length} specified countries (${IBAN_COUNTRIES.map((c) => c.code).join(", ")}) as options`, async ({
    page,
  }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // when
    const countries = await getIbanSupportedCountries(page);

    // then
    expect(countries.length).toEqual(IBAN_COUNTRIES.length);
  });

  test("should display the country dropdown when IBAN is selected", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // when
    await page.goto(TEST_BASE_URL);
    await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(IBAN_OPTION_VALUE);

    // then
    await expect(page.getByTestId(TEST_ID_SELECT_IBAN_COUNTRY)).toBeVisible();
  });

  test("should generate multiple IBANs when amount is increased", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const country = IBAN_COUNTRIES[0];
    const amount = 3;

    // when
    await page.goto(TEST_BASE_URL);
    await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(IBAN_OPTION_VALUE);
    await page.getByTestId(TEST_ID_SELECT_IBAN_COUNTRY).selectOption(country.code);
    await page.getByTestId(TEST_ID_INPUT_AMOUNT).fill("" + amount);
    await page.getByTestId(TEST_ID_BUTTON_GENERATE).click();
    await page.getByTestId(TEST_ID_DIV_RESULT).waitFor({ state: "visible" });

    const ibanResults = await page.locator(`#${RESULT_DIV_ID} div`).all();

    // then
    expect(ibanResults).toHaveLength(amount);
    for (const result of ibanResults) {
      const iban = await result.textContent();
      expect(iban).toMatch(/^[A-Z0-9]+$/);
    }
  });
});
