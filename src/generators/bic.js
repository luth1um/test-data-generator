export const BIC_SUPPORTED_COUNTRY_CODES = ["DE", "NO"];

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ALL_LETTERS_AND_DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const ALL_LETTERS_AND_DIGITS_EXCEPT_O = "ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789";
const ALL_LETTERS_AND_DIGITS_EXCPECT_X = "ABCDEFGHIJKLMNOPQRSTUVWYZ0123456789";
const ALL_LETTERS_AND_DIGITS_EXCEPT_0_1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789";

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
 * - Include the country code 'DE'
 * - Use a random 2-character location code
 * - Use a random 3-character branch code (or an empty string)
 *
 * @param {string} countryCode - The two-letter ISO country code (e.g., 'DE').
 * @returns {string} A valid, randomly generated German BIC (e.g., 'DEUTDEFF500')
 *
 * @example
 * const bic = generateGermanBIC();
 * console.log(bic); // e.g., 'DEUTDEFF500'
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
  let bankCode = "";
  for (let i = 0; i < 4; i++) {
    bankCode += ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
  }
  return bankCode;
}

/**
 * Generates a random 2-character location code.
 * First character: A-Z or 2-9
 * Second character: A-Z or 0-9
 *
 * @returns {string} A 2-character location code (e.g., 'FF')
 */
function generateRandomLocationCode() {
  const firstCharSet = ALL_LETTERS_AND_DIGITS_EXCEPT_0_1;
  const secondCharSet = ALL_LETTERS_AND_DIGITS_EXCEPT_O;

  const first = firstCharSet[Math.floor(Math.random() * firstCharSet.length)];
  const second = secondCharSet[Math.floor(Math.random() * secondCharSet.length)];

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
  let branchCode = "";
  branchCode += ALL_LETTERS_AND_DIGITS_EXCPECT_X[Math.floor(Math.random() * ALL_LETTERS_AND_DIGITS_EXCPECT_X.length)];
  for (let i = 0; i < 2; i++) {
    branchCode += ALL_LETTERS_AND_DIGITS[Math.floor(Math.random() * ALL_LETTERS_AND_DIGITS.length)];
  }
  return branchCode;
}
