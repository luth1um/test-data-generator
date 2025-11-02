export const ALL_DIGITS = "0123456789";
export const ALL_DIGITS_EXCEPT_0 = "123456789";
export const ALL_DIGITS_EXCEPT_0_1 = "23456789";
export const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const ALL_LETTERS_EXCEPT_O = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
export const ALL_LETTERS_EXCEPT_X = "ABCDEFGHIJKLMNOPQRSTUVWYZ";
export const ALL_LETTERS_AND_ALL_DIGITS = ALL_LETTERS + ALL_DIGITS;
export const ALL_LETTERS_EXCEPT_O_AND_ALL_DIGITS = ALL_LETTERS_EXCEPT_O + ALL_DIGITS;
export const ALL_LETTERS_EXCEPT_X_AND_ALL_DIGITS = ALL_LETTERS_EXCEPT_X + ALL_DIGITS;
export const ALL_LETTERS_AND_ALL_DIGITS_EXCEPT_0_1 = ALL_LETTERS + ALL_DIGITS_EXCEPT_0_1;

/**
 * Generates a random string of the specified length only consisting of characters of the provided string.
 *
 * @param {string} validChars characters for the array generation
 * @param {number} length length of the generated array
 * @returns {string} a random string
 *
 * @example
 * const randomString = generateRandomStringOfChars(3, 'ABCDEFGHIJKL');
 * console.log(randomString); // e.g., 'KFJ'
 */
export function generateRandomStringOfChars(validChars, length) {
  return Array.from({ length: length }, () => validChars[Math.floor(Math.random() * validChars.length)]).join("");
}
