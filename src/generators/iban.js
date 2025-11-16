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
  COUNTRIES.CYPRUS,
  COUNTRIES.FRANCE,
  COUNTRIES.GERMANY,
  COUNTRIES.ITALY,
  COUNTRIES.MALTA,
  COUNTRIES.NETHERLANDS,
  COUNTRIES.NORWAY,
  COUNTRIES.ROMANIA,
  COUNTRIES.RUSSIA,
  COUNTRIES.SWITZERLAND,
  COUNTRIES.VATICAN_CITY,
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
    case COUNTRIES.CYPRUS.isoCode:
      return generateCypriotIBAN();
    case COUNTRIES.FRANCE.isoCode:
      return generateFrenchIBAN();
    case COUNTRIES.GERMANY.isoCode:
      return generateGermanIBAN();
    case COUNTRIES.ITALY.isoCode:
      return generateItalianIBAN();
    case COUNTRIES.MALTA.isoCode:
      return generateMalteseIBAN();
    case COUNTRIES.NETHERLANDS.isoCode:
      return generateDutchIBAN();
    case COUNTRIES.NORWAY.isoCode:
      return generateNorwegianIBAN();
    case COUNTRIES.ROMANIA.isoCode:
      return generateRomanianIBAN();
    case COUNTRIES.RUSSIA.isoCode:
      return generateRussianIBAN();
    case COUNTRIES.SWITZERLAND.isoCode:
      return generateSwissIBAN();
    case COUNTRIES.VATICAN_CITY.isoCode:
      return generateVaticanIBAN();
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

  const bban = bbanWithoutCheckDigits + checkDigitString;
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.BELGIUM.isoCode, bban);
}

/**
 * Generates a valid random Cypriot IBAN.
 *
 * The generated IBAN will:
 * - Start with the country code 'CY'
 * - Contain valid check digits
 * - Use a random 3-digit bank code
 * - Use a random 5-digit branch code
 * - Use a random 16-character alphanumeric account number
 *
 * @returns {string} A valid, randomly generated Swiss IBAN
 */
function generateCypriotIBAN() {
  // Generate random 3-digit bank code
  const bankCode = generateRandomStringOfChars(ALL_DIGITS, 4);

  // Generate random 5-digit bank code
  const branchCode = generateRandomStringOfChars(ALL_DIGITS, 4);

  // Generate random 16-digit account number
  const accountNumber = generateRandomStringOfChars(ALL_LETTERS_AND_ALL_DIGITS, 16);

  const bban = bankCode + branchCode + accountNumber;
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.CYPRUS.isoCode, bban);
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
 * @returns {string} A valid, randomly generated Dutch IBAN
 */
function generateDutchIBAN() {
  // Generate random 4-letter bank code
  const bankCode = generateRandomStringOfChars(ALL_LETTERS, 4);

  // Generate random 10-digit account number (last digit is a check digit and needs to be calculated)
  const withoutCheck = generateRandomStringOfChars(ALL_DIGITS, 9);
  let weightedSum = 0;
  for (let i = 0; i < withoutCheck.length; i++) {
    weightedSum += (10 - i) * Number(withoutCheck[i]);
  }

  const checkDigit = (11 - (weightedSum % 11)) % 11;
  if (checkDigit === 10) {
    // invalid check digit
    return generateDutchIBAN();
  }

  const accountNumber = withoutCheck + checkDigit;
  const bban = bankCode + accountNumber;
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.NETHERLANDS.isoCode, bban);
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
 * - Use a 2-digit RIB key (BBAN check digits)
 *
 * @returns {string} A valid, randomly generated French IBAN
 */
function generateFrenchIBAN() {
  // Generate random 5-digit bank code, 5-digit branch code, and 11-character alphanumeric account number
  const bankCode = generateRandomStringOfChars(ALL_DIGITS, 5);
  const branchCode = generateRandomStringOfChars(ALL_DIGITS, 5);
  const accountNumber = generateRandomStringOfChars(ALL_LETTERS_AND_ALL_DIGITS, 11);

  // Calculate 2-digit RIB key (french national check digits)
  const bbanWithoutKey = bankCode + branchCode + accountNumber;

  // convert characters to numbers
  const ribMap = {
    A: "1",
    B: "2",
    C: "3",
    D: "4",
    E: "5",
    F: "6",
    G: "7",
    H: "8",
    I: "9",
    J: "1",
    K: "2",
    L: "3",
    M: "4",
    N: "5",
    O: "6",
    P: "7",
    Q: "8",
    R: "9",
    S: "2",
    T: "3",
    U: "4",
    V: "5",
    W: "6",
    X: "7",
    Y: "8",
    Z: "9",
  };
  // Convert characters and leave numbers unchanged; append two zeros to multiply by 100
  const converted = bbanWithoutKey.replace(/[A-Z]/g, (ch) => ribMap[ch]) + "00";

  // Compute remainder for mod 97
  let rem = 0n;
  for (let i = 0; i < converted.length; i += 9) {
    const chunk = converted.slice(i, i + 9);
    rem = (rem * 10n ** BigInt(chunk.length) + BigInt(chunk)) % 97n;
  }

  const ribKey = String(Number(97n - rem)).padStart(2, "0");

  const bban = bbanWithoutKey + ribKey;
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.FRANCE.isoCode, bban);
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

  // Generate random 10-digit account number
  const accountNumber = generateRandomStringOfChars(ALL_DIGITS, 10);

  const bban = bankCode + accountNumber;
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.GERMANY.isoCode, bban);
}

