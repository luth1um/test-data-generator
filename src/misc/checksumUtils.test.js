import { TAX_ID_GERMANY_STEUER_ID, generateTaxId } from "../generators/taxId.js";
import {
  checkDigitGermanStNr11erVerfahren,
  checkDigitGermanStNr11erVerfahrenBerlin,
  checkDigitGermanStNr11erVerfahrenModifiedRp,
  checkDigitGermanStNr2erVerfahren,
  checkDigitIsoIec7064Mod1110,
} from "./checksumUtils.js";
import { describe, expect, it } from "vitest";
import { RANDOM_FUNCTION_TEST_CALL_COUNT } from "./testgenConstants.js";

describe("The checksum calculation for ISO/IEC 7064, MOD 11, 10", () => {
  it.each([
    ["1556078923", "0"],
    ["7684928013", "1"],
    ["6238070459", "2"],
    ["3346351970", "3"],
    ["1642003907", "4"],
    ["0794", "5"],
    ["2578591503", "6"],
    ["8015968473", "7"],
    ["1605963287", "8"],
    ["7402886358", "9"],
  ])("should calculate the correct check digit when the input is '%s'", (input, expected) => {
    // when
    const result = checkDigitIsoIec7064Mod1110(input);

    // then
    expect(result).toBe(expected);
  });

  it(
    "should have remainder '0' for the checking algorithm when called multiple times with random values",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const steuerId = generateTaxId(TAX_ID_GERMANY_STEUER_ID);

      // then
      let product = 10;
      let sum = 0;

      for (const digit of steuerId) {
        sum = (Number(digit) + product) % 10;
        if (sum === 0) {
          sum = 10;
        }
        product = (sum * 2) % 11;
      }
      const result = (11 - sum) % 10;

      expect(result).toBe(0);
    },
  );

  it("should throw an error when the input contains a non-digit character", () => {
    // given
    const nonDigitChar = "a";
    const checksumFn = () => checkDigitIsoIec7064Mod1110("123" + nonDigitChar);

    // when / then
    expect(checksumFn).toThrowError(`Input should only contain digits, but contains: ${nonDigitChar}`);
  });

  it.each(["", undefined, null])("should throw an error for falsy input '%s'", (input) => {
    // given
    const checksumFn = () => checkDigitIsoIec7064Mod1110(input);

    // when / then
    expect(checksumFn).toThrowError("Cannot calculate check digit for falsy input");
  });
});

describe("The checksum calculation for the '2er-Verfahren' of the German 'Steuernummer'", () => {
  it.each([
    ["212908150815", "8"],
    ["261308150815", "3"],
    ["286608150815", "6"],
    ["286608963815", "0"],
  ])("should calculate the correct check digit when the input is %s", (input, expected) => {
    // when
    const result = checkDigitGermanStNr2erVerfahren(input);

    // then
    expect(result).toBe(expected);
  });

  it.each(["", "1", "12345678901", "1234567890123"])(
    "should throw an error when the input does not have length 12 (input '%s')",
    (input) => {
      // given
      const checksumFn = () => checkDigitGermanStNr2erVerfahren(input);

      // when / then
      expect(checksumFn).toThrowError("Length of partial stNr must be 12");
    },
  );
});

describe("The checksum calculation for the '11er-Verfahren' of the German 'Steuernummer'", () => {
  it.each([
    ["918108150815", [0, 5, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2], "5"],
    ["304808150815", [0, 5, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2], "5"],
    ["247508150815", [0, 0, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2], "2"],
    ["220208150815", [0, 0, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2], "6"],
    ["232408150815", [0, 0, 2, 9, 0, 8, 7, 6, 5, 4, 3, 2], "1"],
    ["407908150815", [0, 5, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2], "1"],
    ["513308150815", [0, 3, 2, 1, 0, 7, 6, 5, 4, 3, 2, 1], "9"],
    ["101008150818", [0, 5, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2], "2"],
    ["310108150815", [0, 5, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2], "4"],
    ["415108150815", [0, 5, 4, 3, 0, 2, 7, 6, 5, 4, 3, 2], "6"],
    ["123456789123", [9, 8, 7, 6, 5, 4, 3, 2, 1, 10, 11, 12], "9"],
  ])("should calculate the correct check digit when the input is %s", (partialStNr, weights, expected) => {
    // when
    const result = checkDigitGermanStNr11erVerfahren(partialStNr, weights);

    // then
    expect(result).toBe(expected);
  });

  it.each(["", "1", "12345678901", "1234567890123"])(
    "should throw an error when the partial stNr does not have length 12 (input '%s')",
    (partialStNr) => {
      // given
      const weights = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      const checksumFn = () => checkDigitGermanStNr11erVerfahren(partialStNr, weights);

      // when / then
      expect(checksumFn).toThrowError("Length of partial stNr and weights must be 12");
    },
  );

  it.each([0, 1, 11, 13])(
    "should throw an error when the weights input does not have length 12 (input length '%s')",
    (weightsLength) => {
      // given
      const partialStNr = "123456789012";
      const weights = Array.from({ length: weightsLength }, () => 1);
      const checksumFn = () => checkDigitGermanStNr11erVerfahren(partialStNr, weights);

      // when / then
      expect(checksumFn).toThrowError("Length of partial stNr and weights must be 12");
    },
  );
});

