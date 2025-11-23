/* global document, window */

import { DATA_TEST_ID } from "./misc/testgenConstants.js";

export const TEST_ID_SELECT_THEME = "select-theme";
export const THEME_OPTION_VALUE_LIGHT = "light";
export const THEME_OPTION_VALUE_DARK = "dark";

/**
 * Initializes the theme selector and logic.
 * Appends the theme dropdown to the provided container.
 * @param {HTMLElement} mainLandmark - The app main landmark container to append the theme selector to.
 */
export function initTheme(mainLandmark) {
  // Theme selector row
  const themeRow = document.createElement("div");
  themeRow.className = "theme-row";
  const themeLabel = document.createElement("label");
  themeLabel.textContent = "Theme:";
  themeLabel.setAttribute("for", "theme-select");
  const themeSelect = document.createElement("select");
  themeSelect.id = "theme-select";
  themeSelect.setAttribute(DATA_TEST_ID, TEST_ID_SELECT_THEME);
  const optionLight = document.createElement("option");
  optionLight.value = THEME_OPTION_VALUE_LIGHT;
  optionLight.textContent = "Light";
  const optionDark = document.createElement("option");
  optionDark.value = THEME_OPTION_VALUE_DARK;
  optionDark.textContent = "Dark";
  themeSelect.appendChild(optionLight);
  themeSelect.appendChild(optionDark);
  themeRow.appendChild(themeLabel);
  themeRow.appendChild(themeSelect);

  mainLandmark.appendChild(themeRow);

  /**
   * Applies the specified theme to the document body.
   *
   * @param {string} theme - The theme to apply ('dark' or 'light').
   *
   * @example
   * applyTheme('dark'); // Applies dark theme
   * applyTheme('light'); // Applies light theme
   */
  function applyTheme(theme) {
    document.body.classList.remove("dark-mode", "light-mode");
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else if (theme === "light") {
      document.body.classList.add("light-mode");
    }
  }

  /**
   * Gets the current system theme preference.
   *
   * @returns {string} 'dark' if system prefers dark, 'light' otherwise.
   */
  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  /**
   * Updates the option labels to show or hide the " (System)" suffix.
   *
   * @param {string} systemTheme - The theme that matches the system preference.
   */
  function updateOptionLabels(systemTheme) {
    optionLight.textContent = systemTheme === "light" ? "Light (System)" : "Light";
    optionDark.textContent = systemTheme === "dark" ? "Dark (System)" : "Dark";
  }

  // Track if user has made an explicit selection
  let userHasSelected = false;

  // Set initial theme based on system
  const initialSystemTheme = getSystemTheme();
  let currentTheme = initialSystemTheme;
  applyTheme(currentTheme);
  themeSelect.value = currentTheme;
  updateOptionLabels(initialSystemTheme);

  // Listen for system theme changes when using system default
  let systemThemeListener = null;

  /**
   * Updates the system theme listener based on whether user has made an explicit selection.
   * If user hasn't selected, listens for system theme changes and updates accordingly.
   * If user has selected, removes the listener.
   *
   * @example
   * updateSystemThemeListener(); // Updates listener based on userHasSelected
   */
  function updateSystemThemeListener() {
    if (!userHasSelected) {
      if (!systemThemeListener) {
        systemThemeListener = () => {
          const newSystemTheme = getSystemTheme();
          currentTheme = newSystemTheme;
          applyTheme(currentTheme);
          themeSelect.value = currentTheme;
          updateOptionLabels(newSystemTheme);
        };
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", systemThemeListener);
      }
    } else if (systemThemeListener) {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", systemThemeListener);
      systemThemeListener = null;
    }
  }

  themeSelect.addEventListener("change", () => {
    userHasSelected = true;
    currentTheme = themeSelect.value;
    applyTheme(currentTheme);
    // Always show " (System)" on the option that matches system preference
    updateOptionLabels(getSystemTheme());
    updateSystemThemeListener();
  });

  updateSystemThemeListener();
}
