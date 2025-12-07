import { test, expect } from "@playwright/test";
import { DOWNLOAD_FILENAME } from "../src/ui/uiLogic.js";
import fs from "fs/promises";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";
import { TestDataGenPage } from "./helpers/testDataGenPage.js";

test.describe("The buttons for increasing and decreased the amount of results", () => {
  test("should increase and decrease the number of results correctly", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const plusClicks = 8;
    const minusClicks = 3;
    const expectedResults = plusClicks - minusClicks + 1; // +1 because of initial value
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.clickAmountPlus(plusClicks);
    await pom.clickAmountMinus(minusClicks);

    await pom.clickGenerate();
    const results = await pom.getGeneratedResults();

    // then
    expect(results).toHaveLength(expectedResults);
  });

  test("should never go below an amount of 1", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.clickAmountMinus(10);

    await pom.clickGenerate();
    const results = await pom.getGeneratedResults();

    // then
    expect(results).toHaveLength(1);
  });
});

test.describe("When pressing the download button", () => {
  test("the generator results should be downloaded", async ({ page }) => {
    // given
    const pom = new TestDataGenPage(page);
    await pom.goto();
    await pom.clickGenerate();
    const results = await pom.getGeneratedResults();
    expect(results).toHaveLength(1);
    const result = results[0];

    // when
    const [download] = await Promise.all([page.waitForEvent("download"), pom.clickDownload()]);

    // then
    expect(download.suggestedFilename()).toBe(DOWNLOAD_FILENAME);
    const path = await download.path();
    const content = await fs.readFile(path, "utf-8");
    expect(content).toBe(result);
  });
});
