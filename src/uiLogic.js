/* global document, Blob, URL, setTimeout */

import { createIbanOption, createCountryControls, showCountryControls, getIbanArgs } from "./ibanUi.js";
import { createUuidOption, getUuidArgs } from "./uuidUi.js";

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
  // Add IBAN and UUID options using extracted modules
  typeSelect.appendChild(createIbanOption());
  typeSelect.appendChild(createUuidOption());
  typeSelect.value = "iban"; // Preselect IBAN
  typeLabel.appendChild(typeSelect);

  // Country controls (only for IBAN)
  const { countryLabel, countrySelect } = createCountryControls();

  // Show/hide country dropdown based on type selection
  function updateCountryDropdown() {
    showCountryControls(typeSelect.value, countryLabel);
  }
  typeSelect.addEventListener("change", updateCountryDropdown);
  updateCountryDropdown();

  // Number input for how many results to generate
  const amountLabel = document.createElement("label");
  amountLabel.textContent = " Amount: ";
  const amountInput = document.createElement("input");
  amountInput.type = "number";
  amountInput.min = "1";
  amountInput.value = "1";
  amountInput.style.width = "4em";
  amountLabel.appendChild(amountInput);

  // Generate button
  const generateButton = document.createElement("button");
  generateButton.textContent = "Generate";

  // Download button
  const downloadButton = document.createElement("button");
  downloadButton.textContent = "Download";
  downloadButton.style.marginBottom = "1em";
  downloadButton.style.display = "none"; // Initially hidden

  // Result display
  const resultDiv = document.createElement("div");
  resultDiv.id = "result";
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
  countryLabel.style.marginLeft = "";
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
  formRow.appendChild(countryLabel);
  formRow.appendChild(amountGroup);
  formRow.appendChild(generateButton);

  // Move all UI elements after heading
  app.appendChild(formRow);
  app.appendChild(resultSection);

  // Import generator(s)
  Promise.all([import("./generators/iban.js"), import("./generators/uuid.js")]).then(([ibanModule, uuidModule]) => {
    const { generateIBAN } = ibanModule;
    const { generateUUID } = uuidModule;
    // Map of generator functions by type
    const generators = {
      iban: (args) => generateIBAN(args.country),
      uuidv4: () => generateUUID(),
      // Add more generators here as needed
    };

    function getSelectedArgs() {
      const type = typeSelect.value;
      if (type === "iban") {
        return getIbanArgs(countrySelect);
      }
      if (type === "uuidv4") {
        return getUuidArgs();
      }
      return {};
    }

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
  });

  downloadButton.addEventListener("click", () => {
    if (!lastResults.length) return;
    const blob = new Blob([lastResults.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "test-data.txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  });
}
