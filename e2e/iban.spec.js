// @ts-check
import { test, expect } from "@playwright/test";
import { generateIBANForCountry, getSupportedCountries } from "./helpers/ibanHelpers.js";
import { TEST_BASE_URL } from "./helpers/endToEndTestConstants.js";
import { IBAN_COUNTRIES, IBAN_OPTION_VALUE } from "../src/ibanUi.js";

test.describe("The IBAN Generator", () => {
  IBAN_COUNTRIES.forEach((country) => {
    test(`should generate IBANs for ${country.code}`, async ({ page }) => {
      const iban = await generateIBANForCountry(page, country.code);

      expect(iban.substring(0, 2)).toEqual(country.code);
      expect(iban.length).toBeGreaterThanOrEqual(15);
      expect(iban.length).toBeLessThanOrEqual(34);
      expect(iban).toMatch(/^[A-Z0-9]+$/);
    });
  });

  test(`should have all ${IBAN_COUNTRIES.length} specified countries (${IBAN_COUNTRIES.map((c) => c.code).join(", ")}) as options`, async ({
    page,
  }) => {
    const countries = await getSupportedCountries(page);
    expect(countries.length).toEqual(IBAN_COUNTRIES.length);
  });

  test("should display country dropdown when IBAN is selected", async ({ page }) => {
    await page.goto(TEST_BASE_URL);
    await page.getByTestId("select-type").selectOption(IBAN_OPTION_VALUE);
    await expect(page.getByTestId("select-country")).toBeVisible();
  });

  test("should generate multiple IBANs when amount is increased", async ({ page }) => {
    await page.goto(TEST_BASE_URL);
    const country = IBAN_COUNTRIES[0];
    const amount = 3;

    await page.getByTestId("select-type").selectOption(IBAN_OPTION_VALUE);
    await page.getByTestId("select-country").selectOption(country.code);
    await page.getByTestId("input-amount").fill("" + amount);
    await page.getByTestId("button-generate").click();
    await page.getByTestId("div-result").waitFor({ state: "visible" });

    const results = await page.locator("#result div").all();

    expect(results).toHaveLength(amount);
    for (const result of results) {
      const iban = await result.textContent();
      expect(iban).toMatch(/^[A-Z0-9]+$/);
    }
  });
});
