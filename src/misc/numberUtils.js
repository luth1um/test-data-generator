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
      throw Error(`Input for digitCount should only contain digits but input is: "${numberAsString}"`);
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
