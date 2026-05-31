import { expect, test } from "@playwright/test";

import { DATA_TEST_ID } from "../src/misc/testgenConstants.js";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";
import { TestDataGenPage } from "./helpers/testDataGenPage.js";

test.describe("The results section", () => {
  [1, 3].forEach((amount) => {
    test(`should generate the correct number of results when the amount is set to ${amount}`, async ({
      page,
    }, testInfo) => {
      skipMobileBrowsers(testInfo);

      // given
      const pom = new TestDataGenPage(page);

      // when
      await pom.goto();
      await pom.setAmountInput(amount);
      await pom.clickGenerate();
      const results = await pom.getGeneratedResults();

      // then
      expect(results).toHaveLength(amount);
    });
  });

  test("should render generator errors as text instead of markup", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const pom = new TestDataGenPage(page);
    const markerTestId = "xss-marker";
    const maliciousCountryCode = `<img src="x" ${DATA_TEST_ID}="${markerTestId}">`;

    // when
    await pom.goto();
    await pom.addIbanCountryOption(maliciousCountryCode, "Injected country");
    await pom.selectIbanWithCountry(maliciousCountryCode);
    await pom.clickGenerate();
    const results = await pom.getGeneratedResults();

    // then
    expect(results[0]).toContain(`country code '${maliciousCountryCode}'`);
    await expect(pom.countGeneratedResultElementsByTestId(markerTestId)).resolves.toBe(0);
  });
});
