import {
  ALL_DIGITS,
  ALL_DIGITS_EXCEPT_0,
  ALL_LETTERS,
  ALL_LETTERS_AND_ALL_DIGITS,
  generateRandomStringOfChars,
} from "../misc/randomUtils.js";
import { COUNTRIES } from "../misc/countries.js";

export const IBAN_SUPPORTED_COUNTRIES = [
  COUNTRIES.BELGIUM,
  COUNTRIES.FRANCE,
  COUNTRIES.GERMANY,
  COUNTRIES.MALTA,
  COUNTRIES.NETHERLANDS,
  COUNTRIES.NORWAY,
  COUNTRIES.RUSSIA,
  COUNTRIES.SWITZERLAND,
];

/**
 * Generates a valid random IBAN for the specified country code.
 *
 * @param {string} countryCode - The two-letter ISO country code (e.g., 'DE')
 * @returns {string} A valid, randomly generated IBAN for the given country
 * @throws {Error} If the country code is not supported
 *
 * @example
 * const iban = generateIBAN('DE');
 * console.log(iban); // e.g., 'DE44123456781234567890'
 */
export function generateIBAN(countryCode) {
  switch (countryCode) {
    case COUNTRIES.BELGIUM.isoCode:
      return generateBelgianIBAN();
    case COUNTRIES.FRANCE.isoCode:
      return generateFrenchIBAN();
    case COUNTRIES.GERMANY.isoCode:
      return generateGermanIBAN();
    case COUNTRIES.MALTA.isoCode:
      return generateMalteseIBAN();
    case COUNTRIES.NETHERLANDS.isoCode:
      return generateDutchIBAN();
    case COUNTRIES.NORWAY.isoCode:
      return generateNorwegianIBAN();
    case COUNTRIES.RUSSIA.isoCode:
      return generateRussianIBAN();
    case COUNTRIES.SWITZERLAND.isoCode:
      return generateSwissIBAN();
    default:
      throw new Error(`IBAN generation for country code '${countryCode}' is not supported.`);
  }
} /**
 * Generates a valid random Belgian IBAN.
 *
 * The generated IBAN will:
 * - Start with the country code 'BE'
 * - Contain valid check digits
 * - Use a random 3-digit bank code
 * - Use a random 7-digit account number
 * - Use 2 national check digits
 *
 * @returns {string} A valid, randomly generated Belgian IBAN
 */
function generateBelgianIBAN() {
  // Generate random 3-digit bank code
  const bankCode = generateRandomStringOfChars(ALL_DIGITS, 3);

  // Generate random 7-digit account number
  const accountNumber = generateRandomStringOfChars(ALL_DIGITS, 7);

  // Calculate national check digits
  const bbanWithoutCheckDigits = bankCode + accountNumber;
  const nationalCheckDigits = Number(bbanWithoutCheckDigits) % 97;
  let checkDigitString;
  if (nationalCheckDigits >= 10) {
    checkDigitString = String(nationalCheckDigits);
  } else if (nationalCheckDigits === 0) {
    checkDigitString = "97";
  } else {
    checkDigitString = "0" + nationalCheckDigits;
  }

  // Assemble BBAN
  const bban = bbanWithoutCheckDigits + checkDigitString;

  // Calculate check digits
  const countryCode = COUNTRIES.BELGIUM.isoCode;
  const checkDigits = calculateIBANCheckDigits(countryCode, bban);

  // Assemble IBAN
  return `${countryCode}${checkDigits}${bban}`;
}

/**
 * Generates a valid random Dutch IBAN.
 *
 * The generated IBAN will:
 * - Start with the country code 'NL'
 * - Contain valid check digits
 * - Use a random 4-letter bank code
 * - Use a random 10-digit account number
 *
 * @returns {string} A valid, randomly generated Swiss IBAN
 */
function generateDutchIBAN() {
  // Generate random 4-letter bank code
  const bankCode = generateRandomStringOfChars(ALL_LETTERS, 4);

  // Generate random 10-digit account number
  const accountNumber = generateRandomStringOfChars(ALL_DIGITS, 10);

  // Assemble BBAN
  const bban = bankCode + accountNumber;

  // Calculate check digits
  const countryCode = COUNTRIES.NETHERLANDS.isoCode;
  const checkDigits = calculateIBANCheckDigits(countryCode, bban);

  // Assemble IBAN
  return `${countryCode}${checkDigits}${bban}`;
}

