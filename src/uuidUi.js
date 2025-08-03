/* global document */

export const UUIDV4_OPTION_VALUE = "uuidv4";

export function createUuidOption() {
  const uuidOption = document.createElement("option");
  uuidOption.value = UUIDV4_OPTION_VALUE;
  uuidOption.textContent = "UUID v4";
  return uuidOption;
}

export function getUuidArgs() {
  return {};
}
