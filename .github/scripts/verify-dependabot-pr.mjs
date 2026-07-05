#!/usr/bin/env node
/**
 * Verifies that a Dependabot pull request only contains expected, safe changes before it is
 * allowed to be auto-merged. This is a defense-in-depth measure: if this script exits with a
 * non-zero status, the calling workflow must not merge the pull request.
 *
 * Allowed changes:
 *  - package.json: only the version *values* of existing `dependencies`/`devDependencies`
 *    entries may change. Adding/removing a dependency, or changing anything else in the file,
 *    is rejected.
 *  - package-lock.json: allow-listed with no further content validation.
 *  - .github/workflows/codeql.yml, .github/workflows/dependabot-auto-merge.yaml, and
 *    .github/workflows/pipeline.yaml: only the pinned SHA and/or the trailing version comment on a
 *    `uses: owner/repo@<sha> #vX.Y.Z` line may change.
 *  - Any other changed file causes the check to fail.
 *
 * Expects BASE_SHA and HEAD_SHA environment variables (the pull request's base and head commit
 * SHAs) and must be run from within a git checkout that has both commits available locally
 * (e.g. `actions/checkout` with `fetch-depth: 0`).
 */

import { execFileSync } from "node:child_process";

const ALLOWED_FILES = new Set([
  "package.json",
  "package-lock.json",
  ".github/workflows/codeql.yml",
  ".github/workflows/dependabot-auto-merge.yaml",
  ".github/workflows/pipeline.yaml",
]);

