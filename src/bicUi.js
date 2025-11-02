/* global document */

import { DATA_TEST_ID } from "./misc/testgenConstants.js";
import { COUNTRIES } from "./misc/countries.js";
import { BIC_SUPPORTED_COUNTRIES } from "./generators/bic.js";

export const TEST_ID_SELECT_BIC_COUNTRY = "select-country-bic";

export const BIC_OPTION_VALUE = "bic";

/**
 * Creates and returns a DOM option element for BIC generation.
 *
 * @returns {HTMLOptionElement} A configured option element for BIC selection.
 *
 * @example
 * const option = createBicOption();
 * selectElement.appendChild(option);
 */
export function createBicOption() {
  const bicOption = document.createElement("option");
  bicOption.value = BIC_OPTION_VALUE;
  bicOption.textContent = "BIC";
  return bicOption;
}

/**
 * Creates and returns DOM elements for country selection controls for BIC.
 *
 * @returns {Object} An object containing the country label and select elements.
 * @returns {HTMLLabelElement} returns.countryLabel - The label element for the country selector.
 * @returns {HTMLSelectElement} returns.countrySelect - The select element with country options.
 *
 * @example
 * const { countryLabel, countrySelect } = createBicCountryControls();
 * container.appendChild(countryLabel);
 */
export function createBicCountryControls() {
  const countryLabel = document.createElement("label");
  countryLabel.textContent = " Country: ";
  const countrySelect = document.createElement("select");
  countrySelect.id = "country-select-bic";
  countrySelect.setAttribute(DATA_TEST_ID, TEST_ID_SELECT_BIC_COUNTRY);
  BIC_SUPPORTED_COUNTRIES.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.isoCode;
    option.textContent = country.displayName();
    countrySelect.appendChild(option);
  });
  countrySelect.value = COUNTRIES.GERMANY.isoCode;
  countryLabel.appendChild(countrySelect);
  return { countryLabel, countrySelect };
}

/**
 * Shows or hides country controls based on the selected generation type.
 *
 * @param {string} type - The selected generation type (e.g., 'bic').
 * @param {HTMLLabelElement} countryLabel - The country label element to show/hide.
 *
 * @example
 * showBicCountryControls('bic', countryLabel); // Shows the controls
 * showBicCountryControls('uuidv4', countryLabel); // Hides the controls
 */
export function showBicCountryControls(type, countryLabel) {
  countryLabel.style.display = type === BIC_OPTION_VALUE ? "" : "none";
}

/**
 * Returns the arguments needed for BIC generation based on the selected country.
 *
 * @param {HTMLSelectElement} countrySelect - The country selection dropdown element.
 * @returns {Object} An object containing the selected country code.
 * @returns {string} returns.country - The two-letter country code (e.g., 'DE', 'NO').
 *
 * @example
 * const args = getBicArgs(countrySelect);
 * // Returns: { country: 'DE' }
 */
export function getBicArgs(countrySelect) {
  return { country: countrySelect.value };
}
