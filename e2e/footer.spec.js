import { expect, test } from "@playwright/test";

import { GITHUB_REPO_URL } from "../src/ui/footerUi.js";
import { TestDataGenPage } from "./helpers/testDataGenPage.js";

test.describe("The app footer", () => {
  test("should link to the GitHub source code repository when the app is running", async ({ page }) => {
    // given
    const pom = new TestDataGenPage(page);

    // when
    await pom.goto();
    const githubLink = pom.getGithubLink();

    // then
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute("href", GITHUB_REPO_URL);
    await expect(githubLink).toHaveAttribute("target", "_blank");
    await expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
