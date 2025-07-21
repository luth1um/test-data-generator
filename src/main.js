/* global document, Blob, URL, setTimeout */
document.getElementById("app").innerText = "Hello, World!";

// Create the main container
const app = document.getElementById("app");
app.innerHTML = "";

// Add heading
const heading = document.createElement("h1");
heading.textContent = "Test Data Generator";
app.appendChild(heading);

// Dropdown for selecting what to generate
const typeLabel = document.createElement("label");
typeLabel.textContent = "Generate: ";
const typeSelect = document.createElement("select");
typeSelect.id = "type-select";
const ibanOption = document.createElement("option");
ibanOption.value = "iban";
ibanOption.textContent = "IBAN";
typeSelect.appendChild(ibanOption);
typeSelect.value = "iban"; // Preselect IBAN

typeLabel.appendChild(typeSelect);
// app.appendChild(typeLabel); // Moved

// Country dropdown (only for IBAN)
const countryLabel = document.createElement("label");
countryLabel.textContent = " Country: ";
countryLabel.style.marginLeft = "1em";
const countrySelect = document.createElement("select");
countrySelect.id = "country-select";
const deOption = document.createElement("option");
deOption.value = "DE";
deOption.textContent = "Germany (DE)";
countrySelect.appendChild(deOption);
countrySelect.value = "DE";

countryLabel.appendChild(countrySelect);
// app.appendChild(countryLabel); // Moved

// Show/hide country dropdown based on type selection
function updateCountryDropdown() {
  if (typeSelect.value === "iban") {
    countryLabel.style.display = "";
  } else {
    countryLabel.style.display = "none";
  }
}

typeSelect.addEventListener("change", updateCountryDropdown);
updateCountryDropdown();

// Number input for how many results to generate
const amountLabel = document.createElement("label");
amountLabel.textContent = " Amount: ";
amountLabel.style.marginLeft = "1em";
const amountInput = document.createElement("input");
amountInput.type = "number";
amountInput.min = "1";
amountInput.value = "1";
amountInput.style.width = "4em";
amountLabel.appendChild(amountInput);
// app.appendChild(amountLabel); // Moved

// Generate button
const generateButton = document.createElement("button");
generateButton.textContent = "Generate";
generateButton.style.marginLeft = "1em";
// app.appendChild(generateButton); // Moved

// Download button
const downloadButton = document.createElement("button");
downloadButton.textContent = "Download";
downloadButton.style.marginBottom = "1em";
downloadButton.style.display = "none"; // Initially hidden
// app.appendChild(downloadButton); // Moved

// Result display
const resultDiv = document.createElement("div");
resultDiv.id = "result";
resultDiv.style.marginTop = "2em";
// app.appendChild(resultDiv); // Moved

let lastResults = [];

// Import generator(s)
import("./iban.js").then(({ generateIBAN }) => {
  // Map of generator functions by type
  const generators = {
    iban: (args) => generateIBAN(args.country),
    // Add more generators here as needed
  };

  function getSelectedArgs() {
    const type = typeSelect.value;
    if (type === "iban") {
      return { country: countrySelect.value };
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
    } else {
      downloadButton.style.display = "block";
      downloadButton.disabled = false;
      resultHeading.style.display = "block";
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

// Move all UI elements after heading
app.appendChild(typeLabel);
app.appendChild(countryLabel);
app.appendChild(amountLabel);
app.appendChild(generateButton);
app.appendChild(resultSection);
