import { CUID_V2_DEFAULT_LENGTH, CUID_V2_MAX_LENGTH, CUID_V2_MIN_LENGTH, generateCUIDv2 } from "./cuid.js";
import { describe, expect, it } from "vitest";
import { RANDOM_FUNCTION_TEST_CALL_COUNT } from "../misc/testgenConstants.js";

describe("generateCUIDv2", () => {
  it(
    "should generate a string of length 24 when no length is given",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const cuid = generateCUIDv2(undefined);

      // then
      expect(cuid.length).toBe(CUID_V2_DEFAULT_LENGTH);
    }
  );

  it(
    "should only generate strings consisting of lower-case letters and numbers when called",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const cuid = generateCUIDv2(undefined);

      // then
      expect(cuid).toMatch(/[a-z0-9]+$/);
    }
  );

  it(
    "should generate strings with the correct length when a length is provided",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // given
      const length = 17;

      // when
      const id = generateCUIDv2(length);

      // then
      expect(id).toHaveLength(length);
    }
  );

  it(
    "should generate strings with the correct length when the minimum length is provided",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // given
      const minLength = CUID_V2_MIN_LENGTH;

      // when
      const id = generateCUIDv2(minLength);

      // then
      expect(id).toHaveLength(minLength);
    }
  );

  it(
    "should generate strings with the correct length when the maximum length is provided",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // given
      const maxLength = CUID_V2_MAX_LENGTH;

      // when
      const id = generateCUIDv2(maxLength);

      // then
      expect(id).toHaveLength(maxLength);
    }
  );

  it("should generate unique IDs when called many times", () => {
    // when
    const ids = Array.from({ length: RANDOM_FUNCTION_TEST_CALL_COUNT }, generateCUIDv2);

    // then
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it.each([1, 0, -1, Number.MIN_VALUE])("should throw an error when the length is too small (%s)", (length) => {
    // when / then
    expect(() => generateCUIDv2(length)).toThrowError(
      `The length for generating a CUIDv2 must be between ${CUID_V2_MIN_LENGTH} and ${CUID_V2_MAX_LENGTH}`
    );
  });

  it.each([33, Number.MAX_VALUE])("should throw an error when the length is too big (%s)", (length) => {
    // when / then
    expect(() => generateCUIDv2(length)).toThrowError(
      `The length for generating a CUIDv2 must be between ${CUID_V2_MIN_LENGTH} and ${CUID_V2_MAX_LENGTH}`
    );
  });
});
