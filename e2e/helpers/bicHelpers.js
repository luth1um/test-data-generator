import { TEST_BASE_URL } from "../../playwright.config.js";
import { TEST_ID_BUTTON_GENERATE, TEST_ID_DIV_RESULT, TEST_ID_SELECT_TYPE } from "../../src/ui/uiLogic.js";
import { BIC_OPTION_VALUE, TEST_ID_SELECT_BIC_COUNTRY } from "../../src/ui/bicUi.js";

/**
 * Helper function to generate a BIC for a specific country using the UI
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} countryCode - The country code (e.g., 'DE', 'NO')
 * @returns {Promise<string>} The generated BIC
 */
export async function generateBicForCountry(page, countryCode) {
  await page.goto(TEST_BASE_URL);
  await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(BIC_OPTION_VALUE);
  await page.getByTestId(TEST_ID_SELECT_BIC_COUNTRY).selectOption(countryCode);
  await page.getByTestId(TEST_ID_BUTTON_GENERATE).click();

  await page.getByTestId(TEST_ID_DIV_RESULT).waitFor({ state: "visible" });
  return await page.getByTestId(TEST_ID_DIV_RESULT).first().textContent();
}

/**
 * Get all supported BIC countries from the UI
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<Array<{code: string, name: string}>>} Array of country objects
 */
export async function getBicSupportedCountries(page) {
  await page.goto(TEST_BASE_URL);
  await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(BIC_OPTION_VALUE);
  const countryOptions = await page.getByTestId(TEST_ID_SELECT_BIC_COUNTRY).locator("option").all();

  const countries = [];
  for (const option of countryOptions) {
    const value = await option.getAttribute("value");
    const text = await option.textContent();
    countries.push({ code: value, name: text });
  }

  return countries;
}
