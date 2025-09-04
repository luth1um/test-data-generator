import { describe, expect, it } from "vitest";
import { generateIBAN } from "./iban.js";

const RANDOM_FUNCTION_CALL_COUNT = 100;
const UNSUPPORTED_COUNTRY_CODES = ["US", "GB", "FR", "IT", "ES", "NL", "BE", "AT", "CH"];
const INVALID_COUNTRY_CODES = ["", "D", "DEU", "de"];

class IBANTestConfiguration {
  /**
   * @param {string} country - Country
   * @param {string} countryCode - Two-letter country code
   * @param {number} length - Expected IBAN length
   * @param {RegExp} bban - Regex pattern for the BBAN part
   */
  constructor(country, countryCode, length, bban) {
    this.country = country;
    this.countryCode = countryCode;
    this.length = length;
    this.bbanFormatRegex = bban;
  }
}

const COUNTRY_CONFIGS = [
  new IBANTestConfiguration("German", "DE", 22, /^\d+$/),
  new IBANTestConfiguration("Norwegian", "NO", 15, /^\d+$/),
];

describe.each(COUNTRY_CONFIGS)("The generator for $country IBANs", (config) => {
  it("should produce IBANs with correct length", { repeats: RANDOM_FUNCTION_CALL_COUNT }, () => {
    // when
    const iban = generateIBAN(config.countryCode);

    // then
    expect(iban.length).toBe(config.length);
  });

  it(`should produce IBANs starting with '${config.countryCode}'`, { repeats: RANDOM_FUNCTION_CALL_COUNT }, () => {
    // when
    const iban = generateIBAN(config.countryCode);

    // then
    const countryCode = iban.substring(0, 2);
    expect(countryCode).toBe(config.countryCode);
  });

  it("should match the country format", { repeats: RANDOM_FUNCTION_CALL_COUNT }, () => {
    // when
    const iban = generateIBAN(config.countryCode);

    // then
    const bban = iban.substring(4);
    expect(bban).toMatch(config.bbanFormatRegex);
  });

  it("should produce IBANs having valid check digits", { repeats: RANDOM_FUNCTION_CALL_COUNT }, () => {
    // when
    const iban = generateIBAN(config.countryCode);

    // then
    const checkDigits = iban.substring(2, 4);
    const calculatedCheckDigits = generateIBANCheckDigits(iban);
    expect(checkDigits).toBe(calculatedCheckDigits);
  });

  it("should produce different IBANs with each call", () => {
    // when
    const ibans = Array.from({ length: RANDOM_FUNCTION_CALL_COUNT }, () => generateIBAN(config.countryCode));

    // then
    const uniqueIbans = new Set(ibans);
    expect(uniqueIbans.size).toBe(ibans.length);
  });
});

describe("The error handling of the IBAN generator", () => {
  it.each(UNSUPPORTED_COUNTRY_CODES)("should throw an error for unsupported country code $0", (countryCode) => {
    // when / then
    expect(() => generateIBAN(countryCode)).toThrow(
      `IBAN generation for country code '${countryCode}' is not supported.`
    );
  });

  it.each(INVALID_COUNTRY_CODES)("should throw an error for invalid country code format '%s'", (invalidCountryCode) => {
    // when / then
    expect(() => generateIBAN(invalidCountryCode)).toThrow();
  });

  it.each([null, undefined, 123, {}, []])("should throw an error for non-string input '$0'", (countryCode) => {
    // when / then
    expect(() => generateIBAN(countryCode)).toThrow();
  });
});

/**
 * Generates check digits for an IBAN.
 * @param {string} iban - IBAN with "00" as check digits
 * @returns {string} Two check digits
 */
function generateIBANCheckDigits(iban) {
  // Extract country code and BBAN
  const countryCode = iban.substring(0, 2);
  const bban = iban.substring(4);

  const rearranged = bban + countryCode + "00";

  // Convert letters to numbers (A=10, B=11, ...)
  const converted = rearranged
    .split("")
    .map((char) => {
      if (/[0-9]/.test(char)) return char;
      return (char.toUpperCase().charCodeAt(0) - 55).toString();
    })
    .join("");

  const remainder = BigInt(converted) % 97n;
  return String(98n - remainder).padStart(2, "0");
}
