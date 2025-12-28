import { describe, expect, it } from "vitest";
import { digitCount } from "./numberUtils.js";

describe("The function for counting digits", () => {
  it("should return the correct count when a number is used as input", () => {
    // given
    const input = "166301643";
    const expected = new Map([
      [0, 1],
      [1, 2],
      [2, 0],
      [3, 2],
      [4, 1],
      [5, 0],
      [6, 3],
      [7, 0],
      [8, 0],
      [9, 0],
    ]);

    // when
    const result = digitCount(input);

    // then
    expect(result).toEqual(expected);
  });

  it("should return the correct count when the input starts with 0", () => {
    // given
    const input = "022";
    const expected = new Map([
      [0, 1],
      [1, 0],
      [2, 2],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],
      [8, 0],
      [9, 0],
    ]);

    // when
    const result = digitCount(input);

    // then
    expect(result).toEqual(expected);
  });

  it("should return the correct count when every number is used once", () => {
    // given
    const input = "0123456789";

    // when
    const result = digitCount(input);

    // then
    expect(result).toHaveLength(10);
    for (const [_, count] of result) {
      expect(count).toBe(1);
    }
  });

  it("should return the correct count when every number is used with a different occurrence", () => {
    // given
    const input = "1223334444555556666667777777888888889999999990000000000";
    const expected = new Map([
      [0, 10],
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5],
      [6, 6],
      [7, 7],
      [8, 8],
      [9, 9],
    ]);

    // when
    const result = digitCount(input);

    // then
    expect(result).toEqual(expected);
  });

  it.each(["a", "ab", "ab1", "ab12", "1ab", "12ab"])(
    "should throw an error when the input contains letters (input %s)",
    (input) => {
      // given
      const countFn = () => digitCount(input);

      // when / then
      expect(countFn).toThrow(`Input for digitCount should only contain digits but input is: "${input}"`);
    },
  );

  it("should work correctly when the input is an empty string", () => {
    // given
    const expected = new Map([
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],
      [8, 0],
      [9, 0],
    ]);

    // when
    const result = digitCount("");

    // then
    expect(result).toEqual(expected);
  });
});
