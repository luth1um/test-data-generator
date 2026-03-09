import { expect, test } from "@playwright/test";
import { TestDataGenPage } from "./helpers/testDataGenPage.js";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";

const VIN_LENGTH = 17;

test.describe("The VIN generator", () => {
  test("should generate a valid VIN", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectVinGenerator();
    await pom.clickGenerate();
    const results = await pom.getGeneratedResults();

    // then
    expect(results).toHaveLength(1);
    const result = results[0];
    expect(result).toHaveLength(VIN_LENGTH);
  });
});
