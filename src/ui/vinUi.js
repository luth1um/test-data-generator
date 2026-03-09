/* global document */

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
 * Returns an empty object as VIN generation requires no additional arguments.
 *
 * @returns {Object} An empty object since VIN generation has no parameters.
 */
export function getVinArgs() {
  return {};
}
