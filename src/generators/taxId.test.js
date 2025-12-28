import { TAX_ID_GERMANY_STEUER_ID, TAX_ID_TYPES, TYPE_DISPLAY_NAME_MAP, generateTaxId } from "./taxId.js";
import { describe, expect, it } from "vitest";
import { ALL_DIGITS } from "../misc/randomUtils.js";
import { RANDOM_FUNCTION_TEST_CALL_COUNT } from "../misc/testgenConstants.js";
import { digitCount } from "../misc/numberUtils.js";

describe.each(TAX_ID_TYPES)("The tax-ID generator", (type) => {
  it(
    `should generate a truthy result when the input is valid type ${type}`,
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const result = generateTaxId(type);

      // then
      expect(result).toBeTruthy();
    },
  );

  it(
    `should generate a string when the input is valid type ${type}`,
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
      let product = 10;
      let sum = 0;
      for (const digit of steuerId) {
        sum = (Number(digit) + product) % 10;
        if (sum === 0) {
          sum = 10;
        }
        product = (sum * 2) % 11;
      }
      const result = (11 - sum) % 10;
      expect(result).toBe(0);
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
