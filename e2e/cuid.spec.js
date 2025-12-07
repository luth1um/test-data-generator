import { test, expect } from "@playwright/test";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";
import { CUID_V2_DEFAULT_LENGTH, CUID_V2_MAX_LENGTH, CUID_V2_MIN_LENGTH } from "../src/generators/cuid.js";
import { TestDataGenPage } from "./helpers/testDataGenPage.js";

test.describe("The CUID v2 generator", () => {
  test("should generate a valid CUID", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const expectedLength = CUID_V2_DEFAULT_LENGTH;
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectCuid2Generator();
    await pom.clickGenerate();
    const results = await pom.getGeneratedResults();

    // then
    expect(results).toHaveLength(1);
    const result = results[0];
    expect(result).toHaveLength(expectedLength);
  });

  test(`should generate a CUID with the specified length when the length is set to a value`, async ({
    page,
  }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const inputLength = 19;
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectCuid2WithLength(inputLength);
    await pom.clickGenerate();
    const results = await pom.getGeneratedResults();

    // then
    expect(results).toHaveLength(1);
    const result = results[0];
    expect(result).toHaveLength(inputLength);
  });

  test(`should generate a CUID of length ${CUID_V2_MIN_LENGTH} when the input length is too small`, async ({
    page,
  }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const lengthTooSmall = CUID_V2_MIN_LENGTH - 1;
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectCuid2WithLength(lengthTooSmall);
    await pom.clickGenerate();
    const results = await pom.getGeneratedResults();

    // then
    expect(results).toHaveLength(1);
    const result = results[0];
    expect(result).toHaveLength(CUID_V2_MIN_LENGTH);
  });

  test(`should generate a CUID of length ${CUID_V2_MAX_LENGTH} when the input length is too big`, async ({
    page,
  }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const lengthTooBig = CUID_V2_MAX_LENGTH + 1;
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectCuid2WithLength(lengthTooBig);
    await pom.clickGenerate();
    const results = await pom.getGeneratedResults();

    // then
    expect(results).toHaveLength(1);
    const result = results[0];
    expect(result).toHaveLength(CUID_V2_MAX_LENGTH);
  });

  test(`should generate a CUID of length ${CUID_V2_DEFAULT_LENGTH} when the input length is NaN`, async ({
    page,
  }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const nanInput = " ";
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectCuid2WithLength(nanInput);
    await pom.clickGenerate();
    const results = await pom.getGeneratedResults();

    // then
    expect(results).toHaveLength(1);
    const result = results[0];
    expect(result).toHaveLength(CUID_V2_DEFAULT_LENGTH);
  });
});
