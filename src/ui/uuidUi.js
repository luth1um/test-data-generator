/* global document */

export const UUIDV4_OPTION_VALUE = "uuidv4";

/**
 * Creates and returns a DOM option element for UUID v4 generation.
 *
 * @returns {HTMLOptionElement} A configured option element for UUID v4 selection.
 *
 * @example
 * const option = createUuidOption();
 * selectElement.appendChild(option);
 */
export function createUuidOption() {
  const uuidOption = document.createElement("option");
  uuidOption.value = UUIDV4_OPTION_VALUE;
  uuidOption.textContent = "UUID v4";
  return uuidOption;
}

/**
 * Returns an empty object as UUID generation requires no additional arguments.
 *
 * @returns {Object} An empty object since UUID generation has no parameters.
 *
 * @example
 * const args = getUuidArgs();
 * // Returns: {}
 */
export function getUuidArgs() {
  return {};
}
