import { test, expect } from "@playwright/test";
import { TEST_BASE_URL } from "../playwright.config.js";
import {
  DOWNLOAD_FILENAME,
  RESULT_DIV_ID,
  TEST_ID_BUTTON_DOWNLOAD,
  TEST_ID_BUTTON_GENERATE,
  TEST_ID_BUTTON_MINUS,
  TEST_ID_BUTTON_PLUS,
  TEST_ID_DIV_RESULT,
} from "../src/ui/uiLogic.js";
import { clickButton } from "./helpers/buttonHelpers.js";
import { generateIbanForCountry } from "./helpers/ibanHelpers.js";
import fs from "fs/promises";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";
import { IBAN_SUPPORTED_COUNTRIES } from "../src/generators/iban.js";

test.describe("The buttons for increasing and decreased the amount of results", () => {
  test("should increase and decrease the number of results correctly", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

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

  test("should never go below an amount of 1", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

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

test.describe("When pressing the download button", () => {
  test("the generator results should be downloaded", async ({ page }) => {
    // given
    const generatedIban = await generateIbanForCountry(page, IBAN_SUPPORTED_COUNTRIES[0].isoCode);

    // when
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId(TEST_ID_BUTTON_DOWNLOAD).click(),
    ]);

    // then
    expect(download.suggestedFilename()).toBe(DOWNLOAD_FILENAME);
    const path = await download.path();
    const content = await fs.readFile(path, "utf-8");
    expect(content).toEqual(generatedIban);
  });
});
