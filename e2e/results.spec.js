import { expect, test } from "@playwright/test";

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
});
