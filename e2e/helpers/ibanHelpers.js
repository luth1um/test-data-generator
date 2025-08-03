import { TEST_BASE_URL } from "./endToEndTestConstants.js";
import { IBAN_OPTION_VALUE } from "../../src/ibanUi.js";

/**
 * Helper function to generate an IBAN for a specific country using the UI
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} countryCode - The country code (e.g., 'DE', 'NO')
 * @returns {Promise<string>} The generated IBAN
 */
export async function generateIBANForCountry(page, countryCode) {
  await page.goto(TEST_BASE_URL);
  await page.getByTestId("select-type").selectOption(IBAN_OPTION_VALUE);
  await page.getByTestId("select-country").selectOption(countryCode);
  await page.getByTestId("button-generate").click();

  await page.getByTestId("div-result").waitFor({ state: "visible" });
  return await page.getByTestId("div-result").first().textContent();
}

/**
 * Get all supported IBAN countries from the UI
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<Array<{code: string, name: string}>>} Array of country objects
 */
export async function getSupportedCountries(page) {
  await page.goto(TEST_BASE_URL);
  await page.getByTestId("select-type").selectOption(IBAN_OPTION_VALUE);
  const countryOptions = await page.getByTestId("select-country").locator("option").all();

  const countries = [];
  for (const option of countryOptions) {
    const value = await option.getAttribute("value");
    const text = await option.textContent();
    countries.push({ code: value, name: text });
  }

  return countries;
}
