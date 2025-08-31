import { test, expect } from "@playwright/test";
import { TEST_BASE_URL } from "./helpers/endToEndTestConstants.js";
import {
  RESULT_DIV_ID,
  TEST_ID_BUTTON_GENERATE,
  TEST_ID_BUTTON_MINUS,
  TEST_ID_BUTTON_PLUS,
  TEST_ID_DIV_RESULT,
} from "../src/uiLogic.js";
import { clickButton } from "./helpers/buttonHelpers.js";

test.describe("The buttons for increasing and decreased the amount of results", () => {
  test("should increase and decrease the number of results correctly", async ({ page }) => {
    // given
    const plusClicks = 8;
    const minusClicks = 3;
    const expectedResults = plusClicks - minusClicks + 1; // +1 because of initial value

    // when
    await page.goto(TEST_BASE_URL);

    await clickButton(page, TEST_ID_BUTTON_PLUS, plusClicks);
    await clickButton(page, TEST_ID_BUTTON_MINUS, minusClicks);

    await page.getByTestId(TEST_ID_BUTTON_GENERATE).click();
    await clickButton(page, TEST_ID_BUTTON_GENERATE);
    await page.getByTestId(TEST_ID_DIV_RESULT).waitFor({ state: "visible" });
    const results = await page.locator(`#${RESULT_DIV_ID} div`).all();

    // then
    expect(results).toHaveLength(expectedResults);
  });

  test("should never go below an amount of 1", async ({ page }) => {
    // given
    const minusClicks = 10;

    // when
    await page.goto(TEST_BASE_URL);
    await clickButton(page, TEST_ID_BUTTON_MINUS, minusClicks);

    await clickButton(page, TEST_ID_BUTTON_GENERATE);
    await page.getByTestId(TEST_ID_DIV_RESULT).waitFor({ state: "visible" });
    const results = await page.locator(`#${RESULT_DIV_ID} div`).all();

    // then
    expect(results).toHaveLength(1);
  });
});
