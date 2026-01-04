import {
  TAX_ID_GERMANY_STEUER_ID,
  TAX_ID_GERMANY_ST_NR,
  TAX_ID_GERMANY_UST_ID,
  TAX_ID_GERMANY_W_ID,
  TAX_ID_TYPES,
  TYPE_DISPLAY_NAME_MAP,
  generateTaxId,
} from "./taxId.js";
import {
  checkDigitGermanStNr11erVerfahren,
  checkDigitGermanStNr11erVerfahrenBerlin,
  checkDigitGermanStNr11erVerfahrenModifiedRp,
  checkDigitGermanStNr2erVerfahren,
  checkDigitIsoIec7064Mod1110,
} from "../misc/checksumUtils.js";
import { describe, expect, it } from "vitest";
import { ALL_DIGITS } from "../misc/randomUtils.js";
import { COUNTRIES } from "../misc/countries.js";
import { RANDOM_FUNCTION_TEST_CALL_COUNT } from "../misc/testgenConstants.js";
import { digitCount } from "../misc/numberUtils.js";

describe.each(TAX_ID_TYPES)("The tax-ID generator", (type) => {
  it(
    `should generate a truthy result when the input is valid type '${type}'`,
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const result = generateTaxId(type);

      // then
      expect(result).toBeTruthy();
    },
  );

  it(
    `should generate a string when the input is valid type '${type}'`,
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const result = generateTaxId(type);

      // then
      expect(typeof result).toBe("string");
    },
  );
});

