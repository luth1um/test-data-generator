/* global document, window */

/**
 * Initializes the theme selector and logic.
 * Appends the theme dropdown to the provided container.
 * @param {HTMLElement} app - The main app container to append the theme selector to.
 */
export function initTheme(app) {
  // Theme selector row
  const themeRow = document.createElement("div");
  themeRow.className = "theme-row";
  const themeLabel = document.createElement("label");
  themeLabel.textContent = "Theme:";
  themeLabel.setAttribute("for", "theme-select");
  const themeSelect = document.createElement("select");
  themeSelect.id = "theme-select";
  const optionSystem = document.createElement("option");
  optionSystem.value = "system";
  optionSystem.textContent = "System";
  const optionLight = document.createElement("option");
  optionLight.value = "light";
  optionLight.textContent = "Light";
  const optionDark = document.createElement("option");
  optionDark.value = "dark";
  optionDark.textContent = "Dark";
  themeSelect.appendChild(optionSystem);
  themeSelect.appendChild(optionLight);
  themeSelect.appendChild(optionDark);
  themeRow.appendChild(themeLabel);
  themeRow.appendChild(themeSelect);

  app.appendChild(themeRow);

  /**
   * Applies the specified theme to the document body.
   *
   * @param {string} theme - The theme to apply ('dark', 'light', or 'system').
   *
   * @example
   * applyTheme('dark'); // Applies dark theme
   * applyTheme('light'); // Applies light theme
   * applyTheme('system'); // Uses system preference
   */
  function applyTheme(theme) {
    document.body.classList.remove("dark-mode", "light-mode");
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else if (theme === "light") {
      document.body.classList.add("light-mode");
    }
    // If 'system', no class is added, so prefers-color-scheme applies
  }

  // Set initial theme based on system
  let currentTheme = "system";
  applyTheme(currentTheme);
  themeSelect.value = currentTheme;

  // Listen for system theme changes if 'system' is selected
  let systemThemeListener = null;

  /**
   * Updates the system theme listener based on the current theme selection.
   * If 'system' is selected, adds a listener for system theme changes.
   * If another theme is selected, removes the listener if it exists.
   *
   * @example
   * updateSystemThemeListener(); // Updates listener based on currentTheme
   */
  function updateSystemThemeListener() {
    if (currentTheme === "system") {
      if (!systemThemeListener) {
        systemThemeListener = () => {
          applyTheme("system");
        };
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", systemThemeListener);
      }
    } else if (systemThemeListener) {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", systemThemeListener);
      systemThemeListener = null;
    }
  }

  themeSelect.addEventListener("change", () => {
    currentTheme = themeSelect.value;
    applyTheme(currentTheme);
    updateSystemThemeListener();
  });

  updateSystemThemeListener();
}
