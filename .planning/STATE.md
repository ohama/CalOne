# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-14)

**Core value:** 기본 계산을 빠르고 정확하게 할 수 있어야 한다
**Current focus:** Phase 4 - Calculation History

## Current Position

Phase: 4 of 5 (Calculation History)
Plan: 2 of 2
Status: Phase complete
Last activity: 2026-02-14 — Completed 04-02-PLAN.md

Progress: [████████░░] 80%

## Performance Metrics

**Velocity:**
- Total plans completed: 7
- Average duration: 2.4 min
- Total execution time: 0.28 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 | 1 | 2min | 2min |
| 2 | 3 | 3min | 1min |
| 3 | 1 | 10min | 10min |
| 4 | 2 | 3min | 1.5min |

**Recent Trend:**
- Last 5 plans: 02-03 (1min), 03-01 (10min), 04-01 (1min), 04-02 (2min)
- Trend: Most plans execute quickly; human verification checkpoints add time

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

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-02-14 (phase 4 execution - plan 02)
Stopped at: Completed 04-02-PLAN.md
Resume file: None

Note: Phases 1-4 complete. Ready for Phase 5 (Deployment).
