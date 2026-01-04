import { init } from "@paralleldrive/cuid2";
export const CUID_V2_MIN_LENGTH = 2;
export const CUID_V2_MAX_LENGTH = 32;
export const CUID_V2_DEFAULT_LENGTH = 24;

/**
 * Generates a random CUID v2 string.
 *
 * @param {number | undefined} length - length of the CUID v2 (defaults to 24)
 * @returns {string} a random CUID v2 with the specified length
 *
 * @example
 * const id = generateCUIDv2(undefined);
 * console.log(id) // e.g., 'tz4a98xxat96iws9zmbrgj3a'
 */
export function generateCUIDv2(length) {
  if (length !== undefined && (length < CUID_V2_MIN_LENGTH || length > CUID_V2_MAX_LENGTH)) {
    throw Error(`The length for generating a CUIDv2 must be between ${CUID_V2_MIN_LENGTH} and ${CUID_V2_MAX_LENGTH}`);
  }
  const createIdWithLength = init({
    length: length,
  });
  return createIdWithLength();
}
