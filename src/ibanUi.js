/* global document */

import { DATA_TEST_ID } from "./misc/testgenConstants.js";

export const TEST_ID_SELECT_COUNTRY = "select-country";

export const IBAN_COUNTRIES = [
  { code: "DE", name: "Germany (DE)" },
  { code: "NO", name: "Norway (NO)" },
];

export const IBAN_OPTION_VALUE = "iban";

/**
 * Creates and returns a DOM option element for IBAN generation.
 *
 * @returns {HTMLOptionElement} A configured option element for IBAN selection.
 *
 * @example
 * const option = createIbanOption();
 * selectElement.appendChild(option);
 */
export function createIbanOption() {
  const ibanOption = document.createElement("option");
  ibanOption.value = IBAN_OPTION_VALUE;
  ibanOption.textContent = "IBAN";
  return ibanOption;
}

/**
 * Creates and returns DOM elements for country selection controls.
 *
 * @returns {Object} An object containing the country label and select elements.
 * @returns {HTMLLabelElement} returns.countryLabel - The label element for the country selector.
 * @returns {HTMLSelectElement} returns.countrySelect - The select element with country options.
 *
 * @example
 * const { countryLabel, countrySelect } = createCountryControls();
 * container.appendChild(countryLabel);
 */
export function createCountryControls() {
  const countryLabel = document.createElement("label");
  countryLabel.textContent = " Country: ";
  const countrySelect = document.createElement("select");
  countrySelect.id = "country-select";
  countrySelect.setAttribute(DATA_TEST_ID, TEST_ID_SELECT_COUNTRY);
  IBAN_COUNTRIES.forEach(({ code, name }) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = name;
    countrySelect.appendChild(option);
  });
  countrySelect.value = IBAN_COUNTRIES[0].code;
  countryLabel.appendChild(countrySelect);
  return { countryLabel, countrySelect };
}

/**
 * Shows or hides country controls based on the selected generation type.
 *
 * @param {string} type - The selected generation type (e.g., 'iban').
 * @param {HTMLLabelElement} countryLabel - The country label element to show/hide.
 *
 * @example
 * showCountryControls('iban', countryLabel); // Shows the controls
 * showCountryControls('uuidv4', countryLabel); // Hides the controls
 */
export function showCountryControls(type, countryLabel) {
  countryLabel.style.display = type === IBAN_OPTION_VALUE ? "" : "none";
}

/**
 * Returns the arguments needed for IBAN generation based on the selected country.
 *
 * @param {HTMLSelectElement} countrySelect - The country selection dropdown element.
 * @returns {Object} An object containing the selected country code.
 * @returns {string} returns.country - The two-letter country code (e.g., 'DE', 'NO').
 *
 * @example
 * const args = getIbanArgs(countrySelect);
 * // Returns: { country: 'DE' }
 */
export function getIbanArgs(countrySelect) {
  return { country: countrySelect.value };
}
