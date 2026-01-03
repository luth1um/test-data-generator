import { ALL_DIGITS, ALL_DIGITS_EXCEPT_0, generateRandomStringOfChars, randomElement } from "../misc/randomUtils.js";
import {
  checkDigitGermanStNr11erVerfahren,
  checkDigitGermanStNr11erVerfahrenBerlin,
  checkDigitGermanStNr11erVerfahrenModifiedRp,
  checkDigitGermanStNr2erVerfahren,
  checkDigitIsoIec7064Mod1110,
} from "../misc/checksumUtils.js";
import { COUNTRIES } from "../misc/countries.js";
import { digitCount } from "../misc/numberUtils.js";

export const TAX_ID_GERMANY_ST_NR = "tax-id-germany-st-nr";
export const TAX_ID_GERMANY_STEUER_ID = "tax-id-germany-steuer-id";
export const TAX_ID_GERMANY_UST_ID = "tax-id-germany-ust-id";
export const TAX_ID_GERMANY_W_ID = "tax-id-germany-w-id";

/**
 * @type {Map<string, function(): string>}
 */
const TYPE_FUNCTION_MAP = new Map([
  [TAX_ID_GERMANY_ST_NR, germanyStNr],
  [TAX_ID_GERMANY_STEUER_ID, germanySteuerId],
  [TAX_ID_GERMANY_UST_ID, germanyUstId],
  [TAX_ID_GERMANY_W_ID, germanyWirtschaftsId],
]);

/**
 * @type {Map<string, string>}
 */
export const TYPE_DISPLAY_NAME_MAP = new Map([
  [TAX_ID_GERMANY_ST_NR, `${COUNTRIES.GERMANY.name} (St.-Nr.)`],
  [TAX_ID_GERMANY_STEUER_ID, `${COUNTRIES.GERMANY.name} (Steuer-IdNr.)`],
  [TAX_ID_GERMANY_UST_ID, `${COUNTRIES.GERMANY.name} (USt-IdNr.)`],
  [TAX_ID_GERMANY_W_ID, `${COUNTRIES.GERMANY.name} (W-IdNr.)`],
]);

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

// ------------------------------
// St.-Nr. (Germany)
// ------------------------------

class GermanStNrSpec {
  /**
   * @param {string} stateCode
   * @param {function(string): string} chickDigitFn
   */
  constructor(stateCode, chickDigitFn) {
    this.stateCode = stateCode;
    this.chickDigitFn = chickDigitFn;
  }
}

const ST_NR_11_STANDARD_WEIGHTS_ONE_DIGIT_STATE = (s) =>
  checkDigitGermanStNr11erVerfahren(s, [0, 5, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2]);
const ST_NR_11_STANDARD_WEIGHTS_TWO_DIGITS_STATE = (s) =>
  checkDigitGermanStNr11erVerfahren(s, [0, 0, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2]);
const GERMAN_ST_NR_SPECS = [
  new GermanStNrSpec("3", ST_NR_11_STANDARD_WEIGHTS_ONE_DIGIT_STATE),
  new GermanStNrSpec("4", ST_NR_11_STANDARD_WEIGHTS_ONE_DIGIT_STATE),
  new GermanStNrSpec("5", (s) => checkDigitGermanStNr11erVerfahren(s, [0, 3, 2, 1, 0, 7, 6, 5, 4, 3, 2, 1])),
  new GermanStNrSpec("9", ST_NR_11_STANDARD_WEIGHTS_ONE_DIGIT_STATE),
  new GermanStNrSpec("10", ST_NR_11_STANDARD_WEIGHTS_TWO_DIGITS_STATE),
  new GermanStNrSpec("11", checkDigitGermanStNr11erVerfahrenBerlin),
  new GermanStNrSpec("21", checkDigitGermanStNr2erVerfahren),
  new GermanStNrSpec("22", ST_NR_11_STANDARD_WEIGHTS_TWO_DIGITS_STATE),
  new GermanStNrSpec("23", (s) => checkDigitGermanStNr11erVerfahren(s, [0, 0, 2, 9, 0, 8, 7, 6, 5, 4, 3, 2])),
  new GermanStNrSpec("24", ST_NR_11_STANDARD_WEIGHTS_TWO_DIGITS_STATE),
  new GermanStNrSpec("26", checkDigitGermanStNr2erVerfahren),
  new GermanStNrSpec("27", checkDigitGermanStNr11erVerfahrenModifiedRp),
  new GermanStNrSpec("28", checkDigitGermanStNr2erVerfahren),
];

/**
 * @returns {string}
 */
function germanyStNr() {
  const stateSpec = randomElement(GERMAN_ST_NR_SPECS);

  const bufaNrLength = 4 - stateSpec.stateCode.length;
  const bufaNr = generateRandomStringOfChars(ALL_DIGITS, bufaNrLength);
  const districtAndIndividualNr = generateRandomStringOfChars(ALL_DIGITS, 7);

  const stNrWithoutCheck = stateSpec.stateCode + bufaNr + "0" + districtAndIndividualNr;
  const checkDigit = stateSpec.chickDigitFn(stNrWithoutCheck);

  if (checkDigit.length > 1) {
    // invalid ID -> create a new ID
    return germanyStNr();
  }

  return stNrWithoutCheck + checkDigit;
}

// ------------------------------
// Steuer-IdNr. (Germany)
// ------------------------------

/**
 * @returns {string}
 */
function germanySteuerId() {
  let steuerId = generateRandomStringOfChars(ALL_DIGITS_EXCEPT_0, 1); // cannot start with 0
  for (let i = 1; i < 10; i++) {
    const allowedNextDigits = steuerIdAllowedNextDigits(steuerId);
    steuerId += generateRandomStringOfChars(allowedNextDigits, 1);
  }
  const checkDigit = checkDigitIsoIec7064Mod1110(steuerId);
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

// ------------------------------
// USt-IdNr. (Germany)
// ------------------------------

/**
 * @returns {string}
 */
function germanyUstId() {
  const id = generateRandomStringOfChars(ALL_DIGITS, 8);
  const checkDigit = checkDigitIsoIec7064Mod1110(id);
  return COUNTRIES.GERMANY.isoCode + id + checkDigit;
}

// ------------------------------
// W-IdNr. (Germany)
// ------------------------------

/**
 * @returns {string}
 */
function germanyWirtschaftsId() {
  const ustId = germanyUstId();
  const unterscheidungsmerkmal = generateRandomStringOfChars(ALL_DIGITS, 5);
  return ustId + "-" + unterscheidungsmerkmal;
}
