import { ALL_DIGITS, ALL_DIGITS_EXCEPT_0, generateRandomStringOfChars } from "../misc/randomUtils.js";
import { COUNTRIES } from "../misc/countries.js";
import { digitCount } from "../misc/numberUtils.js";

export const TAX_ID_GERMANY_STEUER_ID = "tax-id-germany-steuer-id";

/**
 * @type {Map<string, function(): string>}
 */
const TYPE_FUNCTION_MAP = new Map([[TAX_ID_GERMANY_STEUER_ID, germanySteuerId]]);

/**
 * @type {Map<string, string>}
 */
export const TYPE_DISPLAY_NAME_MAP = new Map([[TAX_ID_GERMANY_STEUER_ID, `${COUNTRIES.GERMANY.name} (Steuer-IdNr.)`]]);

/**
 * @type {string[]}
 */
export const TAX_ID_TYPES = Array.from(TYPE_FUNCTION_MAP.keys());

/**
 * Generates a valid random tax ID for the specified type.
 * @param {string} type - The type for the generator (e.g., 'tax-id-germany-steuer-id')
 * @returns {string} A valid randomly generated tax ID
 * @throws {Error} If the type is not supported
 */
export function generateTaxId(type) {
  const taxIdFn = TYPE_FUNCTION_MAP.get(type);
  if (taxIdFn) {
    return taxIdFn();
  }
  throw new Error(`Invalid input ${type}. Must be one of ${TAX_ID_TYPES}`);
}

/**
 * @returns {string}
 */
function germanySteuerId() {
  let steuerId = generateRandomStringOfChars(ALL_DIGITS_EXCEPT_0, 1); // cannot start with 0
  for (let i = 1; i < 10; i++) {
    const allowedNextDigits = steuerIdAllowedNextDigits(steuerId);
    steuerId += generateRandomStringOfChars(allowedNextDigits, 1);
  }
  const checkDigit = steuerIdCheckDigit(steuerId);
  return steuerId + checkDigit;
}

/**
 * @param {string} partialSteuerId
 * @returns {string}
 */
function steuerIdAllowedNextDigits(partialSteuerId) {
  const digitUsedTwice = steuerIdDigitUsedTwice(partialSteuerId);
  if (partialSteuerId.length === 9 && !digitUsedTwice) {
    // when here: length 9 and all digits are different
    // one digit needs to be used twice
    return partialSteuerId;
  }

  const allowedDigits = new Set(ALL_DIGITS);

  if (steuerIdHasDigitThreeTimes(partialSteuerId) || steuerIdEndsWithSameDigitTwice(partialSteuerId)) {
    // only a single digit can be used more than once, and at most three times
    // when here: one digit was used three times or twice at the end -> none of the used digits can be used again
    for (const digit of partialSteuerId) {
      allowedDigits.delete(digit);
    }
  } else if (digitUsedTwice) {
    // only a single digit can be used more than once
    // when here: one digit was used twice, but not subsequently at the end
    // only the digit that was used twice can be used again
    for (const digit of partialSteuerId) {
      if (digit !== digitUsedTwice) {
        allowedDigits.delete(digit);
      }
    }
  }
  // when no if-clause is satisfied: all digits where used at most once -> all digits can be used

  return Array.from(allowedDigits).join("");
}

/**
 * @param {string} partialSteuerId
 * @returns {boolean}
 */
function steuerIdHasDigitThreeTimes(partialSteuerId) {
  const counts = digitCount(partialSteuerId).values();
  for (const count of counts) {
    if (count >= 3) {
      return true;
    }
  }
  return false;
}

/**
 * @param {string} partialSteuerId
 * @returns {string | undefined} the digit that was used twice, or an empty string
 */
function steuerIdDigitUsedTwice(partialSteuerId) {
  const entries = digitCount(partialSteuerId);
  for (const [digit, count] of entries) {
    if (count >= 2) {
      return String(digit);
    }
  }
  return undefined;
}

/**
 * @param {string} partialSteuerId
 * @returns {boolean}
 */
function steuerIdEndsWithSameDigitTwice(partialSteuerId) {
  const idLength = partialSteuerId.length;
  if (idLength < 2) {
    return false;
  }
  return partialSteuerId[idLength - 1] === partialSteuerId[idLength - 2];
}

/**
 * @param {string} steuerId
 * @returns {string}
 */
function steuerIdCheckDigit(steuerId) {
  let product = 10;
  for (const digit of steuerId) {
    let sum = (Number(digit) + product) % 10;
    if (sum === 0) {
      sum = 10;
    }
    product = (sum * 2) % 11;
  }
  const checkDigit = 11 - product;

  return checkDigit === 10 ? "0" : String(checkDigit);
}
