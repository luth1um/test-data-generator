import { TEST_BASE_URL } from "../../playwright.config.js";
import { BIC_OPTION_VALUE, TEST_ID_SELECT_BIC_COUNTRY } from "../../src/ui/bicUi.js";
import { CUID_V2_OPTION_VALUE, TEST_ID_CUID_V2_LENGTH_INPUT } from "../../src/ui/cuidUi.js";
import { IBAN_OPTION_VALUE, TEST_ID_SELECT_IBAN_COUNTRY } from "../../src/ui/ibanUi.js";
import { TEST_ID_SELECT_THEME } from "../../src/ui/theme.js";
import {
  RESULT_DIV_ID,
  TEST_ID_BUTTON_DOWNLOAD,
  TEST_ID_BUTTON_GENERATE,
  TEST_ID_BUTTON_MINUS,
  TEST_ID_BUTTON_PLUS,
  TEST_ID_DIV_RESULT,
  TEST_ID_INPUT_AMOUNT,
  TEST_ID_SELECT_TYPE,
} from "../../src/ui/uiLogic.js";
import { UUIDV4_OPTION_VALUE } from "../../src/ui/uuidUi.js";

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
   * @returns {Promise<void>}
   */
  async selectCuid2Generator() {
    await this.selectGeneratorType(CUID_V2_OPTION_VALUE);
  }

  /**
   * @param {number} length
   * @returns {Promise<void>}
   */
  async selectCuid2WithLength(length) {
    await this.selectGeneratorType(CUID_V2_OPTION_VALUE);
    await this.#page.getByTestId(TEST_ID_CUID_V2_LENGTH_INPUT).fill("" + length);
  }

  /**
   * @returns {Promise<void>}
   */
  async selectIbanGenerator() {
    await this.selectGeneratorType(IBAN_OPTION_VALUE);
  }

  /**
   * @param {string} countryCode
   * @returns {Promise<void>}
   */
  async selectIbanWithCountry(countryCode) {
    await this.selectIbanGenerator();
    await this.#page.getByTestId(TEST_ID_SELECT_IBAN_COUNTRY).selectOption(countryCode);
  }

  /**
   * @returns {Promise<void>}
   */
  async selectUuid4Generator() {
    await this.selectGeneratorType(UUIDV4_OPTION_VALUE);
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
   *
   * @param {string} testId
   * @param {number} times
   * @returns {Promise<void>}
   */
  async clickButton(testId, times = 1) {
    const button = await this.#page.getByTestId(testId);
    for (let i = 0; i < times; i++) {
      await button.click();
    }
  }

  /**
   * @param {number} times
   * @returns {Promise<void>}
   */
  async clickAmountMinus(times = 1) {
    await this.clickButton(TEST_ID_BUTTON_MINUS, times);
  }

  /**
   * @param {number} times
   * @returns {Promise<void>}
   */
  async clickAmountPlus(times = 1) {
    await this.clickButton(TEST_ID_BUTTON_PLUS, times);
  }

  /**
   * @returns {Promise<void>}
   */
  async clickGenerate() {
    await this.clickButton(TEST_ID_BUTTON_GENERATE);
  }

  /**
   * @returns {Promise<void>}
   */
  async clickDownload() {
    await this.clickButton(TEST_ID_BUTTON_DOWNLOAD);
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

  /**
   * @param {string} optionValue
   * @returns {Promise<void>}
   */
  async selectTheme(optionValue) {
    await this.#page.getByTestId(TEST_ID_SELECT_THEME).selectOption(optionValue);
  }
}
