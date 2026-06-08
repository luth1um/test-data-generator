/* global document */

import { DATA_TEST_ID } from "../misc/testgenConstants.js";

export const GITHUB_REPO_URL = "https://github.com/luth1um/test-data-generator";
export const TEST_ID_FOOTER_GITHUB_LINK = "footer-github-link";

/**
 * Initializes the app footer.
 * @param {HTMLElement} appElement - The app container to append the footer to.
 * @returns {void}
 */
export function initFooter(appElement) {
  const footer = document.createElement("footer");
  footer.setAttribute("role", "contentinfo");

  const sourceLink = document.createElement("a");
  sourceLink.href = GITHUB_REPO_URL;
  sourceLink.target = "_blank";
  sourceLink.rel = "noopener noreferrer";
  sourceLink.textContent = "View source code on GitHub";
  sourceLink.setAttribute(DATA_TEST_ID, TEST_ID_FOOTER_GITHUB_LINK);

  footer.appendChild(sourceLink);
  appElement.appendChild(footer);
}
