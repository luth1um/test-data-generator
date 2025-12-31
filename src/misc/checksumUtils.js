import { ALL_DIGITS } from "./randomUtils.js";

/**
 * Calculates the check digit according to ISO/IEC 7064, MOD 11, 10.
 * @param {string} input
 * @returns {string}
 * @throws {Error} If the input contains anything other than digits
 */
export function checkDigitIsoIec7064Mod1110(input) {
  if (!input) {
    throw new Error("Cannot calculate check digit for falsy input");
  }
  Array.from(input).forEach((c) => {
    if (!ALL_DIGITS.includes(c)) {
      throw new Error(`Input should only contain digits, but contains: ${c}`);
    }
  });

  let product = 10;
  for (const digit of input) {
    let sum = (Number(digit) + product) % 10;
    if (sum === 0) {
      sum = 10;
    }
    product = (sum * 2) % 11;
  }
  const checkDigit = 11 - product;

  return checkDigit === 10 ? "0" : String(checkDigit);
}
