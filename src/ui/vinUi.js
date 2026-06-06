/* global document */

import { VIN_VARIANT_DISPLAY_NAME_MAP, VIN_VARIANT_WITH_GERMAN_CHECKSUM, VIN_VARIANTS } from "../generators/vin.js";
import { DATA_TEST_ID } from "../misc/testgenConstants.js";

export const TEST_ID_SELECT_VIN_VARIANT = "select-variant-vin";

export const VIN_OPTION_VALUE = "vin";

/**
 * Creates and returns a DOM option element for VIN generation.
 *
 * @returns {HTMLOptionElement} A configured option element for VIN selection.
 */
export function createVinOption() {
  const vinOption = document.createElement("option");
  vinOption.value = VIN_OPTION_VALUE;
  vinOption.textContent = "VIN";
  return vinOption;
}

/**
 * Creates and returns DOM elements for VIN variant selection controls.
 *
 * @returns {Object} An object containing the variantLabel and variantSelect.
 */
export function createVinVariantControls() {
  const variantLabel = document.createElement("label");
  variantLabel.textContent = " Variant: ";
  const variantSelect = document.createElement("select");
  variantSelect.id = "variant-select-vin";
  variantLabel.htmlFor = "variant-select-vin";
  variantSelect.setAttribute(DATA_TEST_ID, TEST_ID_SELECT_VIN_VARIANT);
  VIN_VARIANTS.forEach((variant) => {
    const option = document.createElement("option");
    option.value = variant;
    option.textContent = VIN_VARIANT_DISPLAY_NAME_MAP.get(variant);
    variantSelect.appendChild(option);
  });
  variantSelect.value = VIN_VARIANT_WITH_GERMAN_CHECKSUM;
  variantLabel.appendChild(variantSelect);
  return { variantLabel, variantSelect };
}

/**
 * Shows or hides VIN variant controls based on the selected generation type.
 *
 * @param {string} type - The selected generation type.
 * @param {HTMLLabelElement} variantLabel - The variant label element to show/hide.
 */
export function showVinVariantControls(type, variantLabel) {
  variantLabel.style.display = type === VIN_OPTION_VALUE ? "" : "none";
}

/**
 * Returns the arguments needed for VIN generation based on the selected variant.
 *
 * @param {HTMLSelectElement} variantSelect - The variant selection dropdown element.
 * @returns {Object} An object containing the selected variant.
 */
export function getVinArgs(variantSelect) {
  return { variant: variantSelect.value };
}
