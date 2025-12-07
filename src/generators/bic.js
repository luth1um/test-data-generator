import {
  ALL_LETTERS,
  ALL_LETTERS_AND_ALL_DIGITS,
  ALL_LETTERS_AND_ALL_DIGITS_EXCEPT_0_1,
  ALL_LETTERS_EXCEPT_O_AND_ALL_DIGITS,
  ALL_LETTERS_EXCEPT_X_AND_ALL_DIGITS,
  generateRandomStringOfChars,
} from "../misc/randomUtils.js";
import { COUNTRIES } from "../misc/countries.js";

/**
 * @type {import('../misc/countries').Country[]}
 */
export const BIC_SUPPORTED_COUNTRIES = [
  COUNTRIES.AUSTRIA,
  COUNTRIES.BELGIUM,
  COUNTRIES.BULGARIA,
  COUNTRIES.CYPRUS,
  COUNTRIES.FRANCE,
  COUNTRIES.GERMANY,
  COUNTRIES.GREECE,
  COUNTRIES.ICELAND,
  COUNTRIES.IRELAND,
  COUNTRIES.ITALY,
  COUNTRIES.LATVIA,
  COUNTRIES.LUXEMBOURG,
  COUNTRIES.MALTA,
  COUNTRIES.NETHERLANDS,
  COUNTRIES.NORWAY,
  COUNTRIES.ROMANIA,
  COUNTRIES.RUSSIA,
  COUNTRIES.SPAIN,
  COUNTRIES.SWITZERLAND,
  COUNTRIES.VATICAN_CITY,
];
export const BIC_SUPPORTED_COUNTRY_CODES = BIC_SUPPORTED_COUNTRIES.map((country) => country.isoCode);

/**
 * Generates a valid random BIC (Business Identifier Code) with 8 or 11 characters for the specified country code.
 *
 * @param {string} countryCode - The two-letter ISO country code (e.g., 'DE').
 * @returns {string} A valid, randomly generated BIC for the given country.
 * @throws {Error} If the country code is not supported.
 *
 * @example
 * const bic = generateBIC('DE');
 * console.log(bic); // e.g., 'DEUTDEFF500'
 */
export function generateBIC(countryCode) {
  if (!BIC_SUPPORTED_COUNTRY_CODES.includes(countryCode)) {
    throw new Error(`BIC generation for country code '${countryCode}' is not supported.`);
  }
  return generateRandomBIC(countryCode);
}

/**
 * Generates a valid random German BIC (Business Identifier Code).
 *
 * The generated BIC will:
 * - Use a random 4-character bank code
 * - Include the country code, e.g. 'DE'
 * - Use a random 2-character location code
 * - Use a random 3-character branch code (or an empty string)
 *
 * @param {string} countryCode - The two-letter ISO country code (e.g., 'DE').
 * @returns {string} A valid, randomly generated German BIC (e.g., 'DEUTDEFF500')
 */
function generateRandomBIC(countryCode) {
  const bankCode = generateRandomBankCode();
  const locationCode = generateRandomLocationCode();
  const branchCode = generateRandomBranchCode();
  return `${bankCode}${countryCode}${locationCode}${branchCode}`;
}

/**
 * Generates a random 4-character bank code using letters only.
 *
 * @returns {string} A 4-character bank code (e.g., 'DEUT')
 */
function generateRandomBankCode() {
  return generateRandomStringOfChars(ALL_LETTERS, 4);
}

/**
 * Generates a random 2-character location code.
 * First character: A-Z or 2-9
 * Second character: A-Z or 0-9
 *
 * @returns {string} A 2-character location code (e.g., 'FF')
 */
function generateRandomLocationCode() {
  const first = generateRandomStringOfChars(ALL_LETTERS_AND_ALL_DIGITS_EXCEPT_0_1, 1);
  const second = generateRandomStringOfChars(ALL_LETTERS_EXCEPT_O_AND_ALL_DIGITS, 1);
  return first + second;
}

/**
 * Generates a random 3-character branch code or an empty string (BICs can have 8 or 11 characters).
 * Can be letters and digits, or 'XXX' for head office.
 *
 * @returns {string} An empty string or 3-character branch code (e.g., '500' or 'XXX')
 */
function generateRandomBranchCode() {
  // 20% chance to use an empty string or 'XXX' (head office)
  if (Math.random() < 0.2) {
    return Math.random() < 0.5 ? "" : "XXX";
  }

  // Otherwise generate random 3-character code (cannot start with 'X')
  return (
    generateRandomStringOfChars(ALL_LETTERS_EXCEPT_X_AND_ALL_DIGITS, 1) +
    generateRandomStringOfChars(ALL_LETTERS_AND_ALL_DIGITS, 2)
  );
}
