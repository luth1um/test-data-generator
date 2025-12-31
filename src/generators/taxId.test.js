import {
  TAX_ID_GERMANY_STEUER_ID,
  TAX_ID_GERMANY_UST_ID,
  TAX_ID_TYPES,
  TYPE_DISPLAY_NAME_MAP,
  generateTaxId,
} from "./taxId.js";
import { describe, expect, it } from "vitest";
import { ALL_DIGITS } from "../misc/randomUtils.js";
import { RANDOM_FUNCTION_TEST_CALL_COUNT } from "../misc/testgenConstants.js";
import { checkDigitIsoIec7064Mod1110 } from "../misc/checksumUtils.js";
import { digitCount } from "../misc/numberUtils.js";

describe.each(TAX_ID_TYPES)("The tax-ID generator", (type) => {
  it(
    `should generate a truthy result when the input is valid type '${type}'`,
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const result = generateTaxId(type);

      // then
      expect(result).toBeTruthy();
    },
  );

  it(
    `should generate a string when the input is valid type '${type}'`,
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const result = generateTaxId(type);

      // then
      expect(typeof result).toBe("string");
    },
  );
});

describe("The tax-ID generator", () => {
  it(
    "should generate a string of length 11 when a German Steuer-IdNr. is selected as type",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_STEUER_ID);

      // then
      expect(id).toHaveLength(11);
    },
  );

  it(
    "should generate a string only consisting of digits when a German Steuer-IdNr. is selected as type",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_STEUER_ID);

      // then
      for (const digit of id) {
        expect(digit).toBeOneOf(Array.from(ALL_DIGITS));
      }
    },
  );

  it(
    "should generate an ID with exactly one digit being used more than once when a German Steuer-IdNr. is selected as type",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const idWithoutCheck = generateTaxId(TAX_ID_GERMANY_STEUER_ID).substring(0, 10);

      // then
      const digitCounts = digitCount(idWithoutCheck);

      let digitsBeingUsedMoreThanOnce = 0;
      for (const count of digitCounts.values()) {
        if (count > 1) {
          digitsBeingUsedMoreThanOnce++;
        }
      }

      expect(digitsBeingUsedMoreThanOnce).toBe(1);
    },
  );

  it(
    "should generate an ID with no digit being used more than three times when a German Steuer-IdNr. is selected as type",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_STEUER_ID);
      const idWithoutCheck = id.substring(0, 10);

      // then
      const c = digitCount(idWithoutCheck);

      for (const count of c.values()) {
        expect(count).toBeLessThanOrEqual(3);
      }
    },
  );

  it(
    "should generate an ID where no digit is used more than twice subsequently when a German Steuer-IdNr. is selected as type",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_STEUER_ID);
      const idWithoutCheck = id.substring(0, 10);

      // then
      for (let i = 2; i < idWithoutCheck.length; i++) {
        const currentMinusTwo = idWithoutCheck[i - 2];
        const currentMinusOne = idWithoutCheck[i - 1];
        const current = idWithoutCheck[i];
        const threeEqualSubsequently = currentMinusTwo === currentMinusOne && currentMinusOne === current;

        expect(threeEqualSubsequently).toBe(false);
      }
    },
  );

  it(
    "should generate an ID with a valid checksum when a German Steuer-IdNr. is selected as type",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const steuerId = generateTaxId(TAX_ID_GERMANY_STEUER_ID);

      // then
      const idWithoutCheck = steuerId.substring(0, steuerId.length - 1);
      const checkDigit = steuerId[steuerId.length - 1];
      const expectedCheckDigit = checkDigitIsoIec7064Mod1110(idWithoutCheck);

      expect(checkDigit).toBe(expectedCheckDigit);
    },
  );

  it(
    "should generate an ID that does not start with '0' when a German Steuer-IdNr. is selected as type",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_STEUER_ID);

      // then
      expect(id[0]).not.toBe("0");
    },
  );

  it(
    "should generate a string of length 11 when the German USt-IdNr. is selected",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_UST_ID);

      // then
      expect(id).toHaveLength(11);
    },
  );

  it(
    "should generate a string starting with 'DE' when the German USt-IdNr. is selected",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_UST_ID);

      // then
      const countryCode = id.substring(0, 2);
      expect(countryCode).toBe("DE");
    },
  );

  it(
    "should generate a string only consisting of digits after 'DE' when the German USt-IdNr. is selected",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_UST_ID);

      // then
      const randomPart = id.substring(2);
      for (const digit of randomPart) {
        expect(digit).toBeOneOf(Array.from(ALL_DIGITS));
      }
    },
  );

  it(
    "should generate an ID with a valid check digit when the German USt-IdNr. is selected",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_UST_ID);

      // then
      const randomPartWithoutCheck = id.substring(2, id.length - 1);
      const checkDigit = id[id.length - 1];
      const expectedCheckDigit = checkDigitIsoIec7064Mod1110(randomPartWithoutCheck);

      expect(checkDigit).toBe(expectedCheckDigit);
    },
  );

  it("should have an ID-name pair for each tax ID type", () => {
    // given
    const allIdTypes = TAX_ID_TYPES;
    const allIdTypesWithDisplayName = Array.from(TYPE_DISPLAY_NAME_MAP.keys());

    // then
    expect(allIdTypesWithDisplayName).toEqual(allIdTypes);
  });
});

describe.each(["", " ", "invalid", undefined, null, 1, {}])("The tax-ID generator", (invalidInput) => {
  it(`should throw an error when using the invalid input '${invalidInput}'`, () => {
    // given
    const genFn = () => generateTaxId(invalidInput);

    // when / then
    expect(genFn).toThrow(`Invalid input ${invalidInput}. Must be one of ${TAX_ID_TYPES}`);
  });
});