describe("The tax-ID generator", () => {
  it(
    "should generate a string of length 11 when a German Steuer-IdNr. is selected as type",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_STEUER_ID);

      // then
      expect(id).toHaveLength(11);
    },
  );

  it(
    "should generate a string only consisting of digits when a German Steuer-IdNr. is selected as type",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_STEUER_ID);

      // then
      for (const digit of id) {
        expect(digit).toBeOneOf(Array.from(ALL_DIGITS));
      }
    },
  );

  it(
    "should generate an ID with exactly one digit being used more than once when a German Steuer-IdNr. is selected as type",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const idWithoutCheck = generateTaxId(TAX_ID_GERMANY_STEUER_ID).substring(0, 10);

      // then
      const digitCounts = digitCount(idWithoutCheck);

      let digitsBeingUsedMoreThanOnce = 0;
      for (const count of digitCounts.values()) {
        if (count > 1) {
          digitsBeingUsedMoreThanOnce++;
        }
      }

      expect(digitsBeingUsedMoreThanOnce).toBe(1);
    },
  );

  it(
    "should generate an ID with no digit being used more than three times when a German Steuer-IdNr. is selected as type",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_STEUER_ID);
      const idWithoutCheck = id.substring(0, 10);

      // then
      const c = digitCount(idWithoutCheck);

      for (const count of c.values()) {
        expect(count).toBeLessThanOrEqual(3);
      }
    },
  );

  it(
    "should generate an ID where no digit is used more than twice subsequently when a German Steuer-IdNr. is selected as type",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_STEUER_ID);
      const idWithoutCheck = id.substring(0, 10);

      // then
      for (let i = 2; i < idWithoutCheck.length; i++) {
        const currentMinusTwo = idWithoutCheck[i - 2];
        const currentMinusOne = idWithoutCheck[i - 1];
        const current = idWithoutCheck[i];
        const threeEqualSubsequently = currentMinusTwo === currentMinusOne && currentMinusOne === current;

        expect(threeEqualSubsequently).toBeFalsy();
      }
    },
  );

  it(
    "should generate an ID with a valid checksum when a German Steuer-IdNr. is selected as type",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const steuerId = generateTaxId(TAX_ID_GERMANY_STEUER_ID);

      // then
      const idWithoutCheck = steuerId.substring(0, steuerId.length - 1);
      const checkDigit = steuerId[steuerId.length - 1];
      const expectedCheckDigit = checkDigitIsoIec7064Mod1110(idWithoutCheck);

      expect(checkDigit).toBe(expectedCheckDigit);
    },
  );

  it(
    "should generate an ID that does not start with '0' when a German Steuer-IdNr. is selected as type",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_STEUER_ID);

      // then
      expect(id[0]).not.toBe("0");
    },
  );

  it(
    "should generate a string of length 11 when the German USt-IdNr. is selected",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_UST_ID);

      // then
      expect(id).toHaveLength(11);
    },
  );

  it(
    `should generate a string starting with '${COUNTRIES.GERMANY.isoCode}' when the German USt-IdNr. is selected`,
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_UST_ID);

      // then
      const countryCode = id.substring(0, 2);
      expect(countryCode).toBe(COUNTRIES.GERMANY.isoCode);
    },
  );

  it(
    `should generate a string only consisting of digits after '${COUNTRIES.GERMANY.isoCode}' when the German USt-IdNr. is selected`,
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_UST_ID);

      // then
      const randomPart = id.substring(2);
      for (const digit of randomPart) {
        expect(digit).toBeOneOf(Array.from(ALL_DIGITS));
      }
    },
  );

  it(
    "should generate an ID with a valid check digit when the German USt-IdNr. is selected",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_UST_ID);

      // then
      const randomPartWithoutCheck = id.substring(2, id.length - 1);
      const checkDigit = id[id.length - 1];
      const expectedCheckDigit = checkDigitIsoIec7064Mod1110(randomPartWithoutCheck);

      expect(checkDigit).toBe(expectedCheckDigit);
    },
  );

  it(
    "should generate a string of length 17 when the German W-IdNr. is selected",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_W_ID);

      // then
      expect(id).toHaveLength(17);
    },
  );

  it(
    `should generate a string starting with '${COUNTRIES.GERMANY.isoCode}' when the German W-IdNr. is selected`,
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_W_ID);

      // then
      const countryCode = id.substring(0, 2);
      expect(countryCode).toBe(COUNTRIES.GERMANY.isoCode);
    },
  );

  it(
    `should generate a string only consisting of digits for the first part after '${COUNTRIES.GERMANY.isoCode}' when the German W-IdNr. is selected`,
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_W_ID);

      // then
      const randomPart = id.substring(2, 11);
      for (const digit of randomPart) {
        expect(digit).toBeOneOf(Array.from(ALL_DIGITS));
      }
    },
  );

  it(
    `should generate a string only consisting of digits for the Unterscheidungsmerkmal when the German W-IdNr. is selected`,
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_W_ID);

      // then
      const unterscheidungsmerkmal = id.substring(12);
      for (const digit of unterscheidungsmerkmal) {
        expect(digit).toBeOneOf(Array.from(ALL_DIGITS));
      }
    },
  );

  it(
    `should generate an Unterscheidungsmerkmal of length 5 when the German W-IdNr. is selected`,
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_W_ID);

      // then
      const unterscheidungsmerkmal = id.substring(12);
      expect(unterscheidungsmerkmal).toHaveLength(5);
    },
  );

  it(
    `should include a dash before the Unterscheidungsmerkmal when the German W-IdNr. is selected`,
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_W_ID);

      // then
      const separator = id[11];
      expect(separator).toBe("-");
    },
  );

  it(
    "should generate an ID with a valid check digit when the German W-IdNr. is selected",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_W_ID);

      // then
      const randomPartWithoutCheck = id.substring(2, 10);
      const checkDigit = id[10];
      const expectedCheckDigit = checkDigitIsoIec7064Mod1110(randomPartWithoutCheck);

      expect(checkDigit).toBe(expectedCheckDigit);
    },
  );

  it(
    "should generate a string of length 13 when the German St.-Nr. is selected",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_ST_NR);

      // then
      expect(id).toHaveLength(13);
    },
  );

  it(
    "should generate a string only consisting of digits when the German St.-Nr. is selected",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_ST_NR);

      // then
      for (const digit of id) {
        expect(digit).toBeOneOf(Array.from(ALL_DIGITS));
      }
    },
  );

  it(
    "should generate a string with '0' at position 4 (0-indexed) when the German St.-Nr. is selected",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const id = generateTaxId(TAX_ID_GERMANY_ST_NR);

      // then
      expect(id[4]).toBe("0");
    },
  );

  it(
    "should start with a valid state code when the German St.-Nr. is selected",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // given
      const validStateCodes = ["3", "4", "5", "9", "10", "11", "21", "22", "23", "24", "26", "27", "28"];

      // when
      const id = generateTaxId(TAX_ID_GERMANY_ST_NR);

      // then
      const generatedStateCode = id.startsWith("1") || id.startsWith("2") ? id.substring(0, 2) : id[0];
      expect(generatedStateCode).toBeOneOf(validStateCodes);
    },
  );

  it("should have an ID-name pair for each tax ID type", () => {
    // given
    const allIdTypes = TAX_ID_TYPES;
    const allIdTypesWithDisplayName = Array.from(TYPE_DISPLAY_NAME_MAP.keys());

    // then
    expect(allIdTypesWithDisplayName).toEqual(allIdTypes);
  });
});

