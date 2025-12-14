import { describe, expect, it } from "vitest";
import { generateIBAN, IBAN_SUPPORTED_COUNTRIES } from "./iban.js";
import { RANDOM_FUNCTION_TEST_CALL_COUNT } from "../misc/testgenConstants.js";
import { COUNTRIES } from "../misc/countries.js";

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
  new IBANTestConfiguration(COUNTRIES.ANDORRA, 24, /^\d{8}[A-Z0-9]{12}$/),
  new IBANTestConfiguration(COUNTRIES.AUSTRIA, 20, /^\d+$/),
  new IBANTestConfiguration(COUNTRIES.BELGIUM, 16, /^\d+$/),
  new IBANTestConfiguration(COUNTRIES.BULGARIA, 22, /^[A-Z]{4}\d{6}[A-Z0-9]{8}$/),
  new IBANTestConfiguration(COUNTRIES.CROATIA, 21, /^\d+$/),
  new IBANTestConfiguration(COUNTRIES.CYPRUS, 28, /^\d{8}[A-Z0-9]{16}$/),
  new IBANTestConfiguration(COUNTRIES.FRANCE, 27, /^\d{10}[A-Z0-9]{11}\d{2}$/),
  new IBANTestConfiguration(COUNTRIES.GERMANY, 22, /^\d+$/),
  new IBANTestConfiguration(COUNTRIES.GREECE, 27, /^\d{7}[A-Z0-9]{16}$/),
  new IBANTestConfiguration(COUNTRIES.ICELAND, 26, /^\d+$/),
  new IBANTestConfiguration(COUNTRIES.IRELAND, 22, /^[A-Z]{4}\d{14}$/),
  new IBANTestConfiguration(COUNTRIES.ITALY, 27, /^[A-Z]\d{10}[A-Z0-9]{12}$/),
  new IBANTestConfiguration(COUNTRIES.LATVIA, 21, /^[A-Z]{4}[A-Z0-9]{13}$/),
  new IBANTestConfiguration(COUNTRIES.LITHUANIA, 20, /^\d+$/),
  new IBANTestConfiguration(COUNTRIES.LUXEMBOURG, 20, /^\d{3}[A-Z0-9]{13}$/),
  new IBANTestConfiguration(COUNTRIES.MALTA, 31, /^[A-Z]{4}\d{5}[A-Z0-9]{18}$/),
  new IBANTestConfiguration(COUNTRIES.NETHERLANDS, 18, /^[A-Z0-9]{4}\d{10}$/),
  new IBANTestConfiguration(COUNTRIES.NORWAY, 15, /^\d+$/),
  new IBANTestConfiguration(COUNTRIES.ROMANIA, 24, /^[A-Z0-9]{4}[A-Z0-9]{16}$/),
  new IBANTestConfiguration(COUNTRIES.RUSSIA, 33, /^\d{14}[A-Z0-9]{15}$/),
  new IBANTestConfiguration(COUNTRIES.SPAIN, 24, /^\d+$/),
  new IBANTestConfiguration(COUNTRIES.SWITZERLAND, 21, /^\d+$/),
  new IBANTestConfiguration(COUNTRIES.VATICAN_CITY, 22, /^\d+$/),
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

describe("The generator for Belgian IBANs", () => {
  it("should produce IBANs with the correct national check digit", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // when
    const iban = generateIBAN(COUNTRIES.BELGIUM.isoCode);
    const nationalCheckDigits = iban.substring(iban.length - 2);
    const bbanWithoutCheckDigits = iban.substring(4, iban.length - 2);

    // then
    const digits = Number(bbanWithoutCheckDigits) % 97;
    let digitString;
    if (digits === 0) {
      digitString = "97";
    } else {
      digitString = String(digits).padStart(2, "0");
    }

    expect(nationalCheckDigits).toBe(digitString);
  });
});

describe("The generator for Dutch IBANs", () => {
  it("should produce IBANs with the correct national check digit", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // when
    const iban = generateIBAN(COUNTRIES.NETHERLANDS.isoCode);
    const accountNumber = iban.substring(8);

    // then
    let weightedSum = 0;
    for (let i = 0; i < accountNumber.length; i++) {
      weightedSum += (10 - i) * Number(accountNumber[i]);
    }
    expect(weightedSum % 11).toBe(0);
  });
});

