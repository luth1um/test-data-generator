/* global document, Blob, URL, setTimeout */

import {
  createIbanOption,
  createCountryControls,
  showIbanCountryControls,
  getIbanArgs,
  IBAN_OPTION_VALUE,
} from "./ibanUi.js";
import {
  createBicOption,
  createBicCountryControls,
  showBicCountryControls,
  getBicArgs,
  BIC_OPTION_VALUE,
} from "./bicUi.js";
import { createUuidOption, getUuidArgs, UUIDV4_OPTION_VALUE } from "./uuidUi.js";
import { DATA_TEST_ID } from "./misc/testgenConstants.js";
import { generateIBAN } from "./generators/iban.js";
import { generateBIC } from "./generators/bic.js";
import { generateUUID } from "./generators/uuid.js";

export const RESULT_DIV_ID = "result";
export const DOWNLOAD_FILENAME = "test-data.txt";

export const TEST_ID_SELECT_TYPE = "select-type";
export const TEST_ID_BUTTON_GENERATE = "button-generate";
export const TEST_ID_DIV_RESULT = "div-result";
export const TEST_ID_INPUT_AMOUNT = "input-amount";
export const TEST_ID_BUTTON_MINUS = "button-minus";
export const TEST_ID_BUTTON_PLUS = "button-plus";
export const TEST_ID_BUTTON_DOWNLOAD = "button-download";

/**
 * Sets up the main user interface for the test data generator application.
 * Creates all UI elements including type selection, country controls, amount input,
 * generate button, download button, and result display area.
 *
 * @param {HTMLElement} app - The main app container element to append UI components to.
 *
 * @example
 * const app = document.getElementById('app');
 * setupUI(app);
 */
