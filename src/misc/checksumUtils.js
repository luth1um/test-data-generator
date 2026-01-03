import { ALL_DIGITS } from "./randomUtils.js";
import { singleDigitSum } from "./numberUtils.js";

/**
 * Calculates the check digit according to ISO/IEC 7064, MOD 11, 10.
 * @param {string} input
 * @returns {string}
 * @throws {Error} If the input contains anything other than digits
 */
export function checkDigitIsoIec7064Mod1110(input) {
  if (!input) {
    throw new Error("Cannot calculate check digit for falsy input");
  }
  Array.from(input).forEach((c) => {
    if (!ALL_DIGITS.includes(c)) {
      throw new Error(`Input should only contain digits, but contains: ${c}`);
    }
  });

  let product = 10;
  for (const digit of input) {
    let sum = (Number(digit) + product) % 10;
    if (sum === 0) {
      sum = 10;
    }
    product = (sum * 2) % 11;
  }
  const checkDigit = 11 - product;

  return checkDigit === 10 ? "0" : String(checkDigit);
}

/**
 * Calculates the check digit for the German Steuernummer according to the "2er-Verfahren".
 * @param {string} partialStNr
 * @returns {string}
 * @throws {Error} If the input does not have the correct length
 */
export function checkDigitGermanStNr2erVerfahren(partialStNr) {
  if (partialStNr.length !== 12) {
    throw new Error("Length of partial stNr must be 12");
  }

  const summands = [0, 0, 9, 8, 0, 7, 6, 5, 4, 3, 2, 1];
  const coefficients = [0, 0, 512, 256, 0, 128, 64, 32, 16, 8, 4, 2];

  let sumOfDigitSums = 0;
  for (let i = 0; i < partialStNr.length; i++) {
    const sum = (Number(partialStNr[i]) + summands[i]) % 10;
    const product = sum * coefficients[i];
    const digitSum = singleDigitSum(product);
    sumOfDigitSums += digitSum;
  }

  if (sumOfDigitSums % 10 === 0) {
    return "0";
  }
  return String(10 - (sumOfDigitSums % 10));
}

/**
 * Calculates the check digit for the German Steuernummer according to the "11er-Verfahren".
 * @param {string} partialStNr
 * @param {number[]} weights
 * @returns {string}
 * @throws {Error} If the inputs do not have the correct length
 */
export function checkDigitGermanStNr11erVerfahren(partialStNr, weights) {
  if (partialStNr.length !== 12 || weights.length !== 12) {
    throw new Error("Length of partial stNr and weights must be 12");
  }

  let sum = 0;
  for (let i = 0; i < partialStNr.length; i++) {
    sum += Number(partialStNr[i]) * weights[i];
  }

  if (partialStNr.startsWith("5")) {
    // different calculation for NRW
    return String(sum % 11);
  }
  return String(11 - (sum % 11));
}

/**
 * Calculates the check digit for the German Steuernummer according to the "11er-Verfahren" for Berlin.
 * @param {string} partialStNr
 * @returns {string}
 * @throws {Error} If the input does not have the correct length
 */
export function checkDigitGermanStNr11erVerfahrenBerlin(partialStNr) {
  if (partialStNr.length !== 12) {
    throw new Error("Length of partial stNr must be 12");
  }

  const weightsBerlinA = [0, 0, 0, 0, 0, 7, 6, 5, 8, 4, 3, 2];
  const weightsBerlinB = [0, 0, 2, 9, 0, 8, 7, 6, 5, 4, 3, 2];

  const bufaNr = partialStNr.substring(0, 4);
  const districtNr = Number(partialStNr.substring(4, 8));
  let weights = weightsBerlinB;

  const isBufaA = ["1127", "1129", "1130"].includes(bufaNr);
  const isBufaWithDistrictForA =
    ["1113", "1114", "1117", "1120", "1121", "1123", "1124", "1125"].includes(bufaNr) &&
    (districtNr < 201 || districtNr > 693);
  const isNeukoellnWithDistrictForA =
    bufaNr === "1116" &&
    ((districtNr > 29 && districtNr < 201) || (districtNr > 693 && districtNr < 875) || districtNr > 899);
  const isSpandauWithDistrictForA =
    bufaNr === "1119" && (districtNr < 201 || districtNr > 639) && districtNr !== 680 && districtNr !== 684;

  if (isBufaA || isBufaWithDistrictForA || isNeukoellnWithDistrictForA || isSpandauWithDistrictForA) {
    weights = weightsBerlinA;
  }

  return checkDigitGermanStNr11erVerfahren(partialStNr, weights);
}

/**
 * Calculates the check digit for the German Steuernummer according to the modified "11er-Verfahren" for Rhineland-Palatinate.
 * @param {string} partialStNr
 * @returns {string}
 * @throws {Error} If the input does not have the correct length
 */
export function checkDigitGermanStNr11erVerfahrenModifiedRp(partialStNr) {
  if (partialStNr.length !== 12) {
    throw new Error("Length of partial stNr must be 12");
  }

  const weightsRp = [0, 0, 1, 2, 0, 1, 2, 1, 2, 1, 2, 1];
  let sum = 0;
  for (let i = 0; i < partialStNr.length; i++) {
    let product = Number(partialStNr[i]) * weightsRp[i];
    if (product >= 10) {
      product = (product % 10) + 1;
    }
    sum += product;
  }

  return String(10 - (sum % 10));
}