describe("The generator for French IBANs", () => {
  it(
    "should produce IBANs with the correct RIB key (national check digits)",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const iban = generateIBAN(COUNTRIES.FRANCE.isoCode);
      const ribKey = iban.substring(iban.length - 2);
      const bbanWithoutCheckDigits = iban.substring(4, iban.length - 2);

      const ribMap = {
        A: "1",
        B: "2",
        C: "3",
        D: "4",
        E: "5",
        F: "6",
        G: "7",
        H: "8",
        I: "9",
        J: "1",
        K: "2",
        L: "3",
        M: "4",
        N: "5",
        O: "6",
        P: "7",
        Q: "8",
        R: "9",
        S: "2",
        T: "3",
        U: "4",
        V: "5",
        W: "6",
        X: "7",
        Y: "8",
        Z: "9",
      };

      // then
      const lettersToNumbers = (s) => s.replace(/[A-Z]/g, (c) => ribMap[c]);
      const bbanToNumberString = lettersToNumbers(bbanWithoutCheckDigits);

      const bbanNumber = BigInt(bbanToNumberString + "00");
      const ribKeyNumber = BigInt(ribKey);

      const verificationResult = (bbanNumber + ribKeyNumber) % 97n;

      expect(verificationResult).toEqual(0n);
    }
  );
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
      sum += parseInt(bbanWithoutCheckDigit[9 - i], 10) * weights[i];
    }
    const checkDigit = 11 - (sum % 11);
    const calculatedCheckDigit = checkDigit === 11 ? String(0) : String(checkDigit);

    expect(calculatedCheckDigit).toBe(nationalCheckDigit);
  });

  it("should not produce digit 0 at position 4 (0-indexed)", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // when
    const iban = generateIBAN(COUNTRIES.NORWAY.isoCode);

    // then
    const char5 = iban[4];
    expect(char5).not.toBe("0");
  });
});

describe("The generator for Spanish IBANs", () => {
  it(
    "should generate the correct check digit DC1 for bank code and branch code",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // given
      const weights = [4, 8, 5, 10, 9, 7, 3, 6];

      // when
      const iban = generateIBAN(COUNTRIES.SPAIN.isoCode);

      // then
      const bankAndBranchCode = iban.substring(4, 12);
      const dc1 = Number(iban[12]);

      let weightedSum = 0;
      for (let i = 0; i < bankAndBranchCode.length; i++) {
        weightedSum += Number(bankAndBranchCode[i]) * weights[i];
      }
      if (weightedSum % 11 === 1) {
        // 10 (11 - 1) becomes 1 in the calculation algorithm => must be undone for the check (i.e., +9)
        weightedSum += 9;
      }

      const remainder = (weightedSum + dc1) % 11;
      expect(remainder).toBe(0);
    }
  );

  it(
    "should generate the correct check digit DC2 for the account number",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // given
      const weights = [1, 2, 4, 8, 5, 10, 9, 7, 3, 6];

      // when
      const iban = generateIBAN(COUNTRIES.SPAIN.isoCode);

      // then
      const accountNumber = iban.substring(14);
      const dc2 = Number(iban[13]);

      let weightedSum = 0;
      for (let i = 0; i < accountNumber.length; i++) {
        weightedSum += Number(accountNumber[i]) * weights[i];
      }
      if (weightedSum % 11 === 1) {
        // 10 (11 - 1) becomes 1 in the calculation algorithm => must be undone for the check (i.e., +9)
        weightedSum += 9;
      }

      const remainder = (weightedSum + dc2) % 11;
      expect(remainder).toBe(0);
    }
  );
});

describe("The error handling of the IBAN generator", () => {
  it("should throw an error for unsupported country codes", () => {
    // given
    const unsupportedCountry = "XY";

    // when / then
    expect(() => generateIBAN(unsupportedCountry)).toThrow(
      `IBAN generation for country code '${unsupportedCountry}' is not supported.`
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
