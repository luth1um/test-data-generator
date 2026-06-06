import { expect, test } from "@playwright/test";

import {
  VIN_VARIANT_DISPLAY_NAME_MAP,
  VIN_VARIANT_WITH_GERMAN_CHECKSUM,
  VIN_VARIANT_WITHOUT_GERMAN_CHECKSUM,
  VIN_VARIANTS,
} from "../src/generators/vin.js";
import { vinGermanChecksum } from "../src/misc/checksumUtils.js";
import { TEST_ID_SELECT_VIN_VARIANT } from "../src/ui/vinUi.js";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";
import { TestDataGenPage } from "./helpers/testDataGenPage.js";

const VIN_LENGTH = 17;
const VIN_WITH_GERMAN_CHECKSUM_LENGTH = 21;

test.describe("The VIN generator", () => {
  test("should generate a VIN with German checksum by default", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectVinGenerator();
    await pom.clickGenerate();
    const results = await pom.getGeneratedResults();

    // then
    expect(results).toHaveLength(1);
    const vinWithGermanChecksum = results[0];
    expect(vinWithGermanChecksum).toHaveLength(VIN_WITH_GERMAN_CHECKSUM_LENGTH);

    const parts = vinWithGermanChecksum.split(" ");
    expect(parts).toHaveLength(3);
    const vin = parts[0];
    expect(vin).toHaveLength(VIN_LENGTH);
    expect(parts[1]).toBe("-");
    expect(parts[2]).toBe(vinGermanChecksum(vin));
  });

  test("should generate a VIN without German checksum when selected", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectVinWithVariant(VIN_VARIANT_WITHOUT_GERMAN_CHECKSUM);
    await pom.clickGenerate();
    const results = await pom.getGeneratedResults();

    // then
    expect(results).toHaveLength(1);
    expect(results[0]).toHaveLength(VIN_LENGTH);
  });

  test("should generate a VIN with German checksum when selected", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectVinWithVariant(VIN_VARIANT_WITH_GERMAN_CHECKSUM);
    await pom.clickGenerate();
    const results = await pom.getGeneratedResults();

    // then
    expect(results).toHaveLength(1);
    const vinWithGermanChecksum = results[0];
    const parts = vinWithGermanChecksum.split(" ");
    expect(parts).toHaveLength(3);
    expect(parts[0]).toHaveLength(VIN_LENGTH);
    expect(parts[1]).toBe("-");
    expect(parts[2]).toBe(vinGermanChecksum(parts[0]));
  });

  test("should have both VIN variant options", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const pom = new TestDataGenPage(page);
    const expectedVariantValuesSorted = [...VIN_VARIANTS].sort();

    // when
    await pom.goto();
    await pom.selectVinGenerator();
    const variants = await pom.getAllSelectValues(TEST_ID_SELECT_VIN_VARIANT);

    // then
    expect(variants).toHaveLength(expectedVariantValuesSorted.length);
    const variantValuesSorted = variants.map((variant) => variant.value).sort();
    expect(variantValuesSorted).toEqual(expectedVariantValuesSorted);
    variants.forEach((variant) => {
      expect(variant.textContent).toBe(VIN_VARIANT_DISPLAY_NAME_MAP.get(variant.value));
    });
  });

  test("should display the variant dropdown when VIN is selected", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectVinGenerator();

    // then
    await expect(page.getByTestId(TEST_ID_SELECT_VIN_VARIANT)).toBeVisible();
  });
});
