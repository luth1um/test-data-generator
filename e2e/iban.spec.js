import { expect, test } from "@playwright/test";
import { IBAN_SUPPORTED_COUNTRIES } from "../src/generators/iban.js";
import { TEST_ID_SELECT_IBAN_COUNTRY } from "../src/ui/ibanUi.js";
import { TestDataGenPage } from "./helpers/testDataGenPage.js";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";

test.describe("The IBAN generator", () => {
  IBAN_SUPPORTED_COUNTRIES.forEach((country) => {
    test(`should generate IBANs for ${country.displayName()}`, async ({ page }, testInfo) => {
      skipMobileBrowsers(testInfo);

      // given
      const pom = new TestDataGenPage(page);

      // when
      await pom.goto();
      await pom.selectIbanWithCountry(country.isoCode);
      await pom.clickGenerate();
      const results = await pom.getGeneratedResults();

      // then
      expect(results).toHaveLength(1);
      const iban = results[0];
      expect(iban.substring(0, 2)).toBe(country.isoCode);
      expect(iban.length).toBeGreaterThanOrEqual(15);
      expect(iban.length).toBeLessThanOrEqual(34);
    });
  });

  test(`should have all ${IBAN_SUPPORTED_COUNTRIES.length} specified countries (${IBAN_SUPPORTED_COUNTRIES.map((c) => c.isoCode).join(", ")}) as options`, async ({
    page,
  }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const pom = new TestDataGenPage(page);
    const ibanCountryCodesSorted = IBAN_SUPPORTED_COUNTRIES.map((c) => c.isoCode).sort();

    // when
    await pom.goto();
    await pom.selectIbanGenerator();
    const countries = await pom.getAllSelectValues(TEST_ID_SELECT_IBAN_COUNTRY);

    // then
    expect(countries).toHaveLength(ibanCountryCodesSorted.length);
    const valuesSorted = countries.map((c) => c.value).sort();
    expect(valuesSorted).toEqual(ibanCountryCodesSorted);
  });

  test("should display the country dropdown when IBAN is selected", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectIbanGenerator();

    // then
    await expect(page.getByTestId(TEST_ID_SELECT_IBAN_COUNTRY)).toBeVisible();
  });
});
