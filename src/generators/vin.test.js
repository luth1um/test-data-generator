import {
  ALL_DIGITS,
  ALL_LETTERS_EXCEPT_IOQUZ_AND_ALL_DIGITS_EXCEPT_0,
  ALL_LETTERS_EXCEPT_IOQ_AND_ALL_DIGITS,
} from "../misc/randomUtils.js";
import { describe, expect, it } from "vitest";
import { RANDOM_FUNCTION_TEST_CALL_COUNT } from "../misc/testgenConstants.js";
import { generateVin } from "./vin.js";
import { vinChecksum } from "../misc/checksumUtils.js";

describe("The VIN generator", () => {
  it("should only generate VINs with a length of 17 when called", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // given
    const expectedLength = 17;

    // when
    const vin = generateVin();

    // then
    expect(vin).toHaveLength(expectedLength);
  });

  it("should not contain invalid chars when called", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // given
    const allowedChars = Array.from(ALL_LETTERS_EXCEPT_IOQ_AND_ALL_DIGITS);

    // when
    const vin = generateVin();

    // then
    for (const char of vin) {
      expect(char).toBeOneOf(allowedChars);
    }
  });

  it(
    "should only generate allowed chars at the checksum position when called",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // given
      const allowedChecksumChars = Array.from(ALL_DIGITS + "X");
      const checksumIndex = 8;

      // when
      const vin = generateVin();

      // then
      expect(vin[checksumIndex]).toBeOneOf(allowedChecksumChars);
    },
  );

  it("should has the VIN checksum at index 8 when called", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // given
    const checksumIndex = 8;

    // when
    const vin = generateVin();
    const vinCheck = vinChecksum(vin);

    // then
    expect(vin[checksumIndex]).toBe(vinCheck);
  });

  it(
    "should only use allowed chars for the model year code when called",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // given
      const modelYearChars = Array.from(ALL_LETTERS_EXCEPT_IOQUZ_AND_ALL_DIGITS_EXCEPT_0);
      const modelYearIndex = 9;

      // when
      const vin = generateVin();

      // then
      expect(vin[modelYearIndex]).toBeOneOf(modelYearChars);
    },
  );

  it(
    "should only use digits for the vehicle indicator section when called",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // given
      const allDigits = Array.from(ALL_DIGITS);
      const visStartIndex = 11;
      const vinLength = 17;

      // when
      const vin = generateVin();

      // then
      for (let i = visStartIndex; i < vinLength; i++) {
        expect(vin[i]).toBeOneOf(allDigits);
      }
    },
  );
});
