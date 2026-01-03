import { describe, expect, it } from "vitest";
import { digitCount, digitSum, singleDigitSum } from "./numberUtils.js";

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

describe("The function for calculating the digit sum", () => {
  it("should return the input when the input has a single digit", () => {
    // given
    const input = 7;

    // when
    const result = digitSum(input);

    // then
    expect(result).toBe(input);
  });

  it("should return the correct sum when the input has multiple digits", () => {
    // given
    const input = 432;

    // when
    const result = digitSum(input);

    // then
    expect(result).toBe(9);
  });

  it("should return 0 when the input is 0", () => {
    // given
    const input = 0;

    // when
    const result = digitSum(input);

    // then
    expect(result).toBe(0);
  });

  it("should return the correct sum when the input is negative", () => {
    // given
    const input = -619;

    // when
    const result = digitSum(input);

    // then
    expect(result).toBe(16);
  });

  it("should return the correct sum when the input is Number.MAX_SAFE_INTEGER", () => {
    // given
    const input = Number.MAX_SAFE_INTEGER;

    // when
    const result = digitSum(input);

    // then
    expect(result).toBe(76);
  });

  it("should throw an error when the input does not have the type 'number'", () => {
    // given
    const digitSumFn = () => digitSum("a");

    // when / then
    expect(digitSumFn).toThrowError("digitSum expects a finite number input");
  });

  it("should throw an error when the input is not finite", () => {
    // given
    const digitSumFn = () => digitSum(Number.POSITIVE_INFINITY);

    // when / then
    expect(digitSumFn).toThrowError("digitSum expects a finite number input");
  });
});

describe("The function for calculating the single-digit sum", () => {
  it("should return the input when the input has a single digit", () => {
    // given
    const input = 4;

    // when
    const result = singleDigitSum(input);

    // then
    expect(result).toBe(input);
  });

  it("should return the correct sum when the input has a multiple-digit digit-sum", () => {
    // given
    const input = 119;

    // when
    const result = singleDigitSum(input);

    // then
    expect(result).toBe(2);
  });

  it("should return 0 when the input is 0", () => {
    // given
    const input = 0;

    // when
    const result = singleDigitSum(input);

    // then
    expect(result).toBe(0);
  });

  it("should return the correct sum when the input is negative", () => {
    // given
    const input = -401317;

    // when
    const result = singleDigitSum(input);

    // then
    expect(result).toBe(7);
  });

  it("should return the correct sum when the input is Number.MAX_SAFE_INTEGER", () => {
    // given
    const input = Number.MAX_SAFE_INTEGER;

    // when
    const result = singleDigitSum(input);

    // then
    expect(result).toBe(4);
  });

  it("should throw an error when the input does not have the type 'number'", () => {
    // given
    const singleDigitSumFn = () => singleDigitSum("a");

    // when / then
    expect(singleDigitSumFn).toThrowError("singleDigitSum expects a finite number input");
  });

  it("should throw an error when the input is not finite", () => {
    // given
    const singleDigitSumFn = () => singleDigitSum(Number.POSITIVE_INFINITY);

    // when / then
    expect(singleDigitSumFn).toThrowError("singleDigitSum expects a finite number input");
  });
});
