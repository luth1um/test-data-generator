/* global document */

export function createUuidOption() {
  const uuidOption = document.createElement("option");
  uuidOption.value = "uuidv4";
  uuidOption.textContent = "UUID v4";
  return uuidOption;
}

export function getUuidArgs() {
  return {};
}
