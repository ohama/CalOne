---
phase: 06-automated-testing
plan: 01
subsystem: testing
tags: [vitest, playwright, browser-testing, es-modules, npm]

# Dependency graph
requires:
  - phase: 04-history-persistence
    provides: Completed vanilla JS calculator with history
provides:
  - npm package.json with Vitest v4 testing infrastructure
  - ES module exports for all source files (calculator, history, main)
  - Vitest browser mode configuration with Playwright provider
  - Test infrastructure ready for test writing
affects: [06-02, 06-03, automated-testing, ci-cd]

# Tech tracking
tech-stack:
  added: [vitest@4.0.18, @vitest/browser-playwright@4.0.18, playwright@1.58.2, @vitest/coverage-v8@4.0.18]
  patterns: [ES module exports, npm test infrastructure, browser mode testing]

key-files:
  created: [package.json, vitest.config.js, .gitignore]
  modified: [js/calculator.js, js/history.js, js/main.js, index.html]

key-decisions:
  - "Use Vitest v4 with Playwright browser provider for real browser API testing"
  - "Convert to ES modules with main.js as entry point importing calculator.js and history.js"
  - "Use playwright() factory function instead of string for Vitest v4 browser.provider"
  - "Add browser.instances configuration for Vitest v4 compatibility"

patterns-established:
  - "ES module dependency tree: main.js -> calculator.js -> history.js"
  - "Export all functions and constants for test imports"
  - "Single script tag type=module in index.html loading main.js entry point"

# Metrics
duration: 4min
completed: 2026-02-14
---

# Phase 06 Plan 01: Test Infrastructure Setup Summary

**Vitest v4 browser testing with Playwright, ES module exports, and npm scripts for vanilla JS calculator**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-14T01:58:25Z
- **Completed:** 2026-02-14T02:02:34Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments
- npm package.json with test scripts (test, test:watch, test:coverage) and Vitest v4 dependencies
- ES module exports added to all source files while maintaining browser compatibility
- Vitest browser mode configuration with Playwright provider and coverage reporting
- npm test executes successfully with 0 tests (infrastructure ready for test writing)

## Task Commits

Each task was committed atomically:

1. **Task 1: Initialize npm and install Vitest dependencies** - `e33a0de` (chore)
2. **Task 2: Create Vitest configuration with browser mode** - `64948ad` (chore)
3. **Task 3: Convert source files to ES modules with exports** - `5251e25` (refactor)

**Deviation fix:** `cf3fbcd` (fix: update Vitest v4 browser config to use provider factory)

## Files Created/Modified

### Created
- `package.json` - npm metadata with type: "module", test scripts, Vitest dependencies
- `vitest.config.js` - Browser mode with Playwright provider, v8 coverage, test file patterns
- `.gitignore` - Exclude node_modules, coverage, OS files

### Modified
- `js/calculator.js` - Added ES module exports (10 functions + state), import addToHistory from history.js
- `js/history.js` - Added ES module exports (7 functions + 2 constants)
- `js/main.js` - Added imports from calculator.js and history.js, added exports (3 functions)
- `index.html` - Changed to single `<script type="module" src="js/main.js">` entry point

## Decisions Made

**1. Vitest v4 provider factory pattern**
- Rationale: Vitest v4 changed browser.provider API from string to factory function
- Implementation: Import `playwright` from `@vitest/browser-playwright` and use `playwright()` factory
- Impact: Requires @vitest/browser-playwright package (not just @vitest/browser base utilities)

**2. ES module entry point pattern**
- Rationale: Modules are scoped, not global - need explicit dependency tree
- Implementation: main.js imports from calculator.js and history.js, index.html loads only main.js
- Impact: Removed defensive typeof checks since imports guarantee function availability

**3. browser.instances configuration**
- Rationale: Vitest v4 requires browser.instances array instead of browser.name string
- Implementation: `instances: [{ browser: 'chromium' }]`
- Impact: Required for Vitest v4 to resolve browser projects

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed Vitest v4 provider configuration API**
- **Found during:** Task verification (npm test failed with startup error)
- **Issue:** Research document had outdated Vitest v3 configuration pattern. Vitest v4 changed browser.provider from string to factory function and requires browser.instances
- **Fix:**
  - Installed @vitest/browser-playwright package
  - Imported playwright factory from @vitest/browser-playwright
  - Changed `provider: 'playwright'` to `provider: playwright()`
  - Added `instances: [{ browser: 'chromium' }]` configuration
- **Files modified:** vitest.config.js, package.json, package-lock.json
- **Verification:** npm test runs successfully, shows "No test files found" (expected)
- **Committed in:** cf3fbcd (separate fix commit after task 3)

---

**Total deviations:** 1 auto-fixed (blocking issue)
**Impact on plan:** Required fix for Vitest v4 compatibility. Research document had v3 configuration. No scope creep - just API update.

## Issues Encountered

**Vitest v4 API changes from research document**
- Research recommended `provider: 'playwright'` string pattern from earlier Vitest versions
- Vitest v4 requires importing provider factory and using `provider: playwright()`
- Vitest v4 requires `browser.instances` array instead of `browser.name` string
- Resolution: Updated to Vitest v4 API by consulting error messages and package READMEs

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for test writing:**
- npm test infrastructure works (exits with "No test files found" as expected)
- All source files export functions for test imports
- Browser mode configured for testing localStorage and DOM APIs
- Coverage reporting configured (v8 provider, html/text/lcov)

**Module dependency tree established:**
```
index.html (type=module)
  └─ main.js
      ├─ calculator.js
      │   └─ history.js (addToHistory)
      └─ history.js (clearHistory, renderHistory)
```

**Source files remain vanilla:**
- No build step required for deployment
- GitHub Pages can serve ES modules natively (2026 browser support)
- Tests use imports, but production HTML loads modules directly

**Next plan should:**
- Create tests/ directory
- Write unit tests for pure calculator functions
- Write browser-mode tests for localStorage (history.js)
- Write integration tests for DOM interactions (main.js)

**No blockers or concerns.**

---
*Phase: 06-automated-testing*
*Completed: 2026-02-14*