/**
 * Generates a valid random Italian IBAN.
 *
 * The generated IBAN will:
 * - Start with the country code 'IT'
 * - Contain valid check digits
 * - Contain a national check character (CIN)
 * - Use a 5-digit bank identifier (ABI)
 * - Use a 5-digit branch identifier (CAB)
 * - Use a random 12-character alphanumeric account number
 *
 * @returns {string} A valid, randomly generated Italian IBAN
 */
function generateItalianIBAN() {
  // Generate random 5-digit bank identifier (ABI), 5-digit bank identifier (CAB), and 12-char alphanumeric account no.
  const bankIdentifier = generateRandomStringOfChars(ALL_DIGITS, 5);
  const branchIdentifier = generateRandomStringOfChars(ALL_DIGITS, 5);
  const accountNumber = generateRandomStringOfChars(ALL_LETTERS_AND_ALL_DIGITS, 12);
  const bbanWithoutNationalCheck = bankIdentifier + branchIdentifier + accountNumber;

  // Odd-position conversion table for national check digit (official Italian CIN table)
  const oddValues = {
    0: 1,
    1: 0,
    2: 5,
    3: 7,
    4: 9,
    5: 13,
    6: 15,
    7: 17,
    8: 19,
    9: 21,
    A: 1,
    B: 0,
    C: 5,
    D: 7,
    E: 9,
    F: 13,
    G: 15,
    H: 17,
    I: 19,
    J: 21,
    K: 2,
    L: 4,
    M: 18,
    N: 20,
    O: 11,
    P: 3,
    Q: 6,
    R: 8,
    S: 12,
    T: 14,
    U: 16,
    V: 10,
    W: 22,
    X: 25,
    Y: 24,
    Z: 23,
  };

  // Even-position values for national check digit: A=0, B=1, ..., Z=25; digits are numeric
  const evenValue = (ch) => {
    if (/[0-9]/.test(ch)) {
      return parseInt(ch, 10);
    }
    return ch.charCodeAt(0) - "A".charCodeAt(0);
  };

  // Compute total sum for national check digit
  let total = 0;
  for (let i = 0; i < bbanWithoutNationalCheck.length; i++) {
    const ch = bbanWithoutNationalCheck[i];
    const position = i + 1; // positions start from 1
    if (position % 2 === 1) {
      total += oddValues[ch] ?? 0;
    } else {
      total += evenValue(ch);
    }
  }
  const remainder = total % 26;
  const cin = String.fromCharCode("A".charCodeAt(0) + remainder);

  const bban = cin + bbanWithoutNationalCheck;
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.ITALY.isoCode, bban);
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

  const bban = bicPart + branchCode + accountNumber;
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.MALTA.isoCode, bban);
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
  const bban10 = bankCode + accountNumber;
  const weights = [2, 3, 4, 5, 6, 7, 2, 3, 4, 5];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(bban10[9 - i], 10) * weights[i];
  }
  const remainder = sum % 11;
  let nationalCheckDigit = 11 - remainder;
  if (nationalCheckDigit === 11) {
    nationalCheckDigit = 0;
  } else if (nationalCheckDigit === 10) {
    // Invalid -> regenerate
    return generateNorwegianIBAN();
  }

  const bban = bban10 + nationalCheckDigit;
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.NORWAY.isoCode, bban);
}

/**
 * Generates a valid random Romanian IBAN.
 *
 * The generated IBAN will:
 * - Start with the country code 'RO'
 * - Contain valid check digits
 * - Use a random 4-letter bank identifier
 * - Use a random 16-character alphanumeric account number
 *
 * @returns {string} A valid, randomly generated Romanian IBAN
 */
function generateRomanianIBAN() {
  // Generate random 4-letter bank code
  const bankIdentifier = generateRandomStringOfChars(ALL_LETTERS, 4);

  // Generate random 16-character alphanumeric account number
  const accountNumber = generateRandomStringOfChars(ALL_LETTERS_AND_ALL_DIGITS, 16);

  const bban = bankIdentifier + accountNumber;
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.ROMANIA.isoCode, bban);
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

  const bban = bankIdentifier + branchIdentifier + accountNumber;
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.RUSSIA.isoCode, bban);
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

  const bban = bankClearingNumber + accountNumber;
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.SWITZERLAND.isoCode, bban);
}

/**
 * Generates a valid random Vatican IBAN.
 *
 * The generated IBAN will:
 * - Start with the country code 'VA'
 * - Contain valid check digits
 * - Use a random 3-digit bank code
 * - Use a random 15-digit account number
 *
 * @returns {string} A valid, randomly generated Vatican IBAN
 */
function generateVaticanIBAN() {
  // Generate random 3-digit bank code
  const bankCode = generateRandomStringOfChars(ALL_DIGITS, 3);

  // Generate random 15-digit account number
  const accountNumber = generateRandomStringOfChars(ALL_DIGITS, 15);

  const bban = bankCode + accountNumber;
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.VATICAN_CITY.isoCode, bban);
}

/**
 * Calculates the IBAN check digits and assembles the IBAN.
 *
 * @param {string} countryCode - The two-letter ISO country code (e.g., 'DE')
 * @param {string} bban - The BBAN part of the IBAN (country-specific format)
 * @returns {string} The complete IBAN including check digits
 */
function calculateIbanCheckDigitsAndAssembleIban(countryCode, bban) {
  const checkDigits = calculateIBANCheckDigits(countryCode, bban);
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