describe("The checksum calculation for the '11er-Verfahren' of the German 'Steuernummer' for Berlin", () => {
  it.each([
    ["111300019123", "6"],
    ["111302009123", "8"],
    ["111306949123", "5"],
    ["111308319123", "9"],
    ["111400019123", "6"],
    ["111402009123", "8"],
    ["111406949123", "5"],
    ["111408319123", "9"],
    ["111600309123", "4"],
    ["111601249123", "5"],
    ["111602009123", "8"],
    ["111606949123", "5"],
    ["111607679123", "1"],
    ["111608749123", "3"],
    ["111609009123", "3"],
    ["111609349123", "9"],
    ["111700019123", "6"],
    ["111702009123", "8"],
    ["111706949123", "5"],
    ["111708319123", "9"],
    ["111900019123", "6"],
    ["111901269123", "6"],
    ["111902009123", "8"],
    ["111906409124", "9"],
    ["111906799123", "3"],
    ["111906819123", "4"],
    ["111906839123", "5"],
    ["111906859123", "6"],
    ["111908179123", "2"],
    ["112000019123", "6"],
    ["112002009123", "8"],
    ["112006949123", "5"],
    ["112008319123", "9"],
    ["112100019123", "6"],
    ["112102009123", "8"],
    ["112106949123", "5"],
    ["112108319123", "9"],
    ["112300019123", "6"],
    ["112302009123", "8"],
    ["112306949123", "5"],
    ["112308319123", "9"],
    ["112400019123", "6"],
    ["112402009123", "8"],
    ["112406949123", "5"],
    ["112408319123", "9"],
    ["112500019123", "6"],
    ["112502009123", "8"],
    ["112506949123", "5"],
    ["112508319123", "9"],
    ["112706789123", "8"],
    ["112906789123", "8"],
    ["113006789123", "8"],
  ])(
    "should calculate the correct check digit when bufaNr/districtNr require weights for Berlin A (input %s)",
    (input, expected) => {
      // when
      const result = checkDigitGermanStNr11erVerfahrenBerlin(input);

      // then
      expect(result).toBe(expected);
    },
  );

  it.each([
    ["111200939123", "3"],
    ["111507199123", "6"],
    ["111804919123", "6"],
    ["111302019123", "9"],
    ["111305139124", "8"],
    ["111306939123", "1"],
    ["111402019125", "7"],
    ["111405139127", "4"],
    ["111406939123", "3"],
    ["111600109123", "8"],
    ["111600299123", "2"],
    ["111602019123", "4"],
    ["111604329123", "5"],
    ["111606939123", "7"],
    ["111608759123", "4"],
    ["111608999723", "8"],
    ["111702019123", "6"],
    ["111705139124", "5"],
    ["111706939123", "9"],
    ["111902014061", "9"],
    ["111905179123", "9"],
    ["111906399123", "8"],
    ["111906809123", "5"],
    ["111906849123", "3"],
    ["112002019123", "1"],
    ["112005139121", "6"],
    ["112006939123", "4"],
    ["112102019123", "3"],
    ["112105139124", "2"],
    ["112106939123", "6"],
    ["112302019123", "7"],
    ["112305139124", "6"],
    ["112306939129", "9"],
    ["112402019123", "9"],
    ["112405139124", "8"],
    ["112406939123", "1"],
    ["112502017423", "9"],
    ["112505139324", "2"],
    ["112506939123", "3"],
    ["113102719123", "7"],
    ["113209169123", "9"],
    ["113302189124", "9"],
    ["113402949123", "3"],
    ["113501739173", "7"],
    ["113601789123", "5"],
    ["113701739123", "4"],
    ["113801649123", "7"],
    ["119401739123", "8"],
    ["119501739853", "6"],
    ["119601739123", "1"],
    ["119709379123", "9"],
    ["119807539123", "4"],
  ])(
    "should calculate the correct check digit when bufaNr/districtNr require weights for Berlin B (input %s)",
    (input, expected) => {
      // when
      const result = checkDigitGermanStNr11erVerfahrenBerlin(input);

      // then
      expect(result).toBe(expected);
    },
  );

  it.each(["", "1", "12345678901", "1234567890123"])(
    "should throw an error when the partial stNr does not have length 12 (input '%s')",
    (partialStNr) => {
      // given
      const checksumFn = () => checkDigitGermanStNr11erVerfahrenBerlin(partialStNr);

      // when / then
      expect(checksumFn).toThrowError("Length of partial stNr must be 12");
    },
  );
});

describe("The checksum calculation for the modified '11er-Verfahren' of the German 'Steuernummer' for RP", () => {
  it.each([
    ["272208150815", "4"],
    ["279908150815", "2"],
    ["279906150816", "3"],
  ])("should calculate the correct check digit when the input is %s", (input, expected) => {
    // when
    const result = checkDigitGermanStNr11erVerfahrenModifiedRp(input);

    // then
    expect(result).toBe(expected);
  });

  it.each(["", "1", "12345678901", "1234567890123"])(
    "should throw an error when the partial stNr does not have length 12 (input '%s')",
    (partialStNr) => {
      // given
      const checksumFn = () => checkDigitGermanStNr11erVerfahrenModifiedRp(partialStNr);

      // when / then
      expect(checksumFn).toThrowError("Length of partial stNr must be 12");
    },
  );
});
