import { test, expect } from "@playwright/test";
import { TEST_BASE_URL } from "../playwright.config.js";
import {
  RESULT_DIV_ID,
  TEST_ID_BUTTON_GENERATE,
  TEST_ID_DIV_RESULT,
  TEST_ID_INPUT_AMOUNT,
  TEST_ID_SELECT_TYPE,
} from "../src/uiLogic.js";
import { UUIDV4_OPTION_VALUE } from "../src/uuidUi.js";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";

const UUID_V4_LENGTH = 36;

test.describe("The UUID v4 generator", () => {
  test("should generate a valid UUID", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // when
    await page.goto(TEST_BASE_URL);
    await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(UUIDV4_OPTION_VALUE);
    await page.getByTestId(TEST_ID_BUTTON_GENERATE).click();

    await page.getByTestId(TEST_ID_DIV_RESULT).waitFor({ state: "visible" });
    const result = await page.getByTestId(TEST_ID_DIV_RESULT).first().textContent();

    // then
    expect(result.length).toEqual(UUID_V4_LENGTH);
  });

  test("should generate multiple UUIDs when amount is increased", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const amount = 3;

    // when
    await page.goto(TEST_BASE_URL);
    await page.getByTestId(TEST_ID_SELECT_TYPE).selectOption(UUIDV4_OPTION_VALUE);
    await page.getByTestId(TEST_ID_INPUT_AMOUNT).fill("" + amount);
    await page.getByTestId(TEST_ID_BUTTON_GENERATE).click();

    await page.getByTestId(TEST_ID_DIV_RESULT).waitFor({ state: "visible" });
    const uuidResults = await page.locator(`#${RESULT_DIV_ID} div`).all();

    // then
    expect(uuidResults).toHaveLength(amount);
    for (const result of uuidResults) {
      const uuid = await result.textContent();
      expect(uuid.length).toEqual(UUID_V4_LENGTH);
    }
  });
});
