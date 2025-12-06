import { BIC_OPTION_VALUE } from "../../src/ui/bicUi.js";
import { CUID_V2_OPTION_VALUE } from "../../src/ui/cuidUi.js";
import { IBAN_OPTION_VALUE } from "../../src/ui/ibanUi.js";
import { UUIDV4_OPTION_VALUE } from "../../src/ui/uuidUi.js";

class GeneratorType {
  /**
   * @param {string} name
   * @param {string} optionValue
   */
  constructor(name, optionValue) {
    this.name = name;
    this.optionValue = optionValue;
  }
}

export const GENERATOR_TYPES = [
  new GeneratorType("BIC", BIC_OPTION_VALUE),
  new GeneratorType("CUID v2", CUID_V2_OPTION_VALUE),
  new GeneratorType("IBAN", IBAN_OPTION_VALUE),
  new GeneratorType("UUID v4", UUIDV4_OPTION_VALUE),
];