describe("The tax-ID generator for the German St.-Nr.", () => {
  it.each([
    ["Baden-Württemberg", "28", checkDigitGermanStNr2erVerfahren],
    ["Bavaria", "9", (s) => checkDigitGermanStNr11erVerfahren(s, [0, 5, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2])],
    ["Berlin", "11", checkDigitGermanStNr11erVerfahrenBerlin],
    ["Brandenburg", "3", (s) => checkDigitGermanStNr11erVerfahren(s, [0, 5, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2])],
    ["Bremen", "24", (s) => checkDigitGermanStNr11erVerfahren(s, [0, 0, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2])],
    ["Hamburg", "22", (s) => checkDigitGermanStNr11erVerfahren(s, [0, 0, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2])],
    ["Hesse", "26", checkDigitGermanStNr2erVerfahren],
    ["Lower Saxony", "23", (s) => checkDigitGermanStNr11erVerfahren(s, [0, 0, 2, 9, 0, 8, 7, 6, 5, 4, 3, 2])],
    ["Mecklenburg-Vorpommern", "4", (s) => checkDigitGermanStNr11erVerfahren(s, [0, 5, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2])],
    ["North Rhine-Westphalia", "5", (s) => checkDigitGermanStNr11erVerfahren(s, [0, 3, 2, 1, 0, 7, 6, 5, 4, 3, 2, 1])],
    ["Rhineland-Palatinate", "27", checkDigitGermanStNr11erVerfahrenModifiedRp],
    ["Saarland", "10", (s) => checkDigitGermanStNr11erVerfahren(s, [0, 5, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2])],
    ["Saxony", "3", (s) => checkDigitGermanStNr11erVerfahren(s, [0, 5, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2])],
    ["Saxony-Anhalt", "3", (s) => checkDigitGermanStNr11erVerfahren(s, [0, 5, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2])],
    ["Schleswig-Holstein", "21", checkDigitGermanStNr2erVerfahren],
    ["Thuringia", "4", (s) => checkDigitGermanStNr11erVerfahren(s, [0, 5, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2])],
  ])(
    "should generate a tax ID with the correct check digit when the ID is generated for %s",
    (_, stateCode, checkDigitFn) => {
      // given
      const genFn = () => generateTaxId(TAX_ID_GERMANY_ST_NR);
      const genAmount = RANDOM_FUNCTION_TEST_CALL_COUNT * 10;
      const stateCodeFilter = (id) => id.startsWith(stateCode);

      // when
      const results = Array.from({ length: genAmount }, genFn);
      const resultsForState = results.filter(stateCodeFilter);

      // then
      expect(resultsForState.length).toBeGreaterThanOrEqual(1);
      for (const id of resultsForState) {
        const idWithoutCheck = id.substring(0, id.length - 1);
        const checkDigit = id[id.length - 1];
        const expectedCheckDigit = checkDigitFn(idWithoutCheck);

        expect(checkDigit).toBe(expectedCheckDigit);
      }
    },
  );
});

describe.each(["", " ", "invalid", undefined, null, 1, {}])("The tax-ID generator", (invalidInput) => {
  it(`should throw an error when using the invalid input '${invalidInput}'`, () => {
    // given
    const genFn = () => generateTaxId(invalidInput);

    // when / then
    expect(genFn).toThrow(`Invalid input ${invalidInput}. Must be one of ${TAX_ID_TYPES}`);
  });
});
