import { TEST_BASE_URL } from "../../playwright.config.js";
import { IBAN_OPTION_VALUE, TEST_ID_SELECT_IBAN_COUNTRY } from "../../src/ui/ibanUi.js";
import { TEST_ID_BUTTON_GENERATE, TEST_ID_DIV_RESULT, TEST_ID_SELECT_TYPE } from "../../src/ui/uiLogic.js";

/**
 * Helper function to generate an IBAN for a specific country using the UI
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} countryCode - The country code (e.g., 'DE', 'NO')
 * @returns {Promise<string>} The generated IBAN
 */
export async function generateIbanForCountry(page, countryCode) {
  await page.goto(TEST_BASE_URL);
  await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(IBAN_OPTION_VALUE);
  await page.getByTestId(TEST_ID_SELECT_IBAN_COUNTRY).selectOption(countryCode);
  await page.getByTestId(TEST_ID_BUTTON_GENERATE).click();

  await page.getByTestId(TEST_ID_DIV_RESULT).waitFor({ state: "visible" });
  return await page.getByTestId(TEST_ID_DIV_RESULT).first().textContent();
}