/**
 * Generates a valid random French IBAN.
 *
 * The generated IBAN will:
 * - Start with the country code 'FR'
 * - Contain valid check digits
 * - Use a random 5-digit bank code
 * - Use a random 5-digit branch code
 * - Use a random 11-character alphanumeric account number
 * - Use a 2-digit RIB key (BBAN check)
 *
 * @returns {string} A valid, randomly generated French IBAN
 */
function generateFrenchIBAN() {
  // Generate random 5-digit bank code
  const bankCode = generateRandomStringOfChars(ALL_DIGITS, 5);

  // Generate random 5-digit branch code
  const branchCode = generateRandomStringOfChars(ALL_DIGITS, 5);

  // Generate random 11-character alphanumeric account number
  const accountNumber = generateRandomStringOfChars(ALL_LETTERS_AND_ALL_DIGITS, 11);

  // Calculate 2-digit RIB key
  const lettersToNumbers = (s) => s.replace(/[A-Z]/g, (c) => (c.charCodeAt(0) - 64).toString().padStart(2, "0"));
  const accountNumberTransformed = lettersToNumbers(accountNumber);
  const bbanWithoutRibKeyNumber = BigInt(bankCode + branchCode + accountNumberTransformed);

  const ribKeyNumber = 97n - (bbanWithoutRibKeyNumber % 97n);
  const ribKey = String(ribKeyNumber).padStart(2, "0");

  // Assemble BBAN
  const bban = bankCode + branchCode + accountNumber + ribKey;

  // Calculate check digits
  const countryCode = COUNTRIES.FRANCE.isoCode;
  const checkDigits = calculateIBANCheckDigits(countryCode, bban);

  // Assemble IBAN
  return `${countryCode}${checkDigits}${bban}`;
}

/**
 * Generates a valid random German IBAN.
 *
 * The generated IBAN will:
 * - Start with the country code 'DE'
 * - Contain valid check digits
 * - Use a random 8-digit bank code (BLZ)
 * - Use a random 10-digit account number
 *
 * @returns {string} A valid, randomly generated German IBAN
 */
function generateGermanIBAN() {
  // Generate random 8-digit bank code (BLZ)
  const bankCode = generateRandomStringOfChars(ALL_DIGITS, 8);

  // Generate random 10-digit account number, padded with leading zeros
  const accountNumber = generateRandomStringOfChars(ALL_DIGITS, 10);

  // Assemble BBAN (bank code + account number)
  const bban = bankCode + accountNumber;

  // Calculate check digits
  const countryCode = COUNTRIES.GERMANY.isoCode;
  const checkDigits = calculateIBANCheckDigits(countryCode, bban);

  // Assemble IBAN
  return `${countryCode}${checkDigits}${bban}`;
}

/**
 * Generates a valid random Maltese IBAN.
 *
 * The generated IBAN will:
 * - Start with the country code 'MT'
 * - Contain valid check digits
 * - Use 4 uppercase letters describing the first part of a BIC
 * - Use a random 5-digit branch code
 * - Use a random 18-character alphanumeric account number
 *
 * @returns {string} A valid, randomly generated Maltese IBAN
 */
function generateMalteseIBAN() {
  // Generate random 4 uppercase letters for BIC part
  const bicPart = generateRandomStringOfChars(ALL_LETTERS, 4);

  // Generate random 5-digit branch code
  const branchCode = generateRandomStringOfChars(ALL_DIGITS, 5);

  // Generate random 18-character alphanumeric account number
  const accountNumber = generateRandomStringOfChars(ALL_LETTERS_AND_ALL_DIGITS, 18);

  // Assemble BBAN
  const bban = bicPart + branchCode + accountNumber;

  // Calculate check digits
  const countryCode = COUNTRIES.MALTA.isoCode;
  const checkDigits = calculateIBANCheckDigits(countryCode, bban);

  // Assemble IBAN
  return `${countryCode}${checkDigits}${bban}`;
}

/**
 * Generates a valid random Norwegian IBAN.
 *
 * The generated IBAN will:
 * - Start with the country code 'NO'
 * - Contain valid check digits
 * - Use a random 4-digit bank code
 * - Use a random 6-digit account number
 *
 * @returns {string} A valid, randomly generated Norwegian IBAN
 */
