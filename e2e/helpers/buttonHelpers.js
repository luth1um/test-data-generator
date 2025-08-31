/**
 * Clicks a button.
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} testId Playwright test ID of the button
 * @param {number} times the amount of times the button is clicked (optional, default 1)
 * @returns {Promise<void>} returns when the button is clicked the specified amount of times
 */
export async function clickButton(page, testId, times = 1) {
  for (let i = 0; i < times; i++) {
    await page.getByTestId(testId).click();
  }
}
