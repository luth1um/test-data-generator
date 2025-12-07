import { test, expect } from "@playwright/test";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";
import { TestDataGenPage } from "./helpers/testDataGenPage.js";

const UUID_V4_LENGTH = 36;

test.describe("The UUID v4 generator", () => {
  test("should generate a valid UUID", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectUuid4Generator();
    await pom.clickGenerate();
    const results = await pom.getGeneratedResults();

    // then
    expect(results).toHaveLength(1);
    const result = results[0];
    expect(result).toHaveLength(UUID_V4_LENGTH);
  });

  test("should generate multiple UUIDs when amount is increased", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const amount = 3;
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectUuid4Generator();
    await pom.setAmountInput(amount);
    await pom.clickGenerate();
    const results = await pom.getGeneratedResults();

    // then
    expect(results).toHaveLength(amount);
    results.forEach((result) => {
      expect(result).toHaveLength(UUID_V4_LENGTH);
    });
  });
});
