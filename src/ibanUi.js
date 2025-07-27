/* global document */

// Array of supported IBAN countries
export const IBAN_COUNTRIES = [
  { code: "DE", name: "Germany (DE)" },
  { code: "NO", name: "Norway (NO)" },
  // Add more countries here as needed
];

export function createIbanOption() {
  const ibanOption = document.createElement("option");
  ibanOption.value = "iban";
  ibanOption.textContent = "IBAN";
  return ibanOption;
}

export function createCountryControls() {
  const countryLabel = document.createElement("label");
  countryLabel.textContent = " Country: ";
  const countrySelect = document.createElement("select");
  countrySelect.id = "country-select";
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

export function showCountryControls(type, countryLabel) {
  countryLabel.style.display = type === "iban" ? "" : "none";
}

export function getIbanArgs(countrySelect) {
  return { country: countrySelect.value };
}
