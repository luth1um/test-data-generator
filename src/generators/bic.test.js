import { describe, expect, it } from "vitest";
import { BIC_SUPPORTED_COUNTRY_CODES, generateBIC } from "./bic.js";
import { ALL_LETTERS_AND_ALL_DIGITS } from "../misc/randomUtils.js";
import { RANDOM_FUNCTION_TEST_CALL_COUNT } from "../misc/testgenConstants.js";

const INVALID_COUNTRY_CODES = ["", "D", "DEU", "de"];

describe.each(BIC_SUPPORTED_COUNTRY_CODES)("The generator for %s BICs", (countryCode) => {
  it("should only generate string with length 8 or 11", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // when
    const bic = generateBIC(countryCode);

    // then
    const hasLength8or11 = bic.length === 8 || bic.length === 11;
    expect(hasLength8or11).toBe(true);
  });

  it("should sometimes generate string with length 8", () => {
    // given
    const numberOfBics = RANDOM_FUNCTION_TEST_CALL_COUNT * 10;

    // when
    const bics = Array.from({ length: numberOfBics }, () => generateBIC(countryCode));

    // then
    const bicLengths = bics.map((bic) => bic.length);
    expect(bicLengths).toContain(8);
  });

  it("should sometimes generate string with length 11", () => {
    // when
    const bics = Array.from({ length: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => generateBIC(countryCode));

    // then
    const bicLengths = bics.map((bic) => bic.length);
    expect(bicLengths).toContain(11);
  });

  it(
    "should only generate letters for the bank code (first 4 characters)",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const bic = generateBIC(countryCode);

      // then
      const bankCode = bic.substring(0, 4);
      expect(bankCode).toMatch(/^[A-Z]{4}$/);
    }
  );

  it(
    "should have the country code at positions 4 and 5 (0-indexed)",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const bic = generateBIC(countryCode);

      // then
      const chars5And6 = bic.substring(4, 6);
      expect(chars5And6).toBe(countryCode);
    }
  );

  it("should not produce 0 or 1 at position 6 (0-indexed)", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // when
    const bic = generateBIC(countryCode);

    // then
    const char7 = bic[6];
    expect(["0", "1"]).not.toContain(char7);
  });

  it("should produce a letter or digit at position 7 (0-indexed)", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // when
    const bic = generateBIC(countryCode);

    // then
    const char8 = bic[7];
    expect(ALL_LETTERS_AND_ALL_DIGITS).toContain(char8);
  });

  it("should not produce the letter O at position 7 (0-indexed)", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // when
    const bic = generateBIC(countryCode);

    // then
    const char8 = bic[7];
    expect(char8).not.toEqual("O");
  });

  it(
    "should produce letters and/or digits at positions 8 to 10 (0-indexed)",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when (repeat until BIC with 11 chars is produced, or stop if no such BIC is produced)
      const bic = Array.from({ length: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => generateBIC(countryCode)).find(
        (bic) => bic.length === 11
      );

      if (!bic) {
        throw new Error(`Did not produce BIC with 11 characters after ${RANDOM_FUNCTION_TEST_CALL_COUNT} iterations.`);
      }

      // then
      const branchCode = bic.substring(8, 11);
      expect(branchCode).toMatch(/^[A-Z0-9]{3}$/);
    }
  );

  it(
    "should only produce X at position 8 (0-indexed) if branch code is XXX",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      //given
      const numberOfBics = RANDOM_FUNCTION_TEST_CALL_COUNT * 10;

      // when
      // produce a few BICs such that at least some results have 'X' at pos 8
      const bics = Array.from({ length: numberOfBics }, () => generateBIC(countryCode)).filter((bic) => bic[8] === "X");

      // throw error if no BIC with 'X' at pos 8 is produced
      if (bics.length === 0) {
        throw new Error(`Did not produce BIC with 'X' at pos 8 (0-indexed)  after ${numberOfBics} iterations.`);
      }

      // then
      bics.forEach((bic) => {
        expect(bic.substring(9, 11)).toBe("XX");
      });
    }
  );

  it("should produce different BICs with each call", () => {
    // when
    const bics = Array.from({ length: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => generateBIC(countryCode));

    // then
    const uniqueBics = new Set(bics);
    expect(uniqueBics.size).toBe(bics.length);
  });
});

describe("The error handling of the BIC generator", () => {
  it("should throw an error for unsupported country codes", () => {
    // given
    const unsupportedCountry = "XY";

    // when / then
    expect(() => generateBIC(unsupportedCountry)).toThrow(
      `BIC generation for country code '${unsupportedCountry}' is not supported.`
    );
  });

  it.each(INVALID_COUNTRY_CODES)("should throw an error for invalid country code format '%s'", (invalidCountryCode) => {
    // when / then
    expect(() => generateBIC(invalidCountryCode)).toThrow();
  });

  it.each([null, undefined, 123, {}, []])("should throw an error for non-string input '$0'", (countryCode) => {
    // when / then
    expect(() => generateBIC(countryCode)).toThrow();
  });
});
