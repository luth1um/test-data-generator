/* global document */

import { TAX_ID_GERMANY_ST_NR, TAX_ID_TYPES, TYPE_DISPLAY_NAME_MAP } from "../generators/taxId.js";
import { DATA_TEST_ID } from "../misc/testgenConstants.js";

export const TEST_ID_SELECT_TAX_ID_TYPE = "select-type-tax-id";

export const TAX_ID_OPTION_VALUE = "tax-id";

/**
 * Creates and returns a DOM option element for Tax ID generation.
 *
 * @returns {HTMLOptionElement} A configured option element for Tax ID selection.
 *
 * @example
 * const option = createTaxIdOption();
 * selectElement.appendChild(option);
 */
export function createTaxIdOption() {
  const taxIdOption = document.createElement("option");
  taxIdOption.value = TAX_ID_OPTION_VALUE;
  taxIdOption.textContent = "Tax ID";
  return taxIdOption;
}

/**
 * Creates and returns DOM elements for type selection controls.
 *
 * @returns {Object} An object containing the typeLabel and typeSelect.
 *
 * @example
 * const { typeLabel, typeSelect } = createTypeControls();
 * container.appendChild(typeLabel);
 */
export function createTypeControls() {
  const typeLabel = document.createElement("label");
  typeLabel.textContent = " Type: ";
  const typeSelect = document.createElement("select");
  typeSelect.id = "type-select-tax-id";
  typeLabel.htmlFor = "type-select-tax-id";
  typeSelect.setAttribute(DATA_TEST_ID, TEST_ID_SELECT_TAX_ID_TYPE);
  TAX_ID_TYPES.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = TYPE_DISPLAY_NAME_MAP.get(type);
    typeSelect.appendChild(option);
  });
  typeSelect.value = TAX_ID_GERMANY_ST_NR;
  typeLabel.appendChild(typeSelect);
  return { typeLabel, typeSelect };
}

/**
 * Shows or hides type controls based on the selected generation type.
 *
 * @param {string} type - The selected generation type (e.g., 'tax-id').
 * @param {HTMLLabelElement} typeLabel - The type label element to show/hide.
 *
 * @example
 * showTaxIdTypeControls('tax-id', typeLabel); // Shows the controls
 * showTaxIdTypeControls('uuidv4', typeLabel); // Hides the controls
 */
export function showTaxIdTypeControls(type, typeLabel) {
  typeLabel.style.display = type === TAX_ID_OPTION_VALUE ? "" : "none";
}

/**
 * Returns the arguments needed for Tax ID generation based on the selected type.
 *
 * @param {HTMLSelectElement} typeSelect - The type selection dropdown element.
 * @returns {Object} An object containing the selected type.
 *
 * @example
 * const args = getTaxIdArgs(typeSelect);
 * // Returns: e.g., { type: 'tax-id-germany-steuer-id' }
 */
export function getTaxIdArgs(typeSelect) {
  return { type: typeSelect.value };
}