function generateNorwegianIBAN() {
  // Generate random 4-digit bank code (cannot start with 0)
  const bankCode = generateRandomStringOfChars(ALL_DIGITS_EXCEPT_0, 1) + generateRandomStringOfChars(ALL_DIGITS, 3);

  // Generate random 6-digit account number
  const accountNumber = generateRandomStringOfChars(ALL_DIGITS, 6);

  // Calculate Modulus 11 check digit for the 10-digit BBAN
  let bban10 = bankCode + accountNumber;
  let weights = [2, 3, 4, 5, 6, 7, 2, 3, 4, 5];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(bban10[i], 10) * weights[i];
  }
  let remainder = sum % 11;
  let nationalCheckDigit = 11 - remainder;
  if (nationalCheckDigit === 11) nationalCheckDigit = 0;
  if (nationalCheckDigit === 10) {
    // Invalid, regenerate
    return generateNorwegianIBAN();
  }

  const bban = bban10 + nationalCheckDigit;

  const countryCode = COUNTRIES.NORWAY.isoCode;
  const ibanCheckDigits = calculateIBANCheckDigits(countryCode, bban);

  return `${countryCode}${ibanCheckDigits}${bban}`;
}

/**
 * Generates a valid random Russian IBAN.
 *
 * The generated IBAN will:
 * - Start with the country code 'RU'
 * - Contain valid check digits
 * - Use a random 9-digit bank identifier
 * - Use a random 5-digit branch identifier
 * - Use a random 15-character alphanumeric account number
 *
 * @returns {string} A valid, randomly generated Russian IBAN
 */
function generateRussianIBAN() {
  // Generate random 9-digit bank identifier
  const bankIdentifier = generateRandomStringOfChars(ALL_DIGITS, 9);

  // Generate random 5-digit branch identifier
  const branchIdentifier = generateRandomStringOfChars(ALL_DIGITS, 5);

  // Generate random 15-character alphanumeric account number
  const accountNumber = generateRandomStringOfChars(ALL_LETTERS_AND_ALL_DIGITS, 15);

  // Assemble BBAN
  const bban = bankIdentifier + branchIdentifier + accountNumber;

  // Calculate check digits
  const countryCode = COUNTRIES.RUSSIA.isoCode;
  const checkDigits = calculateIBANCheckDigits(countryCode, bban);

  // Assemble IBAN
  return `${countryCode}${checkDigits}${bban}`;
}

/**
 * Generates a valid random Swiss IBAN.
 *
 * The generated IBAN will:
 * - Start with the country code 'CH'
 * - Contain valid check digits
 * - Use a random 5-digit bank clearing number
 * - Use a random 12-digit account number
 *
 * @returns {string} A valid, randomly generated Swiss IBAN
 */
function generateSwissIBAN() {
  // Generate random 5-digit bank clearing number
  const bankClearingNumber = generateRandomStringOfChars(ALL_DIGITS, 5);

  // Generate random 12-digit account number
  const accountNumber = generateRandomStringOfChars(ALL_DIGITS, 12);

  // Assemble BBAN
  const bban = bankClearingNumber + accountNumber;

  // Calculate check digits
  const countryCode = COUNTRIES.SWITZERLAND.isoCode;
  const checkDigits = calculateIBANCheckDigits(countryCode, bban);

  // Assemble IBAN
  return `${countryCode}${checkDigits}${bban}`;
}

/**
 * Calculates the IBAN check digits for a given country code and BBAN.
 *
 * @param {string} countryCode - The two-letter ISO country code (e.g., 'DE')
 * @param {string} bban - The BBAN part of the IBAN (country-specific format)
 * @returns {string} The two check digits as a string
 */
function calculateIBANCheckDigits(countryCode, bban) {
  // 1. Move country code and '00' to the end
  // 2. Replace letters with numbers (A=10, ..., Z=35)
  // 3. Calculate 98 - (number mod 97)
  const lettersToNumbers = (s) => s.replace(/[A-Z]/g, (c) => (c.charCodeAt(0) - 55).toString());
  const rearranged = lettersToNumbers(bban) + lettersToNumbers(countryCode) + "00";
  const mod97 = BigInt(rearranged) % 97n;
  return String(98n - mod97).padStart(2, "0");
}
