import { v4 as uuidv4 } from "uuid";

/**
 * Generates a random UUID v4 string.
 *
 * @returns {string} A randomly generated UUID v4.
 *
 * @example
 * const id = generateUUID();
 * console.log(id); // e.g., '3b12f1df-5232-4804-897e-917bf3996e8c'
 */
export function generateUUID() {
  return uuidv4();
}
