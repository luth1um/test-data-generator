/* global document */

import { CUID_V2_MIN_LENGTH, CUID_V2_MAX_LENGTH, CUID_V2_DEFAULT_LENGTH } from "../generators/cuid.js";
import { DATA_TEST_ID } from "../misc/testgenConstants.js";

export const CUID_V2_OPTION_VALUE = "cuidv2";
export const TEST_ID_CUID_V2_LENGTH_INPUT = "cuid-v2-length-input";

/**
 * Creates and returns a DOM option element for CUID v2 generation.
 *
 * @returns {HTMLOptionElement} A configured option element for CUID v2 selection.
 */
export function createCuidOption() {
  const cuidOption = document.createElement("option");
  cuidOption.value = CUID_V2_OPTION_VALUE;
  cuidOption.textContent = "CUID v2";
  return cuidOption;
}

/**
 * Creates and returns DOM elements for CUID v2 length controls.
 *
 * @returns {Object} An object containing the length label and input elements.
 * @returns {HTMLLabelElement} returns.lengthLabel - The label element for the length input.
 * @returns {HTMLInputElement} returns.lengthInput - The number input for CUID length.
 */
export function createCuidLengthControls() {
  const lengthLabel = document.createElement("label");
  lengthLabel.textContent = " Length: ";

  const lengthInput = document.createElement("input");
  lengthInput.id = "cuid-length-input";
  lengthInput.type = "number";
  lengthInput.min = String(CUID_V2_MIN_LENGTH);
  lengthInput.max = String(CUID_V2_MAX_LENGTH);
  lengthInput.step = "1";
  lengthInput.value = String(CUID_V2_DEFAULT_LENGTH);
  lengthInput.setAttribute(DATA_TEST_ID, TEST_ID_CUID_V2_LENGTH_INPUT);
  lengthInput.style.width = "4em";

  // Enforce the allowed range directly on the input value
  const clampValue = () => {
    let value = parseInt(lengthInput.value, 10);

    if (Number.isNaN(value)) {
      value = CUID_V2_DEFAULT_LENGTH;
    }

    if (value < CUID_V2_MIN_LENGTH) {
      value = CUID_V2_MIN_LENGTH;
    } else if (value > CUID_V2_MAX_LENGTH) {
      value = CUID_V2_MAX_LENGTH;
    }

    lengthInput.value = String(value);
  };

  lengthInput.addEventListener("blur", clampValue);
  lengthInput.addEventListener("change", clampValue);

  lengthLabel.htmlFor = "cuid-length-input";
  lengthLabel.appendChild(lengthInput);

  return { lengthLabel, lengthInput };
}

/**
 * Shows or hides the CUID v2 length controls based on the selected generation type.
 *
 * @param {string} type - The selected generation type (e.g., 'cuidv2').
 * @param {HTMLLabelElement} lengthLabel - The length label element to show/hide.
 */
export function showCuidLengthControls(type, lengthLabel) {
  lengthLabel.style.display = type === CUID_V2_OPTION_VALUE ? "" : "none";
}

/**
 * Returns the arguments needed for CUID v2 generation based on the entered length.
 * Ensures that the value is an integer within the allowed range.
 *
 * @param {HTMLInputElement} lengthInput - The length input element.
 * @returns {{ length: number | undefined }} An object containing the desired length.
 */
export function getCuidArgs(lengthInput) {
  let value = parseInt(lengthInput.value, 10);

  if (Number.isNaN(value)) {
    // Fall back to undefined so the generator can use its internal default (24)
    return { length: undefined };
  }

  // Clamp to the supported range and ensure an integer value
  if (value < CUID_V2_MIN_LENGTH) {
    value = CUID_V2_MIN_LENGTH;
  } else if (value > CUID_V2_MAX_LENGTH) {
    value = CUID_V2_MAX_LENGTH;
  }

  lengthInput.value = String(value);

  return { length: value };
}
