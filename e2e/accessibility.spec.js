import { test, expect } from "@playwright/test";
import { TEST_BASE_URL } from "../playwright.config.js";
import AxeBuilder from "@axe-core/playwright";

test.describe("The test-data generator", () => {
  test("should satisfy all a11y checks provided by axe-core", async ({ page }) => {
    // when
    await page.goto(TEST_BASE_URL);
    const a11yResults = await new AxeBuilder({ page }).analyze();

    // then
    expect(a11yResults.violations).toHaveLength(0);
  });
});
