import { TAX_ID_GERMANY_STEUER_ID, generateTaxId } from "../generators/taxId.js";
import { describe, expect, it } from "vitest";
import { RANDOM_FUNCTION_TEST_CALL_COUNT } from "./testgenConstants.js";
import { checkDigitIsoIec7064Mod1110 } from "./checksumUtils.js";

describe("The checksum calculation for ISO/IEC 7064, MOD 11, 10", () => {
  it.each([
    ["1556078923", "0"],
    ["7684928013", "1"],
    ["6238070459", "2"],
    ["3346351970", "3"],
    ["1642003907", "4"],
    ["0794", "5"],
    ["2578591503", "6"],
    ["8015968473", "7"],
    ["1605963287", "8"],
    ["7402886358", "9"],
  ])("should calculate the correct check digit when the input is '%s'", (input, expected) => {
    // when
    const result = checkDigitIsoIec7064Mod1110(input);

    // then
    expect(result).toBe(expected);
  });

  it(
    "should have remainder '0' for the checking algorithm when called multiple times with random values",
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

  it("should throw an error when the input contains a non-digit character", () => {
    // given
    const nonDigitChar = "a";
    const checksumFn = () => checkDigitIsoIec7064Mod1110("123" + nonDigitChar);

    // when / then
    expect(checksumFn).toThrowError(`Input should only contain digits, but contains: ${nonDigitChar}`);
  });

  it.each(["", undefined, null])("should throw an error for falsy input '%s'", (input) => {
    // given
    const checksumFn = () => checkDigitIsoIec7064Mod1110(input);

    // when / then
    expect(checksumFn).toThrowError("Cannot calculate check digit for falsy input");
  });
});
