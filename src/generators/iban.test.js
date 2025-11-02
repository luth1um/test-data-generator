import { describe, expect, it } from "vitest";
import { generateIBAN, IBAN_SUPPORTED_COUNTRIES } from "./iban.js";
import { RANDOM_FUNCTION_TEST_CALL_COUNT } from "../misc/testgenConstants.js";
import { COUNTRIES } from "../misc/countries.js";

const UNSUPPORTED_COUNTRY_CODES = [COUNTRIES.FRANCE.isoCode, COUNTRIES.ITALY.isoCode, COUNTRIES.UK.isoCode];
const INVALID_COUNTRY_CODES = ["", "D", "DEU", "de"];

class IBANTestConfiguration {
  /**
   * @param {Country} country - Country
   * @param {number} length - Expected IBAN length
   * @param {RegExp} bban - Regex pattern for the BBAN part
   */
  constructor(country, length, bban) {
    this.country = country;
    this.length = length;
    this.bbanFormatRegex = bban;
  }
}

const COUNTRY_CONFIGS = [
  new IBANTestConfiguration(COUNTRIES.GERMANY, 22, /^\d+$/),
  new IBANTestConfiguration(COUNTRIES.MALTA, 31, /^[A-Z]{4}\d{5}[A-Z0-9]{18}$/),
  new IBANTestConfiguration(COUNTRIES.NORWAY, 15, /^\d+$/),
];

describe("The list of IBAN countries", () => {
  it("should have the same length as the list of IBAN test configurations (pre-condition for tests)", () => {
    // when / then
    expect(COUNTRY_CONFIGS.length).toBe(IBAN_SUPPORTED_COUNTRIES.length);
  });
});

describe.each(COUNTRY_CONFIGS)("The generator for IBANs of $country.name", (config) => {
  it("should produce IBANs with correct length", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // when
    const iban = generateIBAN(config.country.isoCode);

    // then
    expect(iban.length).toBe(config.length);
  });

  it(
    `should produce IBANs starting with '${config.country.isoCode}'`,
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const iban = generateIBAN(config.country.isoCode);

      // then
      const countryCode = iban.substring(0, 2);
      expect(countryCode).toBe(config.country.isoCode);
    }
  );

  it("should match the country format", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // when
    const iban = generateIBAN(config.country.isoCode);

    // then
    const bban = iban.substring(4);
    expect(bban).toMatch(config.bbanFormatRegex);
  });

  it("should produce IBANs having valid check digits", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // when
    const iban = generateIBAN(config.country.isoCode);

    // then
    const checkDigits = iban.substring(2, 4);
    const calculatedCheckDigits = generateIBANCheckDigits(iban);
    expect(checkDigits).toBe(calculatedCheckDigits);
  });

  it("should produce different IBANs with each call", () => {
    // when
    const ibans = Array.from({ length: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => generateIBAN(config.country.isoCode));

    // then
    const uniqueIbans = new Set(ibans);
    expect(uniqueIbans.size).toBe(ibans.length);
  });
});

describe("The generator for Norwegian IBANs", () => {
  it("should produce IBANs with the correct national check digit", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // when
    const iban = generateIBAN(COUNTRIES.NORWAY.isoCode);
    const nationalCheckDigit = iban[iban.length - 1];
    const bbanWithoutCheckDigit = iban.substring(4, 14);

    // then
    const weights = [2, 3, 4, 5, 6, 7, 2, 3, 4, 5];
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(bbanWithoutCheckDigit[i], 10) * weights[i];
    }
    const checkDigit = 11 - (sum % 11);
    const calculatedCheckDigit = checkDigit === 11 ? String(0) : String(checkDigit);

    expect(nationalCheckDigit).toEqual(calculatedCheckDigit);
  });

  it("should not produce digit 0 at position 4 (0-indexed)", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // when
    const iban = generateIBAN(COUNTRIES.NORWAY.isoCode);

    // then
    const char5 = iban[4];
    expect(char5).not.toBe("0");
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
