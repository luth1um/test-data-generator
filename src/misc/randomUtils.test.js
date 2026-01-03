import {
  ALL_DIGITS,
  ALL_LETTERS_AND_ALL_DIGITS,
  generateRandomStringOfChars,
  randomChar,
  randomElement,
} from "./randomUtils.js";
import { describe, expect, it } from "vitest";
import { RANDOM_FUNCTION_TEST_CALL_COUNT } from "./testgenConstants.js";

describe("The generator for random strings of specific chars", () => {
  it("should only produce strings containing specified chars", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // given
    const inputChars = ALL_LETTERS_AND_ALL_DIGITS;

    // when
    const result = generateRandomStringOfChars(inputChars, 42);

    // then
    for (const char of result) {
      expect(inputChars).toContain(char);
    }
  });

  it("should return strings of the specified length", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // given
    const length1 = 42;
    const length2 = 1337;

    // when
    const result1 = generateRandomStringOfChars(ALL_LETTERS_AND_ALL_DIGITS, length1);
    const result2 = generateRandomStringOfChars(ALL_LETTERS_AND_ALL_DIGITS, length2);

    // then
    expect(result1).toHaveLength(length1);
    expect(result2).toHaveLength(length2);
  });
});

describe("The picker for random elements of an array", () => {
  it("should return different elements when the input has more than one element", () => {
    // given
    const input = [0, 1, 2, 3, 4, 5];

    // when
    const results = Array.from({ length: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => randomElement(input));

    // then
    expect(results.length).toBeGreaterThan(1);
  });

  it(
    "should always return the same element when the input only has a single element",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // given
      const input = 42;

      // when
      const result = randomElement([input]);

      // then
      expect(result).toBe(input);
    },
  );

  it("should only return elements of the input when called", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // given
    const input = [0, 1, 2, 3, 4, 5];

    // when
    const result = randomElement(input);

    // then
    expect(result).toBeOneOf(input);
  });
});

describe("The picker for random characters of a string", () => {
  it("should return different characters when the input has more than one character", () => {
    // given
    const input = "abcde";

    // when
    const result = Array.from({ length: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => randomChar(input));

    // then
    expect(result.length).toBeGreaterThan(1);
  });

  it(
    "should always return the same char when the input only has a single char",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // given
      const input = "b";

      // when
      const result = randomChar(input);

      // then
      expect(result).toBe(input);
    },
  );

  it("should only return characters of the input when called", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // given
    const input = ALL_DIGITS;

    // when
    const result = randomChar(input);

    // then
    expect(result).toBeOneOf(Array.from(input));
  });
});
