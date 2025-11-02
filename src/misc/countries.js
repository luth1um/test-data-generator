export class Country {
  /**
   * @param {string} name Name of the country
   * @param {string} isoCode ISO code of the country
   */
  constructor(name, isoCode) {
    this.name = name;
    this.isoCode = isoCode;
  }

  /**
   * Generates the display name of the country
   * @returns {string} the display name of the country
   */
  displayName() {
    return `${this.name} (${this.isoCode})`;
  }
}

export const COUNTRIES = {
  BELGIUM: new Country("Belgium", "BE"),
  FRANCE: new Country("France", "FR"),
  GERMANY: new Country("Germany", "DE"),
  ITALY: new Country("Italy", "IT"),
  MALTA: new Country("Malta", "MT"),
  NETHERLANDS: new Country("Netherlands", "NL"),
  NORWAY: new Country("Norway", "NO"),
  RUSSIA: new Country("Russia", "RU"),
  SWITZERLAND: new Country("Switzerland", "CH"),
  UK: new Country("United Kingdom", "GB"),
};
