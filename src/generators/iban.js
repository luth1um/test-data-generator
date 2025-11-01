/**
 * Generates a valid random IBAN for the specified country code.
 *
 * @param {string} countryCode - The two-letter ISO country code (e.g., 'DE').
 * @returns {string} A valid, randomly generated IBAN for the given country.
 * @throws {Error} If the country code is not supported.
 *
 * @example
 * const iban = generateIBAN('DE');
 * console.log(iban); // e.g., 'DE44123456781234567890'
 */
export function generateIBAN(countryCode) {
  switch (countryCode) {
    case "DE":
      return generateGermanIBAN();
    case "MT":
      return generateMaltaIBAN();
    case "NO":
      return generateNorwegianIBAN();
    default:
      throw new Error(`IBAN generation for country code '${countryCode}' is not supported.`);
  }
}

/**
 * Generates a valid random German IBAN (International Bank Account Number).
 *
 * The generated IBAN will:
 * - Start with the country code 'DE'
 * - Contain valid check digits
 * - Use a random 8-digit bank code (BLZ)
 * - Use a random 10-digit account number
 *
 * @returns {string} A valid, randomly generated German IBAN (e.g., 'DEkkbbbbbbbbcccccccccc')
 *
 * @example
 * const iban = generateGermanIBAN();
 * console.log(iban); // e.g., 'DE44123456781234567890'
 */
function generateGermanIBAN() {
  // Generate random 8-digit bank code (BLZ)
  const bankCode = String(Math.floor(10000000 + Math.random() * 90000000));
  // Generate random 10-digit account number, padded with leading zeros
  const accountNumber = String(Math.floor(Math.random() * 1e10)).padStart(10, "0");

  // Assemble BBAN (bank code + account number)
  const bban = bankCode + accountNumber;

  // Calculate check digits
  const countryCode = "DE";
  const checkDigits = calculateIBANCheckDigits(countryCode, bban);

  // Assemble IBAN
  return `${countryCode}${checkDigits}${bban}`;
}

/**
 * Generates a valid random Maltese IBAN (International Bank Account Number).
 *
 * The generated IBAN will:
 * - Start with the country code 'MT'
 * - Contain valid check digits
 * - Use 4 uppercase letters describing the first part of a BIC
 * - Use a random 5-digit branch code
 * - Use a random 18-character alphanumeric account number
 *
 * @returns {string} A valid, randomly generated Malta IBAN (e.g., 'MTkkLLLLdddddaaaaaaaaaaaaaaaaaa')
 *
 * @example
 * const iban = generateMaltaIBAN();
 * console.log(iban); // e.g., 'MT84MALT011000012345MTLONT001234'
 */
function generateMaltaIBAN() {
  // Generate random 4 uppercase letters for BIC part
  const bicPart = Array.from({ length: 4 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join("");

  // Generate random 5-digit branch code
  const branchCode = String(Math.floor(Math.random() * 1e5)).padStart(5, "0");

  // Generate random 18-character alphanumeric account number
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const accountNumber = Array.from({ length: 18 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

  // Assemble BBAN
  const bban = bicPart + branchCode + accountNumber;

  // Calculate check digits
  const countryCode = "MT";
  const checkDigits = calculateIBANCheckDigits(countryCode, bban);

  // Assemble IBAN
  return `${countryCode}${checkDigits}${bban}`;
}

/**
 * Generates a valid random Norwegian IBAN (International Bank Account Number).
 *
 * The generated IBAN will:
 * - Start with the country code 'NO'
 * - Contain valid check digits
 * - Use a random 4-digit bank code
 * - Use a random 6-digit account number
 *
 * @returns {string} A valid, randomly generated Norwegian IBAN (e.g., 'NOkkbbbbccccccd')
 *
 * @example
 * const iban = generateNorwegianIBAN();
 * console.log(iban); // e.g., 'NO9386011117947'
 */
function generateNorwegianIBAN() {
  // Generate random 4-digit bank code (cannot start with 0)
  const bankCode = String(Math.floor(1000 + Math.random() * 9000));
  // Generate random 6-digit account number (can start with 0)
  const accountNumber = String(Math.floor(Math.random() * 1e6)).padStart(6, "0");

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

  const countryCode = "NO";
  const ibanCheckDigits = calculateIBANCheckDigits(countryCode, bban);

  return `${countryCode}${ibanCheckDigits}${bban}`;
}

/**
 * Calculates the IBAN check digits for a given country code and BBAN.
 *
 * @param {string} countryCode - The two-letter ISO country code (e.g., 'DE').
 * @param {string} bban - The BBAN part of the IBAN (country-specific format).
 * @returns {string} The two check digits as a string.
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
