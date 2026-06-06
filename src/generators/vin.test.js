import { describe, expect, it } from "vitest";

import { vinChecksum, vinGermanChecksum } from "../misc/checksumUtils.js";
import {
  ALL_DIGITS,
  ALL_LETTERS_EXCEPT_IOQUZ_AND_ALL_DIGITS_EXCEPT_0,
  ALL_LETTERS_EXCEPT_IOQ_AND_ALL_DIGITS,
  ALL_DIGITS_AND_X,
} from "../misc/randomUtils.js";
import { RANDOM_FUNCTION_TEST_CALL_COUNT } from "../misc/testgenConstants.js";
import { generateVin, generateVinWithGermanChecksum } from "./vin.js";

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

  it("should have the VIN checksum at index 8 when called", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
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

describe("The VIN generator with German checksum", () => {
  it("should have an overall length of 21 when called", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // given
    const expectedLength = 21;

    // when
    const vin = generateVinWithGermanChecksum();

    // then
    expect(vin).toHaveLength(expectedLength);
  });

  it(
    "should consist of VIN, dash, and German checksum when called",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // given
      const allowedVinChars = Array.from(ALL_LETTERS_EXCEPT_IOQ_AND_ALL_DIGITS);
      const dash = "-";
      const allowedChecksumChars = Array.from(ALL_DIGITS_AND_X);

      // when
      const vinWithChecksum = generateVinWithGermanChecksum();

      // then
      const parts = vinWithChecksum.split(" ");
      expect(parts).toHaveLength(3);

      const vin = parts[0];
      for (const char of vin) {
        expect(char).toBeOneOf(allowedVinChars);
      }

      expect(parts[1]).toBe(dash);

      expect(parts[2]).toBeOneOf(allowedChecksumChars);
    },
  );

  it("should have two spaces as seperators when called", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // when
    const vinWithChecksum = generateVinWithGermanChecksum();

    // then
    expect(vinWithChecksum[17]).toBe(" ");
    expect(vinWithChecksum[19]).toBe(" ");
  });

  it("should have the correct German checksum when called", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // when
    const vinWithChecksum = generateVinWithGermanChecksum();

    // then
    const vinWoGermanChecksum = vinWithChecksum.split(" ")[0];
    const actualChecksum = vinWithChecksum[vinWithChecksum.length - 1];
    const expectedChecksum = vinGermanChecksum(vinWoGermanChecksum);
    expect(actualChecksum).toBe(expectedChecksum);
  });

  it("should generate VINs with a length of 17 when called", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // given
    const expectedLength = 17;

    // when
    const vinWithChecksum = generateVinWithGermanChecksum();

    // then
    const vinWoGermanChecksum = vinWithChecksum.split(" ")[0];
    expect(vinWoGermanChecksum).toHaveLength(expectedLength);
  });

  it(
    "should only use allowed chars for the model year when called",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // given
      const modelYearChars = Array.from(ALL_LETTERS_EXCEPT_IOQUZ_AND_ALL_DIGITS_EXCEPT_0);
      const modelYearIndex = 9;

      // when
      const vinWithChecksum = generateVinWithGermanChecksum();

      // then
      expect(vinWithChecksum[modelYearIndex]).toBeOneOf(modelYearChars);
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
      const vinWithGermanChecksum = generateVin();

      // then
      for (let i = visStartIndex; i < vinLength; i++) {
        expect(vinWithGermanChecksum[i]).toBeOneOf(allDigits);
      }
    },
  );
});
