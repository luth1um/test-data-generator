/* global document */

import { DATA_TEST_ID } from "./misc/testgenConstants.js";

export const IBAN_COUNTRIES = [
  { code: "DE", name: "Germany (DE)" },
  { code: "NO", name: "Norway (NO)" },
];

export const IBAN_OPTION_VALUE = "iban";

export function createIbanOption() {
  const ibanOption = document.createElement("option");
  ibanOption.value = IBAN_OPTION_VALUE;
  ibanOption.textContent = "IBAN";
  return ibanOption;
}

export function createCountryControls() {
  const countryLabel = document.createElement("label");
  countryLabel.textContent = " Country: ";
  const countrySelect = document.createElement("select");
  countrySelect.id = "country-select";
  countrySelect.setAttribute(DATA_TEST_ID, "select-country");
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
  countryLabel.style.display = type === IBAN_OPTION_VALUE ? "" : "none";
}

export function getIbanArgs(countrySelect) {
  return { country: countrySelect.value };
}
