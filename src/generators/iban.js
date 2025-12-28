import {
  ALL_DIGITS,
  ALL_DIGITS_EXCEPT_0,
  ALL_LETTERS,
  ALL_LETTERS_AND_ALL_DIGITS,
  generateRandomStringOfChars,
} from "../misc/randomUtils.js";
import { COUNTRIES, ISO_CODE_COUNTRY_MAP } from "../misc/countries.js";

/**
 * @type {Map<import('../misc/countries.js').Country, function(): string>}
 */
const COUNTRY_FUNCTIONS_MAP = new Map([
  [COUNTRIES.ANDORRA, andorranIBAN],
  [COUNTRIES.AUSTRIA, austrianIBAN],
  [COUNTRIES.BELGIUM, belgianIBAN],
  [COUNTRIES.BULGARIA, bulgarianIBAN],
  [COUNTRIES.CROATIA, croatianIBAN],
  [COUNTRIES.CYPRUS, cypriotIBAN],
  [COUNTRIES.FRANCE, frenchIBAN],
  [COUNTRIES.GERMANY, germanIBAN],
  [COUNTRIES.GREECE, greekIBAN],
  [COUNTRIES.ICELAND, icelandicIBAN],
  [COUNTRIES.IRELAND, irishIBAN],
  [COUNTRIES.ITALY, italianIBAN],
  [COUNTRIES.LATVIA, latvianIBAN],
  [COUNTRIES.LIECHTENSTEIN, liechtensteinerIBAN],
  [COUNTRIES.LITHUANIA, lithuanianIBAN],
  [COUNTRIES.LUXEMBOURG, luxembourgishIBAN],
  [COUNTRIES.MALTA, malteseIBAN],
  [COUNTRIES.MOLDOVA, moldovanIBAN],
  [COUNTRIES.MONACO, monegasqueIBAN],
  [COUNTRIES.NETHERLANDS, dutchIBAN],
  [COUNTRIES.NORWAY, norwegianIBAN],
  [COUNTRIES.POLAND, polishIBAN],
  [COUNTRIES.ROMANIA, romanianIBAN],
  [COUNTRIES.RUSSIA, russianIBAN],
  [COUNTRIES.SAN_MARINO, sammarineseIBAN],
  [COUNTRIES.SPAIN, spanishIBAN],
  [COUNTRIES.SWITZERLAND, swissIBAN],
  [COUNTRIES.VATICAN_CITY, vaticanIBAN],
]);

/**
 * @type {import('../misc/countries.js').Country[]}
 */
export const IBAN_SUPPORTED_COUNTRIES = Array.from(COUNTRY_FUNCTIONS_MAP.keys());

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
  const country = ISO_CODE_COUNTRY_MAP.get(countryCode);
  if (country) {
    const generatorFunction = COUNTRY_FUNCTIONS_MAP.get(country);
    if (generatorFunction) {
      return generatorFunction();
    }
  }
  throw new Error(`IBAN generation for country code '${countryCode}' is not supported.`);
}

/**
 * @returns {string}
 */
