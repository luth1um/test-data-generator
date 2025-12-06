import { test, expect } from "@playwright/test";
import { TEST_ID_SELECT_BIC_COUNTRY } from "../src/ui/bicUi.js";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";
import { BIC_SUPPORTED_COUNTRIES, BIC_SUPPORTED_COUNTRY_CODES } from "../src/generators/bic.js";
import { TestDataGenPage } from "./helpers/testDataGenPage.js";

test.describe("The BIC generator", () => {
  BIC_SUPPORTED_COUNTRIES.forEach((country) => {
    test(`should generate BICs for ${country.isoCode}`, async ({ page }, testInfo) => {
      skipMobileBrowsers(testInfo);

      // given
      const pom = new TestDataGenPage(page);

      // when
      await pom.goto();
      await pom.selectBicWithCountry(country.isoCode);
      await pom.clickGenerate();
      const results = await pom.getGeneratedResults();

      // then
      expect(results).toHaveLength(1);
      const bic = results[0];
      expect(bic.length).toBeGreaterThanOrEqual(8);
      expect(bic.length).toBeLessThanOrEqual(11);
    });
  });

  test(`should have all ${BIC_SUPPORTED_COUNTRIES.length} implemented countries (${BIC_SUPPORTED_COUNTRIES.map((c) => c.isoCode).join(", ")}) as options`, async ({
    page,
  }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectBicGenerator();
    const countries = await pom.getAllSelectValues(TEST_ID_SELECT_BIC_COUNTRY);

    // then
    expect(countries).toHaveLength(BIC_SUPPORTED_COUNTRIES.length);
    const allValuesSorted = countries.map((c) => c.value).sort();
    expect(allValuesSorted).toEqual(BIC_SUPPORTED_COUNTRY_CODES.sort());
  });

  test("should display the country dropdown when BIC is selected", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectBicGenerator();

    // then
    await expect(page.getByTestId(TEST_ID_SELECT_BIC_COUNTRY)).toBeVisible();
  });

  test("should generate multiple BICs when amount is increased", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const country = BIC_SUPPORTED_COUNTRIES[0];
    const amount = 3;
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectBicWithCountry(country.isoCode);
    await pom.setAmountInput(amount);
    await pom.clickGenerate();
    const bicResults = await pom.getGeneratedResults();

    // then
    expect(bicResults).toHaveLength(amount);
    bicResults.forEach((bicResult) => {
      expect(bicResult.length).toBeGreaterThanOrEqual(8);
      expect(bicResult.length).toBeLessThanOrEqual(11);
    });
  });
});