const PINNED_ACTION_LINE = /^(?<indent>\s*-?\s*uses:\s*)(?<action>\S+)@(?<sha>[0-9a-f]{40})\s*(?<comment>#.*)?$/;

/**
 * @param {string[]} args - Arguments to pass to the `git` executable.
 * @returns {string} The trimmed stdout produced by the git command.
 */
function git(args) {
  return execFileSync("git", args, { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
}

/**
 * @param {string} baseSha - Base commit SHA of the pull request.
 * @param {string} headSha - Head commit SHA of the pull request.
 * @returns {string[]} List of file paths changed between the two commits.
 */
function getChangedFiles(baseSha, headSha) {
  const output = git(["diff", "--name-only", baseSha, headSha]);
  return output
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * @param {string} sha - A commit SHA.
 * @param {string} path - A repo-relative file path.
 * @returns {string} The file content at that commit.
 */
function showFileAt(sha, path) {
  return git(["show", `${sha}:${path}`]);
}

/**
 * Only allows changes to the version *values* of existing dependencies/devDependencies entries.
 * @param {string} baseSha - Base commit SHA of the pull request.
 * @param {string} headSha - Head commit SHA of the pull request.
 * @param {string[]} violations - Array to append human-readable violation messages to.
 * @returns {void}
 */
function checkPackageJson(baseSha, headSha, violations) {
  let baseContent;
  let headContent;
  try {
    baseContent = JSON.parse(showFileAt(baseSha, "package.json"));
    headContent = JSON.parse(showFileAt(headSha, "package.json"));
  } catch (error) {
    violations.push(`package.json: could not parse base or head content as JSON (${error.message}).`);
    return;
  }

  const baseRest = { ...baseContent };
  const headRest = { ...headContent };
  delete baseRest.dependencies;
  delete baseRest.devDependencies;
  delete headRest.dependencies;
  delete headRest.devDependencies;

  if (JSON.stringify(baseRest) !== JSON.stringify(headRest)) {
    violations.push("package.json: changes outside of 'dependencies'/'devDependencies' are not allowed.");
  }

  for (const section of ["dependencies", "devDependencies"]) {
    const baseKeys = new Set(Object.keys(baseContent[section] ?? {}));
    const headKeys = new Set(Object.keys(headContent[section] ?? {}));

    const added = [...headKeys].filter((key) => !baseKeys.has(key));
    const removed = [...baseKeys].filter((key) => !headKeys.has(key));

    if (added.length > 0) {
      violations.push(`package.json: adding new '${section}' entries is not allowed (${added.join(", ")}).`);
    }
    if (removed.length > 0) {
      violations.push(`package.json: removing '${section}' entries is not allowed (${removed.join(", ")}).`);
    }
  }
}

/**
 * @param {string} diffText - Unified diff text (with `-U0`) for a single file.
 * @returns {Array<{ removed: string[], added: string[] }>} Parsed hunks with their removed/added lines.
 */
function parseHunks(diffText) {
  const lines = diffText.split("\n");
  const hunks = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith("@@")) {
      current = { removed: [], added: [] };
      hunks.push(current);
      continue;
    }
    if (!current) {
      continue;
    }
    if (line.startsWith("---") || line.startsWith("+++")) {
      continue;
    }
    if (line.startsWith("-")) {
      current.removed.push(line.slice(1));
    } else if (line.startsWith("+")) {
      current.added.push(line.slice(1));
    }
  }

  return hunks;
}

/**
 * Only allows changes to the pinned SHA and/or the trailing version comment on a `uses: owner/repo@<sha> #vX.Y.Z` line.
 * @param {string} baseSha - Base commit SHA of the pull request.
 * @param {string} headSha - Head commit SHA of the pull request.
 * @param {string} path - Repo-relative path of the workflow file to check.
 * @param {string[]} violations - Array to append human-readable violation messages to.
 * @returns {void}
 */
function checkPinnedWorkflowFile(baseSha, headSha, path, violations) {
  const diffText = git(["diff", "-U0", baseSha, headSha, "--", path]);
  const hunks = parseHunks(diffText);

  for (const hunk of hunks) {
    if (hunk.removed.length !== hunk.added.length) {
      violations.push(
        `${path}: only 1:1 line edits of pinned action SHAs/comments are allowed, but a hunk adds/removes a different number of lines.`,
      );
      continue;
    }

    for (let i = 0; i < hunk.removed.length; i++) {
      const oldLine = hunk.removed[i];
      const newLine = hunk.added[i];
      const oldMatch = oldLine.match(PINNED_ACTION_LINE);
      const newMatch = newLine.match(PINNED_ACTION_LINE);

      if (!oldMatch || !newMatch) {
        violations.push(
          `${path}: only changes to a pinned 'uses: owner/repo@<sha> #vX.Y.Z' line are allowed. Offending line: "${newLine}".`,
        );
        continue;
      }

      if (oldMatch.groups.indent !== newMatch.groups.indent || oldMatch.groups.action !== newMatch.groups.action) {
        violations.push(`${path}: only the pinned SHA and version comment may change. Offending line: "${newLine}".`);
      }
    }
  }
}

function main() {
  const baseSha = process.env.BASE_SHA;
  const headSha = process.env.HEAD_SHA;

  if (!baseSha || !headSha) {
    // oxlint-disable-next-line no-console -- CLI script must report errors to the CI log
    console.error("BASE_SHA and HEAD_SHA environment variables must be set.");
    process.exit(1);
  }

  const violations = [];
  const changedFiles = getChangedFiles(baseSha, headSha);

  for (const file of changedFiles) {
    if (!ALLOWED_FILES.has(file)) {
      violations.push(`'${file}' is not an allowed file to change in a Dependabot pull request.`);
    }
  }

  if (changedFiles.includes("package.json")) {
    checkPackageJson(baseSha, headSha, violations);
  }

  for (const path of [
    ".github/workflows/codeql.yml",
    ".github/workflows/dependabot-auto-merge.yaml",
    ".github/workflows/pipeline.yaml",
  ]) {
    if (changedFiles.includes(path)) {
      checkPinnedWorkflowFile(baseSha, headSha, path, violations);
    }
  }

  if (violations.length > 0) {
    // oxlint-disable-next-line no-console -- CLI script must report errors to the CI log
    console.error("Dependabot pull request contains disallowed changes:");
    for (const violation of violations) {
      // oxlint-disable-next-line no-console -- CLI script must report errors to the CI log
      console.error(` - ${violation}`);
    }
    process.exit(1);
  }

  // oxlint-disable-next-line no-console -- CLI script must report its result to the CI log
  console.log("Dependabot pull request only contains allowed changes.");
}

main();
