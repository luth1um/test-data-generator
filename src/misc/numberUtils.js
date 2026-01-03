import { ALL_DIGITS } from "./randomUtils.js";

/**
 *
 * @param {string} numberAsString
 * @returns {Map<number, number>}
 * @throws {Error} If the input contains anything but digits
 */
export function digitCount(numberAsString) {
  Array.from(numberAsString).forEach((value) => {
    if (!ALL_DIGITS.includes(value)) {
      throw new Error(`Input for digitCount should only contain digits but input is: "${numberAsString}"`);
    }
  });

  const digitCounts = new Map([
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

  for (const digit of numberAsString) {
    const digitNum = Number(digit);
    const count = digitCounts.get(digitNum) + 1;
    digitCounts.set(digitNum, count);
  }

  return digitCounts;
}

/**
 * Calculates the digit sum for the given input.
 * @param {number} input
 * @returns {number}
 * @throws {Error} If the input is not a finite number
 */
export function digitSum(input) {
  if (typeof input !== "number" || !Number.isFinite(input)) {
    throw new Error("digitSum expects a finite number input");
  }

  let num = Math.abs(Math.trunc(input));
  if (num === 0) {
    return 0;
  }

  let sum = 0;
  while (num > 0) {
    sum += num % 10;
    num = Math.floor(num / 10);
  }

  return sum;
}

/**
 * Calculates the single-digit sum for the given input.
 * @param {number} input
 * @returns {number}
 * @throws {Error} If the input is not a finite number
 */
export function singleDigitSum(input) {
  if (typeof input !== "number" || !Number.isFinite(input)) {
    throw new Error("singleDigitSum expects a finite number input");
  }

  let result = input;
  do {
    result = digitSum(result);
  } while (result >= 10);

  return result;
}
