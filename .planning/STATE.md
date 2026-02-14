# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-14)

**Core value:** 기본 계산을 빠르고 정확하게 할 수 있어야 한다
**Current focus:** Phase 5 - Polish and Deploy

## Current Position

Phase: 6 of 6 (Automated Testing)
Plan: 5 of 5 complete
Status: Phase complete
Last activity: 2026-02-14 — Completed 06-05-PLAN.md (CI/CD Automation)

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**
- Total plans completed: 11
- Average duration: 2.3 min
- Total execution time: 0.43 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 | 1 | 2min | 2min |
| 2 | 3 | 3min | 1min |
| 3 | 1 | 10min | 10min |
| 4 | 2 | 3min | 1.5min |
| 6 | 4 | 10min | 2.5min |

**Recent Trend:**
- Last 5 plans: 06-01 (4min), 06-02 (3min), 06-04 (2min), 06-05 (1min)
- Trend: Testing phase complete at 2.5min/plan average; CI setup fastest (1min)

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Vanilla JS with no frameworks (rationale: build-free deployment)
- GitHub Pages deployment (rationale: simplest free hosting)
- State object pattern for calculator (rationale: prevents operation chaining bugs)
- toFixed(10) + parseFloat() for floating-point precision (rationale: fixes 0.1 + 0.2 = 0.3)
- Division by zero returns 'Error' string (rationale: Infinity confuses users)
- Contextual percent calculation (rationale: matches iOS calculator behavior)
- Use CSS Grid with grid-template-columns: repeat(4, 1fr) for button layout (rationale: standard 2D layout approach)
- Zero button spans 2 columns with left-aligned text (rationale: matches iOS calculator style)
- Mobile base: 60px button height, tablet+: 80px height (rationale: exceeds touch target minimums)
- Wrap :hover in @media (hover: hover) (rationale: prevents sticky hover on touch devices)
- Use semantic <button> elements for accessibility (rationale: keyboard focus, screen readers)
- Backspace on Error state resets to '0' instead of creating 'Erro' string (rationale: prevents invalid state)
- Backspace after operator (waitingForSecondOperand=true) resets to '0' and clears flag (rationale: prevents editing first operand)
- Single digit backspace resets to '0' instead of empty string (rationale: prevents parseFloat(NaN) errors)
- Event delegation via single listener on .calculator-buttons container (rationale: better performance than 19 individual listeners)
- closest('button') guard clause handles event bubbling (rationale: more robust than event.target === button)
- Always call updateDisplay() after state changes (rationale: keeps UI synchronized with calculator state)
- Use event.key property (not deprecated keyCode) for modern keyboard event handling (rationale: modern standard, better compatibility)
- Map keyboard symbols to calculator display symbols (asterisk → ×, slash → ÷) (rationale: consistent visual representation)
- Prevent default browser behavior only for handled keys (rationale: coexist with browser keyboard shortcuts)
- Document-level keydown listener for global keyboard capture (rationale: works regardless of focus state)
- Reuse existing calculator functions in keyboard handler (rationale: DRY principle, single source of truth)
- Use calc_history_v1 as localStorage key (rationale: enables future schema migrations)
- MAX_HISTORY_ENTRIES = 50 (rationale: balances usability and quota prevention)
- Trim to half capacity on quota exceeded (rationale: graceful degradation instead of complete failure)
- Cache history in memory (rationale: avoid repeated localStorage reads)
- Log storage warnings without throwing (rationale: graceful degradation for private browsing)
- Only track binary operations (+, -, ×, ÷) when = is pressed (rationale: unary ops are transformations, not calculations)
- Exclude error results from history (rationale: division by zero is not a valid calculation result)
- Wrap calculator in .calculator-container for flex layout (rationale: enables responsive side-by-side on desktop)
- Add history.js script between calculator.js and main.js (rationale: dependency order)
- Use event delegation for clear-history button (rationale: consistent with existing button handling pattern)
- Defensive typeof checks before calling history functions (rationale: graceful degradation if history.js fails to load)
- Use Vitest v4 with Playwright browser provider for real browser API testing (rationale: tests localStorage and DOM without mocks)
- Convert to ES modules with main.js as entry point (rationale: enables test imports while maintaining browser compatibility)
- Use playwright() factory function for browser.provider (rationale: Vitest v4 API requires factory instead of string)
- Add browser.instances configuration (rationale: Vitest v4 requirement for browser project resolution)
- Use @vitest-environment browser directive for real localStorage API access (rationale: enables testing browser APIs without mocks)
- Create DOM #history-list element in beforeEach to prevent console warnings (rationale: renderHistory() expects this element)
- Verify FIFO eviction by checking oldest entries removed when exceeding 50 limit (rationale: validates max entries enforcement)
- Mock history.js dependency with vi.mock() before importing calculator (rationale: isolates unit tests from external dependencies)
- Test through public API (calculator.displayValue) not internal state (rationale: more robust testing that reflects actual usage)
- Use beforeEach() for resetCalculator() call (rationale: ensures clean state for each test, prevents state leakage)
- Create minimal DOM structure programmatically in beforeEach (rationale: faster than loading full index.html, sufficient for testing)
- Test event delegation by mocking event.target and closest() (rationale: verifies real-world event bubbling behavior)
- Test both button clicks and keyboard events for same operations (rationale: complete coverage of user interaction paths)
- Use npm ci instead of npm install in CI for reproducible builds (rationale: npm ci installs from package-lock.json exactly, fails on mismatch, faster in CI)
- Install only chromium browser in CI (rationale: tests only need one browser engine; installing all Playwright browsers adds minutes to CI time)
- Upload coverage as artifact in GitHub Actions (rationale: makes reports accessible from UI, enables future coverage service integration)

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-02-14
Stopped at: Completed 06-05-PLAN.md (CI/CD Automation)
Resume file: None

Note: Phases 1-4 and Phase 6 complete. Phase 5 (Polish and Deploy) ready to start.
