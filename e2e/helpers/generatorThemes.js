import { THEME_OPTION_VALUE_DARK, THEME_OPTION_VALUE_LIGHT } from "../../src/ui/theme.js";

class GeneratorTheme {
  /**
   * @param {string} name - name of the theme
   * @param {string} optionValue - selector test ID of the theme
   */
  constructor(name, optionValue) {
    this.name = name;
    this.optionValue = optionValue;
  }
}

export const GENERATOR_THEMES = [
  new GeneratorTheme("Light Theme", THEME_OPTION_VALUE_LIGHT),
  new GeneratorTheme("Dark Theme", THEME_OPTION_VALUE_DARK),
];
