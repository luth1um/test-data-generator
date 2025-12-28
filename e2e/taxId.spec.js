import { TAX_ID_TYPES, TYPE_DISPLAY_NAME_MAP } from "../src/generators/taxId.js";
import { expect, test } from "@playwright/test";
import { TEST_ID_SELECT_TAX_ID_TYPE } from "../src/ui/taxIdUi.js";
import { TestDataGenPage } from "./helpers/testDataGenPage.js";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";

test.describe("The tax ID generator", () => {
  TAX_ID_TYPES.forEach((type) => {
    test(`should generate tax IDs for type "${TYPE_DISPLAY_NAME_MAP.get(type)}"`, async ({ page }, testInfo) => {
      skipMobileBrowsers(testInfo);

      // given
      const pom = new TestDataGenPage(page);

      // when
      await pom.goto();
      await pom.selectTaxIdWithType(type);
      await pom.clickGenerate();
      const results = await pom.getGeneratedResults();

      // then
      expect(results).toHaveLength(1);
      const taxId = results[0];
      expect(taxId).toBeTruthy();
    });
  });

  test("should have all specified tax-ID types as options", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const pom = new TestDataGenPage(page);
    const taxIdTypesSorted = TAX_ID_TYPES.sort();

    // when
    await pom.goto();
    await pom.selectTaxIdGenerator();
    const drowpdownValues = await pom.getAllSelectValues(TEST_ID_SELECT_TAX_ID_TYPE);

    // then
    expect(drowpdownValues).toHaveLength(taxIdTypesSorted.length);
    const dropdownValuesSorted = drowpdownValues.map((c) => c.value).sort();
    expect(dropdownValuesSorted).toEqual(taxIdTypesSorted);
  });

  test(`should display the type dropdown when tax ID is selected`, async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectTaxIdGenerator();

    // then
    await expect(page.getByTestId(TEST_ID_SELECT_TAX_ID_TYPE)).toBeVisible();
  });
});