function andorranIBAN() {
  const bbanPattern = [
    { allowedChars: ALL_DIGITS, length: 8 },
    { allowedChars: ALL_LETTERS_AND_ALL_DIGITS, length: 12 },
  ];
  return generateSimpleIban(COUNTRIES.ANDORRA.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function austrianIBAN() {
  const bbanPattern = [{ allowedChars: ALL_DIGITS, length: 16 }];
  return generateSimpleIban(COUNTRIES.AUSTRIA.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function belgianIBAN() {
  const bbanWithoutCheckDigits = generateRandomStringOfChars(ALL_DIGITS, 10);

  // Calculate national check digits
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
 * @returns {string}
 */
function bulgarianIBAN() {
  const bbanPattern = [
    { allowedChars: ALL_LETTERS, length: 4 },
    { allowedChars: ALL_DIGITS, length: 6 },
    { allowedChars: ALL_LETTERS_AND_ALL_DIGITS, length: 8 },
  ];
  return generateSimpleIban(COUNTRIES.BULGARIA.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function croatianIBAN() {
  const bbanPattern = [{ allowedChars: ALL_DIGITS, length: 17 }];
  return generateSimpleIban(COUNTRIES.CROATIA.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function cypriotIBAN() {
  const bbanPattern = [
    { allowedChars: ALL_DIGITS, length: 8 },
    { allowedChars: ALL_LETTERS_AND_ALL_DIGITS, length: 16 },
  ];
  return generateSimpleIban(COUNTRIES.CYPRUS.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function dutchIBAN() {
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
    return dutchIBAN();
  }

  const accountNumber = withoutCheck + checkDigit;
  const bban = bankCode + accountNumber;
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.NETHERLANDS.isoCode, bban);
}

/**
 * @returns {string}
 */
function frenchIBAN() {
  const bban = frenchOrMonegasqueBBAN();
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.FRANCE.isoCode, bban);
}

/**
 * @returns {string}
 */
function germanIBAN() {
  const bbanPattern = [{ allowedChars: ALL_DIGITS, length: 18 }];
  return generateSimpleIban(COUNTRIES.GERMANY.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function greekIBAN() {
  const bbanPattern = [
    { allowedChars: ALL_DIGITS, length: 7 },
    { allowedChars: ALL_LETTERS_AND_ALL_DIGITS, length: 16 },
  ];
  return generateSimpleIban(COUNTRIES.GREECE.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function icelandicIBAN() {
  const bbanPattern = [{ allowedChars: ALL_DIGITS, length: 22 }];
  return generateSimpleIban(COUNTRIES.ICELAND.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function italianIBAN() {
  const bban = italianOrSammarineseBBAN();
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.ITALY.isoCode, bban);
}

/**
 * @returns {string}
 */
function irishIBAN() {
  const bbanPattern = [
    { allowedChars: ALL_LETTERS, length: 4 },
    { allowedChars: ALL_DIGITS, length: 14 },
  ];
  return generateSimpleIban(COUNTRIES.IRELAND.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function latvianIBAN() {
  const bbanPattern = [
    { allowedChars: ALL_LETTERS, length: 4 },
    { allowedChars: ALL_LETTERS_AND_ALL_DIGITS, length: 13 },
  ];
  return generateSimpleIban(COUNTRIES.LATVIA.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function liechtensteinerIBAN() {
  const bbanPattern = [
    { allowedChars: ALL_DIGITS, length: 5 },
    { allowedChars: ALL_LETTERS_AND_ALL_DIGITS, length: 12 },
  ];
  return generateSimpleIban(COUNTRIES.LIECHTENSTEIN.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function lithuanianIBAN() {
  const bbanPattern = [{ allowedChars: ALL_DIGITS, length: 16 }];
  return generateSimpleIban(COUNTRIES.LITHUANIA.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function luxembourgishIBAN() {
  const bbanPattern = [
    { allowedChars: ALL_DIGITS, length: 3 },
    { allowedChars: ALL_LETTERS_AND_ALL_DIGITS, length: 13 },
  ];
  return generateSimpleIban(COUNTRIES.LUXEMBOURG.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function malteseIBAN() {
  const bbanPattern = [
    { allowedChars: ALL_LETTERS, length: 4 },
    { allowedChars: ALL_DIGITS, length: 5 },
    { allowedChars: ALL_LETTERS_AND_ALL_DIGITS, length: 18 },
  ];
  return generateSimpleIban(COUNTRIES.MALTA.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function moldovanIBAN() {
  const bbanPattern = [{ allowedChars: ALL_LETTERS_AND_ALL_DIGITS, length: 20 }];
  return generateSimpleIban(COUNTRIES.MOLDOVA.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function monegasqueIBAN() {
  const bban = frenchOrMonegasqueBBAN();
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.MONACO.isoCode, bban);
}

/**
 * @returns {string}
 */
function norwegianIBAN() {
  const bban10 = generateRandomStringOfChars(ALL_DIGITS_EXCEPT_0, 1) + generateRandomStringOfChars(ALL_DIGITS, 9);

  // Calculate Modulus 11 check digit for the 10-digit BBAN
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
    return norwegianIBAN();
  }

  const bban = bban10 + nationalCheckDigit;
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.NORWAY.isoCode, bban);
}

/**
 * @returns {string}
 */
function polishIBAN() {
  const bankBranchWithoutCheck = generateRandomStringOfChars(ALL_DIGITS, 7);
  const accountNumber = generateRandomStringOfChars(ALL_DIGITS, 16);

  const weights = [3, 9, 7, 1, 3, 9, 7];
  let sum = 0;
  for (let i = 0; i < bankBranchWithoutCheck.length; i++) {
    sum += Number(bankBranchWithoutCheck[i]) * weights[i];
  }
  const checkDigit = 10 - (sum % 10);
  if (checkDigit === 10) {
    // invalid
    return polishIBAN();
  }

  const bban = bankBranchWithoutCheck + String(checkDigit) + accountNumber;
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.POLAND.isoCode, bban);
}

/**
 * @returns {string}
 */
function romanianIBAN() {
  const bbanPattern = [
    { allowedChars: ALL_LETTERS, length: 4 },
    { allowedChars: ALL_LETTERS_AND_ALL_DIGITS, length: 16 },
  ];
  return generateSimpleIban(COUNTRIES.ROMANIA.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function russianIBAN() {
  const bbanPattern = [
    { allowedChars: ALL_DIGITS, length: 14 },
    { allowedChars: ALL_LETTERS_AND_ALL_DIGITS, length: 15 },
  ];
  return generateSimpleIban(COUNTRIES.RUSSIA.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function sammarineseIBAN() {
  const bban = italianOrSammarineseBBAN();
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.SAN_MARINO.isoCode, bban);
}

/**
 * @returns {string}
 */
function spanishIBAN() {
  const bankAndBranchCode = generateRandomStringOfChars(ALL_DIGITS, 8);
  const accountNumber = generateRandomStringOfChars(ALL_DIGITS, 10);

  // calculate the check digits for bank code + branch code and for the account number (both use the same weights)
  const checkDigitWeights = [1, 2, 4, 8, 5, 10, 9, 7, 3, 6];

  let weightedSumDc1 = 0;
  for (let i = 0; i < bankAndBranchCode.length; i++) {
    weightedSumDc1 += Number(bankAndBranchCode[i]) * checkDigitWeights[i + 2]; // 8 digits but 10 weights
  }
  let dc1 = (11 - (weightedSumDc1 % 11)) % 11;
  dc1 = dc1 !== 10 ? dc1 : 1;

  let weightedSumDc2 = 0;
  for (let i = 0; i < accountNumber.length; i++) {
    weightedSumDc2 += Number(accountNumber[i]) * checkDigitWeights[i];
  }
  let dc2 = (11 - (weightedSumDc2 % 11)) % 11;
  dc2 = dc2 !== 10 ? dc2 : 1;

  const bban = bankAndBranchCode + dc1 + dc2 + accountNumber;
  return calculateIbanCheckDigitsAndAssembleIban(COUNTRIES.SPAIN.isoCode, bban);
}

/**
 * @returns {string}
 */
function swissIBAN() {
  const bbanPattern = [{ allowedChars: ALL_DIGITS, length: 17 }];
  return generateSimpleIban(COUNTRIES.SWITZERLAND.isoCode, bbanPattern);
}

/**
 * @returns {string}
 */
function vaticanIBAN() {
  const bbanPattern = [{ allowedChars: ALL_DIGITS, length: 18 }];
  return generateSimpleIban(COUNTRIES.VATICAN_CITY.isoCode, bbanPattern);
}

function frenchOrMonegasqueBBAN() {
  const bankAndBranch = generateRandomStringOfChars(ALL_DIGITS, 10);
  const accountNumber = generateRandomStringOfChars(ALL_LETTERS_AND_ALL_DIGITS, 11);

  // Calculate 2-digit RIB key (french national check digits)
  const bbanWithoutKey = bankAndBranch + accountNumber;

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

  return bbanWithoutKey + ribKey;
}

function italianOrSammarineseBBAN() {
  const bankNumber = generateRandomStringOfChars(ALL_DIGITS, 10);
  const accountNumber = generateRandomStringOfChars(ALL_LETTERS_AND_ALL_DIGITS, 12);
  const bbanWithoutNationalCheck = bankNumber + accountNumber;

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

  return cin + bbanWithoutNationalCheck;
}

/**
 * Combination of allowed chars and length for a part of a BBAN.
 * @typedef {{allowedChars: string, length: number}} BbanGenPattern
 */
/**
 * Generates a simple IBAN (i.e., without any check digits in the BBAN part) according to the provided pattern where
 * each part of a pattern consists of allowed chars and the length for the part.
 *
 * @param {string} countryCode - country code for the IBAN
 * @param {BbanGenPattern[]} bbanPattern - pattern for the IBAN
 * @returns {string} a random IBAN matching the provided pattern
 */
function generateSimpleIban(countryCode, bbanPattern) {
  let bban = "";
  for (const pattern of bbanPattern) {
    bban += generateRandomStringOfChars(pattern.allowedChars, pattern.length);
  }
  return calculateIbanCheckDigitsAndAssembleIban(countryCode, bban);
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