export function setupUI(app) {
  // Add heading
  const heading = document.createElement("h1");
  heading.textContent = "Test-Data Generator";
  app.appendChild(heading);

  // Dropdown for selecting what to generate
  const typeLabel = document.createElement("label");
  typeLabel.textContent = "Generate: ";
  const typeSelect = document.createElement("select");
  typeSelect.id = "type-select";
  typeSelect.setAttribute(DATA_TEST_ID, TEST_ID_SELECT_TYPE);
  // Add IBAN, BIC, and UUID options using extracted modules
  typeSelect.appendChild(createBicOption());
  typeSelect.appendChild(createIbanOption());
  typeSelect.appendChild(createUuidOption());
  typeSelect.value = IBAN_OPTION_VALUE; // Preselect IBAN
  typeLabel.appendChild(typeSelect);

  // Country controls (for IBAN and BIC)
  const { countryLabel: ibanCountryLabel, countrySelect: ibanCountrySelect } = createCountryControls();
  const { countryLabel: bicCountryLabel, countrySelect: bicCountrySelect } = createBicCountryControls();

  /**
   * Updates the visibility of country controls based on the selected generation type.
   * Shows country controls only when IBAN or BIC is selected.
   *
   * @example
   * updateCountryDropdown(); // Updates visibility based on current selection
   */
  function updateCountryDropdown() {
    const type = typeSelect.value;
    showIbanCountryControls(type, ibanCountryLabel);
    showBicCountryControls(type, bicCountryLabel);
  }

  typeSelect.addEventListener("change", updateCountryDropdown);
  updateCountryDropdown();

  // Number input for how many results to generate
  const amountLabel = document.createElement("label");
  amountLabel.textContent = " Amount: ";
  const amountInput = document.createElement("input");
  amountInput.id = "amount-input";
  amountInput.type = "number";
  amountInput.min = "1";
  amountInput.value = "1";
  amountInput.style.width = "4em";
  amountInput.setAttribute(DATA_TEST_ID, TEST_ID_INPUT_AMOUNT);

  // Create minus and plus buttons
  const minusButton = document.createElement("button");
  minusButton.type = "button";
  minusButton.textContent = "-";
  minusButton.style.marginLeft = "0.5em";
  minusButton.setAttribute(DATA_TEST_ID, TEST_ID_BUTTON_MINUS);
  const plusButton = document.createElement("button");
  plusButton.type = "button";
  plusButton.textContent = "+";
  plusButton.style.marginLeft = "0.25em";
  plusButton.setAttribute(DATA_TEST_ID, TEST_ID_BUTTON_PLUS);

  // Button event listeners
  minusButton.addEventListener("click", () => {
    let val = parseInt(amountInput.value, 10) || 1;
    val = Math.max(1, val - 1);
    amountInput.value = val;
  });
  plusButton.addEventListener("click", () => {
    let val = parseInt(amountInput.value, 10) || 1;
    val = val + 1;
    amountInput.value = val;
  });

  // Group amount input and buttons in a flex row
  const amountInputGroup = document.createElement("span");
  amountInputGroup.style.display = "inline-flex";
  amountInputGroup.style.alignItems = "center";
  amountInputGroup.appendChild(amountInput);
  amountInputGroup.appendChild(minusButton);
  amountInputGroup.appendChild(plusButton);

  amountLabel.appendChild(amountInputGroup);

  // Generate button
  const generateButton = document.createElement("button");
  generateButton.setAttribute(DATA_TEST_ID, TEST_ID_BUTTON_GENERATE);
  generateButton.textContent = "Generate";

  // Download button
  const downloadButton = document.createElement("button");
  downloadButton.textContent = "Download";
  downloadButton.style.marginBottom = "1em";
  downloadButton.style.display = "none"; // Initially hidden
  downloadButton.setAttribute(DATA_TEST_ID, TEST_ID_BUTTON_DOWNLOAD);

  // Result display
  const resultDiv = document.createElement("div");
  resultDiv.id = RESULT_DIV_ID;
  resultDiv.setAttribute(DATA_TEST_ID, TEST_ID_DIV_RESULT);
  resultDiv.style.marginTop = "2em";

  let lastResults = [];

  // Result section
  const resultSection = document.createElement("div");
  resultSection.style.marginTop = "2em";

  const resultHeading = document.createElement("h2");
  resultHeading.textContent = "Results";
  // Initially hide the results heading
  resultHeading.style.display = "none";
  resultSection.appendChild(resultHeading);
  resultSection.appendChild(downloadButton);
  resultSection.appendChild(resultDiv);

  // Initially hide the result section
  resultSection.style.display = "none";

  // Remove marginLeft styles from labels and button
  ibanCountryLabel.style.marginLeft = "";
  bicCountryLabel.style.marginLeft = "";
  amountLabel.style.marginLeft = "";
  generateButton.style.marginLeft = "";

  // Create a group for the amount input and label
  const amountGroup = document.createElement("div");
  amountGroup.className = "amount-group";
  amountGroup.appendChild(amountLabel);

  // Create a form row container for all controls
  const formRow = document.createElement("div");
  formRow.className = "form-row";
  formRow.appendChild(typeLabel);
  formRow.appendChild(bicCountryLabel);
  formRow.appendChild(ibanCountryLabel);
  formRow.appendChild(amountGroup);
  formRow.appendChild(generateButton);

  // Move all UI elements after heading
  app.appendChild(formRow);
  app.appendChild(resultSection);

  // Map of generator functions by type
  const generators = {
    iban: (args) => generateIBAN(args.country),
    bic: (args) => generateBIC(args.country),
    uuidv4: () => generateUUID(),
    // Add more generators here as needed
  };

  /**
   * Gets the arguments for the currently selected generation type.
   *
   * @returns {Object} Arguments object for the selected generator type.
   *
   * @example
   * const args = getSelectedArgs();
   * // Returns: { country: 'DE' } for IBAN and BIC, or {} for UUID
   */
  function getSelectedArgs() {
    const type = typeSelect.value;
    if (type === IBAN_OPTION_VALUE) {
      return getIbanArgs(ibanCountrySelect);
    }
    if (type === BIC_OPTION_VALUE) {
      return getBicArgs(bicCountrySelect);
    }
    if (type === UUIDV4_OPTION_VALUE) {
      return getUuidArgs();
    }
    return {};
  }

  /**
   * Generates test data based on the current UI selections.
   * Updates the result display and download button visibility.
   *
   * @example
   * generateData(); // Generates data based on current form values
   */
  function generateData() {
    const type = typeSelect.value;
    const amount = Math.max(1, parseInt(amountInput.value, 10) || 1);
    const args = getSelectedArgs();
    const generator = generators[type];
    if (!generator) {
      resultDiv.textContent = "No generator available for selected type.";
      return;
    }
    const results = [];
    for (let i = 0; i < amount; i++) {
      try {
        results.push(generator(args));
      } catch (e) {
        results.push("Error: " + e.message);
      }
    }
    lastResults = results;
    // Display all results
    resultDiv.innerHTML = results.map((r) => `<div>${r}</div>`).join("");
    if (results.length === 0) {
      downloadButton.style.display = "none";
      resultHeading.style.display = "none";
      resultSection.style.display = "none";
    } else {
      downloadButton.style.display = "block";
      downloadButton.disabled = false;
      resultHeading.style.display = "block";
      resultSection.style.display = "block";
    }
  }

  generateButton.addEventListener("click", generateData);

  downloadButton.addEventListener("click", () => {
    if (!lastResults.length) return;
    const blob = new Blob([lastResults.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = DOWNLOAD_FILENAME;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  });
}
