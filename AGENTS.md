# AGENTS.md — Coding Agent Guidelines

This file provides instructions for AI coding agents working in this repository.

---

## Project Overview

`test-data-generator` is a **vanilla JavaScript** static single-page application (no framework) built with Vite. It generates test data such as IBANs, BICs, UUIDs, CUIDs, and Tax IDs. There is no TypeScript — types are expressed via JSDoc. All code uses native ES Modules (`"type": "module"`).

---

## Commands

### Development

```bash
npm start          # Start Vite dev server (auto-opens browser)
npm run build      # Production build → dist/test-data-generator/
npm run preview    # Preview the production build locally
npm run clean      # Remove dist/, playwright-report/, test-results/
```

### Code Quality

```bash
npm run format     # Prettier --write all .css/.html/.js/.json/.md/.yaml files
npm run lint       # oxlint --fix --deny-warnings (treats warnings as errors)
```

### Unit Tests (Vitest)

```bash
npm run test                                    # Run all unit tests once
npx vitest run src/generators/uuid.test.js      # Run a single test file
npx vitest run -t "test name substring"         # Run tests matching a name pattern
npx vitest                                      # Watch mode (for development)
```

### E2E Tests (Playwright)

```bash
npm run e2e                                     # Run all E2E tests (all browsers)
npx playwright test e2e/iban.spec.js            # Run a single spec file
npx playwright test --grep "test title"         # Run tests matching a title
npm run e2e-ui                                  # Open Playwright interactive UI
npm run e2e-update-snapshots                    # Regenerate visual snapshots
```

### Full Quality Gate

```bash
npm run all-checks  # clean → format → lint → build → test → e2e
```

---

## Architecture & File Layout

```
src/
  generators/    # Pure functions: no DOM, no side effects; co-located *.test.js
  misc/          # Shared utilities and constants; co-located *.test.js
  ui/            # DOM manipulation; one *Ui.js file per generator type
  main.js        # Entry point — wires setupUI() and initTheme() only
e2e/
  helpers/       # Playwright Page Object Model and shared helpers
  *.spec.js      # One spec file per generator type + accessibility + visual
```

**Dependency direction is strict:** `misc` ← `generators` ← `ui`. Generator modules have zero knowledge of the DOM; the UI layer never leaks into generators.

---

## Code Style

### Language & Modules

- Plain JavaScript (`.js`), no TypeScript, no `tsconfig.json`.
- Native ESM throughout — `import`/`export` only; never `require()` or `module.exports`.
- All imports must include explicit `.js` file extensions (e.g., `import { foo } from "./foo.js"`).
- No barrel `index.js` files.

### Formatting (Prettier)

- `printWidth: 120`; all other Prettier defaults apply (2-space indent, double quotes, semicolons, trailing commas).
- Run `npm run format` before committing, or rely on the Husky pre-commit hook which runs Prettier automatically.

### Imports

- Import statements must be **alphabetically sorted** — enforced by the `sort-imports: error` oxlint rule.
- Group imports by source if it aids readability, but each group must itself be sorted.

### Naming Conventions

| Style                  | Used for                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `SCREAMING_SNAKE_CASE` | All module-level constants: `ALL_DIGITS`, `COUNTRY_FUNCTIONS_MAP`, `TEST_ID_BUTTON_GENERATE` |
| `camelCase`            | All functions (exported and private), local variables                                        |
| `PascalCase`           | Classes only: `Country`, `GermanStNrSpec`, `TestDataGenPage`                                 |
| `#camelCase`           | Private class fields: `#page`                                                                |
| `kebab-case`           | HTML `id` attributes and string-literal type discriminators                                  |

### Types (JSDoc)

All exported functions **must** have JSDoc with `@param` and `@returns` (enforced by oxlint `jsdoc/require-param` and `jsdoc/require-returns`). Use `@throws` when the function can throw.

```js
/**
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code
 * @returns {string} A randomly generated IBAN
 * @throws {Error} If the country code is not supported
 */
export function generateIBAN(countryCode) { ... }
```

