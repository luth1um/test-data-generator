import { test, expect } from "@playwright/test";
import { TEST_BASE_URL } from "../playwright.config.js";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";
import { CUID_V2_DEFAULT_LENGTH, CUID_V2_MAX_LENGTH, CUID_V2_MIN_LENGTH } from "../src/generators/cuid.js";
import {
  RESULT_DIV_ID,
  TEST_ID_BUTTON_GENERATE,
  TEST_ID_DIV_RESULT,
  TEST_ID_INPUT_AMOUNT,
  TEST_ID_SELECT_TYPE,
} from "../src/ui/uiLogic.js";
import { CUID_V2_OPTION_VALUE, TEST_ID_CUID_V2_LENGTH_INPUT } from "../src/ui/cuidUi.js";

test.describe("The CUID v2 generator", () => {
  test("should generate a valid CUID", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const expectedLength = CUID_V2_DEFAULT_LENGTH;

    // when
    await page.goto(TEST_BASE_URL);
    await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(CUID_V2_OPTION_VALUE);
    await page.getByTestId(TEST_ID_BUTTON_GENERATE).click();

    // then
    await page.getByTestId(TEST_ID_DIV_RESULT).waitFor({ state: "visible" });
    const result = await page.getByTestId(TEST_ID_DIV_RESULT).first().textContent();
    expect(result.length).toBe(expectedLength);
  });

  test("should generate multiple CUIDs when the amount is increased", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const expectedLength = CUID_V2_DEFAULT_LENGTH;
    const amount = 7;

    // when
    await page.goto(TEST_BASE_URL);
    await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(CUID_V2_OPTION_VALUE);
    await page.getByTestId(TEST_ID_INPUT_AMOUNT).fill("" + amount);
    await page.getByTestId(TEST_ID_BUTTON_GENERATE).click();

    // then
    await page.getByTestId(TEST_ID_DIV_RESULT).waitFor({ state: "visible" });
    const cuid = await page.locator(`#${RESULT_DIV_ID} div`).all();

    expect(cuid).toHaveLength(amount);
    for (const result of cuid) {
      const uuid = await result.textContent();
      expect(uuid.length).toBe(expectedLength);
    }
  });

  test(`should generate a CUID with the specified length when the length is set to a value`, async ({
    page,
  }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const inputLength = 19;

    // when
    await page.goto(TEST_BASE_URL);
    await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(CUID_V2_OPTION_VALUE);
    await page.getByTestId(TEST_ID_CUID_V2_LENGTH_INPUT).fill("" + inputLength);
    await page.getByTestId(TEST_ID_BUTTON_GENERATE).click();

    // then
    await page.getByTestId(TEST_ID_DIV_RESULT).waitFor({ state: "visible" });
    const result = await page.getByTestId(TEST_ID_DIV_RESULT).first().textContent();
    expect(result.length).toBe(inputLength);
  });

  test(`should generate a CUID of length ${CUID_V2_MIN_LENGTH} when the input length is too small`, async ({
    page,
  }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const lengthTooSmall = CUID_V2_MIN_LENGTH - 1;

    // when
    await page.goto(TEST_BASE_URL);
    await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(CUID_V2_OPTION_VALUE);
    await page.getByTestId(TEST_ID_CUID_V2_LENGTH_INPUT).fill("" + lengthTooSmall);
    await page.getByTestId(TEST_ID_BUTTON_GENERATE).click();

    // then
    await page.getByTestId(TEST_ID_DIV_RESULT).waitFor({ state: "visible" });
    const result = await page.getByTestId(TEST_ID_DIV_RESULT).first().textContent();
    expect(result.length).toBe(CUID_V2_MIN_LENGTH);
  });

  test(`should generate a CUID of length ${CUID_V2_MAX_LENGTH} when the input length is too big`, async ({
    page,
  }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const lengthTooBig = CUID_V2_MAX_LENGTH + 1;

    // when
    await page.goto(TEST_BASE_URL);
    await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(CUID_V2_OPTION_VALUE);
    await page.getByTestId(TEST_ID_CUID_V2_LENGTH_INPUT).fill("" + lengthTooBig);
    await page.getByTestId(TEST_ID_BUTTON_GENERATE).click();

    // then
    await page.getByTestId(TEST_ID_DIV_RESULT).waitFor({ state: "visible" });
    const result = await page.getByTestId(TEST_ID_DIV_RESULT).first().textContent();
    expect(result.length).toBe(CUID_V2_MAX_LENGTH);
  });

  test(`should generate a CUID of length ${CUID_V2_DEFAULT_LENGTH} when the input length is NaN`, async ({
    page,
  }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const nanInput = " ";

    // when
    await page.goto(TEST_BASE_URL);
    await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(CUID_V2_OPTION_VALUE);
    await page.getByTestId(TEST_ID_CUID_V2_LENGTH_INPUT).fill(nanInput);
    await page.getByTestId(TEST_ID_BUTTON_GENERATE).click();

    // then
    await page.getByTestId(TEST_ID_DIV_RESULT).waitFor({ state: "visible" });
    const result = await page.getByTestId(TEST_ID_DIV_RESULT).first().textContent();
    expect(result.length).toBe(CUID_V2_DEFAULT_LENGTH);
  });
});
