import { expect, test } from "@playwright/test";
import { TEST_BASE_URL } from "./helpers/endToEndTestConstants.js";
import { TEST_ID_SELECT_THEME, THEME_OPTION_VALUE_DARK, THEME_OPTION_VALUE_LIGHT } from "../src/theme.js";

class GeneratorTheme {
  /**
   * @param name name of the theme
   * @param optionValue selector test ID of the theme
   */
  constructor(name, optionValue) {
    this.name = name;
    this.optionValue = optionValue;
  }
}

const GENERATOR_THEMES = [
  new GeneratorTheme("Light Theme", THEME_OPTION_VALUE_LIGHT),
  new GeneratorTheme("Dark Theme", THEME_OPTION_VALUE_DARK),
];

GENERATOR_THEMES.forEach((theme) => {
  test.describe(`The visual of the page (${theme.name})`, () => {
    test("should be as expected when initially opening the page", async ({ page }) => {
      // when
      await page.goto(TEST_BASE_URL);
      await page.getByTestId(TEST_ID_SELECT_THEME).selectOption(theme.optionValue);

      // then
      await expect(page).toHaveScreenshot();
    });
  });
});
