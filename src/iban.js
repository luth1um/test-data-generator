/**
 * Generates a valid random IBAN for the specified country code.
 *
 * Currently, only 'DE' (Germany) is supported.
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
  if (countryCode === "DE") {
    return generateGermanIBAN();
  }
  throw new Error(`IBAN generation for country code '${countryCode}' is not supported.`);
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
  // 1. Move country code and '00' to the end
  // 2. Replace letters with numbers (A=10, B=11, ..., Z=35)
  // 3. Calculate 98 - (number mod 97)
  const countryCode = "DE";
  const replaced = bban + "131400"; // D=13, E=14, 00 for check digits
  const mod97 = BigInt(replaced) % 97n;
  const checkDigits = String(98n - mod97).padStart(2, "0");

  // Assemble IBAN
  return `${countryCode}${checkDigits}${bankCode}${accountNumber}`;
}
