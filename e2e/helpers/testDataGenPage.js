import { TEST_BASE_URL } from "../../playwright.config.js";
import {
  RESULT_DIV_ID,
  TEST_ID_BUTTON_GENERATE,
  TEST_ID_DIV_RESULT,
  TEST_ID_INPUT_AMOUNT,
  TEST_ID_SELECT_TYPE,
} from "../../src/ui/uiLogic.js";
import { BIC_OPTION_VALUE, TEST_ID_SELECT_BIC_COUNTRY } from "../../src/ui/bicUi.js";

export class TestDataGenPage {
  #page;

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.#page = page;
  }

  async goto() {
    await this.#page.goto(TEST_BASE_URL);
  }

  /**
   * @param {string} type
   * @returns {Promise<void>}
   */
  async selectGeneratorType(type) {
    await this.#page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(type);
  }

  /**
   * @returns {Promise<void>}
   */
  async selectBicGenerator() {
    await this.selectGeneratorType(BIC_OPTION_VALUE);
  }

  /**
   * @param {string} countryCode
   * @returns {Promise<void>}
   */
  async selectBicWithCountry(countryCode) {
    await this.selectBicGenerator();
    await this.#page.getByTestId(TEST_ID_SELECT_BIC_COUNTRY).selectOption(countryCode);
  }

  /**
   * @param {string} selectTestId
   * @returns {Promise<Array<{value: string, textContent: string}>>}
   */
  async getAllSelectValues(selectTestId) {
    const allOptions = await this.#page.getByTestId(selectTestId).locator("option").all();

    const valueContentPairs = [];
    for (const option of allOptions) {
      const value = await option.getAttribute("value");
      const textContent = await option.textContent();
      valueContentPairs.push({ value: value, textContent: textContent });
    }

    return valueContentPairs;
  }

  /**
   * @param {number} amount
   * @returns {Promise<void>}
   */
  async setAmountInput(amount) {
    await this.#page.getByTestId(TEST_ID_INPUT_AMOUNT).fill("" + amount);
  }

  /**
   * @returns {Promise<void>}
   */
  async clickGenerate() {
    await this.#page.getByTestId(TEST_ID_BUTTON_GENERATE).click();
  }

  /**
   * @returns {Promise<string[]>}
   */
  async getGeneratedResults() {
    await this.#page.getByTestId(TEST_ID_DIV_RESULT).waitFor({ state: "visible" });
    const resultLines = await this.#page.locator(`#${RESULT_DIV_ID} div`).all();

    const results = [];
    for (const line of resultLines) {
      const result = await line.textContent();
      results.push(result);
    }

    return results;
  }
}
