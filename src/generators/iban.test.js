import { describe, expect, it } from "vitest";
import { generateIBAN } from "./iban.js";

const randomFunctionCallCount = 100;

describe("generateIBAN", () => {
  describe("The generator for German IBANs", () => {
    it("should produce IBANs with correct length", () => {
      // when
      const ibans = generateRandomGermanIBANs(randomFunctionCallCount);

      // then
      ibans.forEach((iban) => {
        expect(iban.length).toBe(22);
      });
    });

    it("should produce IBANs starting with 'DE'", () => {
      // when
      const ibans = generateRandomGermanIBANs(randomFunctionCallCount);

      // then
      ibans.forEach((iban) => {
        const countryCode = iban.substring(0, 2);
        expect(countryCode).toBe("DE");
      });
    });

    it("should only have numbers after 'DE'", () => {
      // when
      const ibans = generateRandomGermanIBANs(randomFunctionCallCount);

      // then
      ibans.forEach((iban) => {
        const rest = iban.substring(2);
        expect(rest).toMatch(/^\d+$/);
      });
    });

    it("should produce IBANs having valid check digits", () => {
      // when
      const ibans = generateRandomGermanIBANs(randomFunctionCallCount);

      // then
      ibans.forEach((iban) => {
        const checkDigits = iban.substring(2, 4);
        const calculatedCheckDigits = generateIBANCheckDigits(iban);
        expect(checkDigits).toBe(calculatedCheckDigits);
      });
    });

    it("should produce different IBANs with each call", () => {
      // when
      const ibans = generateRandomGermanIBANs(randomFunctionCallCount);

      // then
      const uniqueIbans = new Set(ibans);
      expect(uniqueIbans.size).toBe(ibans.length);
    });
  });

  describe("The error handling", () => {
    it("should throw an error for unsupported country codes", () => {
      // given
      const unsupportedCountries = ["US", "GB", "FR", "IT", "ES", "NL", "BE", "AT", "CH"];

      // when / then
      unsupportedCountries.forEach((countryCode) => {
        expect(() => generateIBAN(countryCode)).toThrow(
          `IBAN generation for country code '${countryCode}' is not supported.`
        );
      });
    });

    it("should throw an error for invalid country code format", () => {
      // given
      const invalidCountryCodes = ["", "D", "DEU", "de"];

      // when / then
      invalidCountryCodes.forEach((invalidCountryCode) => {
        expect(() => generateIBAN(invalidCountryCode)).toThrow();
      });
    });

    it("should throw an error for non-string inputs", () => {
      // given
      const nonStringInputs = [null, undefined, 123, {}, []];

      // when / then
      nonStringInputs.forEach((input) => {
        expect(() => generateIBAN(input)).toThrow();
      });
    });
  });
});

/**
 * Generates an array of IBANs for a given country code.
 * @param {string} countryCode - The country code for IBAN generation (e.g., 'DE').
 * @param {number} count - The number of IBANs to generate.
 * @returns {string[]} Array of generated IBANs.
 */
function generateRandomIBANs(countryCode, count) {
  const ibans = [];
  for (let i = 0; i < count; i++) {
    ibans.push(generateIBAN(countryCode));
  }
  return ibans;
}

/**
 * Generates multiple German IBANs.
 * @param {number} count - The number of IBANs to generate.
 * @returns {string[]} Array of generated German IBANs.
 */
function generateRandomGermanIBANs(count) {
  return generateRandomIBANs("DE", count);
}

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