Use `@typedef` for complex inline types, `@template T` for generics, and `@type` for annotating variables when inference is insufficient. Add `/* global document, Blob, URL */` at the top of browser-environment files to declare implicit browser globals.

### Constants as Type Identifiers

Discriminator strings (e.g., generator type keys) must be **exported named constants**, never bare string literals at the call site. This keeps the code refactorable without TypeScript:

```js
// Good
export const TAX_ID_GERMANY_ST_NR = "tax-id-germany-st-nr";

// Bad — bare string literal used in multiple places
generateTaxId("tax-id-germany-st-nr");
```

### Map-Based Dispatch

Prefer `Map` objects for dispatch over `if/else` chains or `switch` statements. This makes adding new generator types a single-line change:

```js
const TYPE_FUNCTION_MAP = new Map([
  [TAX_ID_GERMANY_ST_NR, germanyStNr],
  [TAX_ID_GERMANY_STEUER_ID, germanySteuerId],
]);
```

### Error Handling

- **Generator layer:** Validate inputs early and `throw new Error(...)` with a descriptive message that includes the invalid value. Use recursive retry (not an exception) for edge cases where a generated value happens to be invalid:
  ```js
  if (checkDigit === 10) return dutchIBAN(); // regenerate
  ```
- **UI layer:** Wrap generator calls in `try/catch` and display errors as strings to the user — never rethrow from UI handlers.
- **Promises:** All promises must be resolved with `.then()/.catch()` or `await` inside `try/catch` — enforced by `promise/catch-or-return: error`.

### Other Rules

- `const`/`let` only — `var` is forbidden (`no-var: error`).
- Strict equality (`===`) required — `==` is forbidden (`eqeqeq: error`).
- All `if`/`for`/`while` bodies must use curly braces (`curly: error`).
- `console.*` is forbidden (`no-console: error`) — remove all debug logging before committing.
- Avoid accumulating spreads in loops (`oxc/no-accumulating-spread: error`) — build arrays with `push()` then spread once at the end if needed.

---

## Testing Conventions

### Unit Tests (Vitest)

- Test files live **co-located** with their source file: `src/generators/iban.test.js` tests `src/generators/iban.js`.
- Because generators are random, each assertion is run **100 times** using Vitest's `{ repeats: N }` option. The repeat count is the constant `RANDOM_FUNCTION_TEST_CALL_COUNT` from `src/misc/testgenConstants.js` — always import and use this constant rather than hard-coding a number.
  ```js
  it("should produce IBANs of the correct length", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    expect(generateIBAN("DE")).toHaveLength(22);
  });
  ```
- Use Vitest-idiomatic matchers — oxlint enforces `vitest/prefer-to-be-truthy` and similar rules.

### E2E Tests (Playwright)

- All Playwright interactions go through the **Page Object Model** class `TestDataGenPage` in `e2e/helpers/testDataGenPage.js`. Do not use raw Playwright selectors directly in spec files.
- Test IDs (`data-testid` attributes) are exported constants from the UI module that owns the element. Import them from source rather than repeating string literals.
- The E2E suite runs across **five browser configurations** (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari) — do not write tests that assume a specific browser.
- Visual regression snapshots live in `e2e/__screenshots__/`. Regenerate them with `npm run e2e-update-snapshots` when intentional UI changes are made.

---

## Linting Suppressions

When an oxlint rule must be locally suppressed (rare), use a targeted inline comment on the specific line:

```js
// oxlint-disable-next-line no-await-in-loop
await button.click();
```

Never suppress entire files or use block-level disables unless absolutely necessary. Document the reason in a comment on the same line.

---

## CI/CD Notes

- The GitHub Actions pipeline runs `static-analysis`, `build`, and `test` in parallel; `e2e` depends on all three.
- Deployment to GitHub Pages and Cloudflare Pages only occurs from `main` after E2E passes.
- In CI, oxlint is invoked with `--deny-warnings --format=github` (warnings become errors, GitHub annotation format).
- Node version used in CI: **24**.
