import { expect, test } from "@playwright/test";
import { TestDataGenPage } from "./helpers/testDataGenPage.js";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";

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
});
