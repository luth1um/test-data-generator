import { ALL_LETTERS_AND_ALL_DIGITS, generateRandomStringOfChars } from "./randomUtils.js";
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
