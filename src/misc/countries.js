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
  AUSTRIA: new Country("Austria", "AT"),
  BELGIUM: new Country("Belgium", "BE"),
  CYPRUS: new Country("Cyprus", "CY"),
  FRANCE: new Country("France", "FR"),
  GERMANY: new Country("Germany", "DE"),
  ITALY: new Country("Italy", "IT"),
  MALTA: new Country("Malta", "MT"),
  NETHERLANDS: new Country("Netherlands", "NL"),
  NORWAY: new Country("Norway", "NO"),
  ROMANIA: new Country("Romania", "RO"),
  RUSSIA: new Country("Russia", "RU"),
  SPAIN: new Country("Spain", "ES"),
  SWITZERLAND: new Country("Switzerland", "CH"),
  VATICAN_CITY: new Country("Vatican City", "VA"),
};
