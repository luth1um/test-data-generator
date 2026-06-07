import { expect, test } from "@playwright/test";

import { TEST_ID_SELECT_TYPE } from "../src/ui/uiLogic.js";
import { TEST_ID_SELECT_VIN_VARIANT } from "../src/ui/vinUi.js";
import { skipMobileBrowsers } from "./helpers/miscHelpers.js";
import { TestDataGenPage } from "./helpers/testDataGenPage.js";

const SAME_ROW_VERTICAL_TOLERANCE_PX = 2;

test.describe("The responsive layout", () => {
  test("should keep the widest dropdowns (VIN) next to each other on desktop", async ({ page }, testInfo) => {
    skipMobileBrowsers(testInfo);

    // given
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    await pom.selectVinGenerator();

    const typeSelectBox = await page.getByTestId(TEST_ID_SELECT_TYPE).boundingBox();
    const variantSelectBox = await page.getByTestId(TEST_ID_SELECT_VIN_VARIANT).boundingBox();

    // then
    expect(typeSelectBox).not.toBeNull();
    expect(variantSelectBox).not.toBeNull();

    const verticalDistance = Math.abs(typeSelectBox.y - variantSelectBox.y);
    expect(verticalDistance).toBeLessThanOrEqual(SAME_ROW_VERTICAL_TOLERANCE_PX);
  });
});
