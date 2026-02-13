# Project Research Summary

**Project:** Calculator Web Application
**Domain:** Static Web Application (Educational/Utility)
**Researched:** 2026-02-14
**Confidence:** HIGH

## Executive Summary

This is a minimal calculator web app that should be built with pure HTML5, CSS3, and vanilla JavaScript - no frameworks, no build tools, no dependencies. Modern research (2025+) overwhelmingly recommends the "back to basics" approach for static utilities like calculators: native browser APIs are mature enough to handle all requirements (CSS Grid for layout, localStorage for persistence, ES6+ for logic), and the vanilla stack eliminates complexity while maximizing performance.

The recommended architecture follows classic MVC separation with a state machine pattern for input handling, event delegation for efficient button management, and careful floating-point precision handling from day one. The critical insight from research is that calculator apps look deceptively simple but have well-documented pitfalls (operation chaining bugs, floating-point errors, keyboard support gaps) that must be addressed in the core implementation - retrofitting fixes is expensive and error-prone.

Key risks center on three areas: (1) floating-point precision errors that destroy user trust if not handled correctly from the start, (2) broken state machine logic causing operation chaining failures, and (3) incomplete accessibility/keyboard support. All three are preventable with proper architectural foundations established in Phase 1, validated through comprehensive edge-case testing, and refined through real user feedback.

## Key Findings

### Recommended Stack

Modern vanilla JavaScript (ES6+) with no external dependencies is the clear winner for calculator apps in 2025. Native browser APIs have matured to the point where frameworks add complexity without benefits for static utilities.

**Core technologies:**
- **HTML5 (Living Standard)**: Semantic elements for accessibility and SEO - Use `<button>`, `<main>`, `<section>` for screen reader compatibility
- **CSS3 Native (Living Standard)**: Modern features eliminate need for preprocessors - Grid for layout, Custom Properties for theming, native nesting now supported
- **Vanilla JavaScript (ES2015+)**: Full ES6+ support in modern browsers - modules, arrow functions, template literals work without transpilation
- **GitHub Pages**: Free static hosting with automatic HTTPS and continuous deployment from Git push - perfect for no-build-step projects

**Supporting capabilities:**
- localStorage for history persistence (5MB limit, more than sufficient)
- CSS Grid for button layout (designed for 2D grids like calculator keypads)
- Event delegation for efficient button handling (single listener vs 20+)
- JSON serialization for data persistence

**Critical version note:** No version conflicts exist - all technologies are browser-native standards. Minimum browser support: Chrome/Edge 90+, Firefox 88+, Safari 14+ (all 2021+).

### Expected Features

Research reveals clear tiers of features based on user expectations and competitive analysis.

**Must have (table stakes):**
- Basic arithmetic operators (+, -, ×, ÷) - core calculator functionality
- Number input (0-9, decimal point) - essential for all calculations
- Clear/AC button - reset between calculations
- Equals button - complete calculation and display result
- Display screen - show current input and results
- Keyboard support - power users expect number keys and operators to work
- Responsive design - works on mobile and desktop
- Percent function (%) - expected in all modern calculators
- Sign toggle (+/-) - handle negative numbers

**Should have (competitive differentiators):**
- Calculation history - allows users to review and reuse past calculations
- Copy/paste result - enables workflow integration with other apps
- Dark mode/themes - reduces eye strain, modern aesthetic expectation
- Minimal/clean design - creates calm, distraction-free experience
- Delete/backspace - correct typos without full clear

**Defer (v2+):**
- Memory functions (M+, M-, MR, MC) - conflicts with minimal design goal
- Export history - wait to see if users need record-keeping
- Haptic feedback - mobile enhancement, low priority
- Scientific functions - out of scope for basic calculator

**Anti-features (explicitly avoid):**
- Scientific functions in basic mode - clutters interface
- Ads or pop-ups - destroys utility UX
- Auto-execute on operator press - unexpected behavior
- Implied multiplication handling - causes confusion with order of operations

### Architecture Approach

Standard MVC (Model-View-Controller) pattern with state machine for input handling. Calculator state (display value, operands, operator, flags) lives in pure JavaScript objects, completely separate from DOM. Display is a pure function of state - always render from state, never read DOM to determine state.

**Major components:**
1. **Calculator Engine (Model)** - Pure calculation logic, state management, arithmetic operations with precision handling
2. **Display Component (View)** - Updates DOM based on state changes, handles overflow with scientific notation
3. **Controller** - Coordinates UI events to model methods, routes button clicks and keyboard input
4. **History Manager** - Manages calculation history array, localStorage persistence wrapper
5. **Keyboard Handler** - Maps keyboard events to calculator actions, reuses same controller methods as buttons

**Key patterns identified:**
- **Event delegation**: Single listener on button panel vs individual listeners per button
- **State machine**: Explicit state tracking (waitingForSecondOperand, previousKeyType) prevents edge case bugs
- **localStorage wrapper**: Abstraction layer handles JSON serialization and error handling
- **Object state pattern**: Plain JavaScript object for simple state (no need for classes)

**File structure:**
```
cal/
├── index.html              # Single page entry point
├── css/
│   └── styles.css          # All styling
├── js/
│   ├── main.js             # Controller and initialization
│   ├── calculator.js       # Calculation engine and state
│   ├── display.js          # Display component logic
│   ├── history.js          # History management
│   └── keyboard.js         # Keyboard event handling
```

### Critical Pitfalls

Research identified seven critical pitfalls that must be addressed in core architecture, not patched later.

1. **Floating-point precision errors** - JavaScript's IEEE 754 format causes 0.1 + 0.2 = 0.30000000000000004. Must round results with toFixed() for display, use epsilon-based equality checks, consider libraries like decimal.js for high-precision needs. Address in Phase 1 (retrofitting is complex).

2. **Broken operation chaining** - Consecutive operations fail (99 - 1 = 98, 98 - 1 = 0 instead of 97). Requires meticulous state tracking (currentValue, previousValue, operator, previousKeyType). Test comprehensive sequences like "5 + 3 - 2 × 4 ÷ 2". Address in Phase 1 (state machine must be correct from start).

3. **Incomplete keyboard support** - Keyboard stops working randomly, doesn't filter invalid keys, or lacks focus indicators. Must implement from day one using event.key mapping, proper focus management, visual focus indicators. Critical for accessibility compliance. Address in Phase 2.

4. **Equals button repetition missing** - Standard calculators expect "1 + 1 = = =" to produce 2, 3, 4 (repeating last operation). Store last operation (operator + secondValue) and repeat on consecutive equals presses. Address in Phase 1.

5. **Input validation failures** - Accept multiple decimal points ("5..3"), letters in numbers, empty inputs. Validate each input before accepting (one decimal per number, no leading zeros except "0.", reject non-numeric characters). Address in Phase 1.

6. **Display overflow unhandled** - Calculator breaks when numbers exceed display width. Set maximum input length (10-15 digits), switch to scientific notation for very large/small numbers, use CSS overflow handling. Address in Phase 1.

7. **Clear button confusion** - Users don't understand AC vs C vs CE behavior. Implement AC (All Clear) that resets everything, add CE (Clear Entry) or backspace to delete last digit. Label clearly. Address in Phase 1 for AC, Phase 2 for CE refinement.

## Implications for Roadmap

Based on research, calculator development follows a clear dependency graph with three parallel tracks after core logic is established.

### Phase 1: Core Calculator Engine

**Rationale:** Pure JavaScript calculation logic forms the foundation. Must be rock-solid before building UI - state machine architecture, floating-point handling, input validation cannot be retrofitted cheaply. This phase is testable without browser (unit tests for calculation logic).

**Delivers:**
- Calculator class with state management (currentValue, previousValue, operator, waitingForSecondOperand)
- Basic arithmetic operations (+, -, ×, ÷) with explicit switch/case logic (never eval())
- Decimal point handling with validation (prevent multiple decimals)
- Division by zero error handling
- Floating-point precision rounding (Math.round to 10 decimal places)
- Input validation layer (sanitize before calculation)

**Addresses features:**
- Basic arithmetic operators (table stakes)
- Percent function (table stakes)
- Sign toggle (+/-) (table stakes)
- Clear/AC button (table stakes)

**Avoids pitfalls:**
- Floating-point precision errors (Critical #1)
- Broken operation chaining (Critical #2)
- Equals repetition logic missing (Critical #4)
- Input validation failures (Critical #5)
- Display overflow (Critical #6)
- Division by zero unhandled

**Testing focus:** 0.1+0.2 precision, multi-step operations (5+3-2×4÷2), edge cases (division by zero, multiple decimals, 15+ digit numbers).

### Phase 2: Display and Button Interface

**Rationale:** Depends on Phase 1 calculation engine being complete. Simplest UI component - connects calculator state to DOM rendering. Button interface with event delegation enables user input via clicks.

**Delivers:**
- Display component that updates DOM from state (unidirectional data flow)
- Button HTML structure with CSS Grid layout
- Event delegation for button panel (single listener, data attributes for identification)
- Wire buttons to calculator methods
- Responsive design (mobile and desktop)
- Visual button feedback (active states, hover effects)

**Uses stack:**
- CSS Grid for button layout (4-column by 5-row standard calculator grid)
- CSS Custom Properties for theming foundation
- Event delegation pattern for efficiency

**Implements architecture:**
- Display Component (View)
- Controller (event routing)
- MVC separation (state in model, rendering in view)

**Addresses features:**
- Display screen (table stakes)
- Number input (table stakes)
- Equals button (table stakes)
- Responsive design (table stakes)

**Avoids pitfalls:**
- Mixing state management with display logic (Anti-pattern #2)
- Separate event listeners for each button (Anti-pattern #3)

### Phase 3: Keyboard Support

**Rationale:** Parallel input method after button interface exists. Reuses existing calculator methods (no new calculation logic). Critical for accessibility and power users. Can be developed in parallel with Phase 4 (History).

**Delivers:**
- Keyboard event listener on document
- Key-to-action mapping (0-9 numbers, +/-/* / operators, Enter for equals, Escape for clear, Backspace for delete)
- Focus management for calculator
- Visual focus indicators (:focus-visible styling)
- Invalid key rejection with input validation

**Addresses features:**
- Keyboard support (table stakes)
- Delete/backspace (competitive differentiator)

**Avoids pitfalls:**
- Incomplete keyboard support (Critical #3)
- Focus management broken (Accessibility)
- No visible focus indicators (Accessibility)

**Testing focus:** Keyboard-only navigation (Tab, Shift+Tab, Enter), all operations work without mouse, focus indicators visible.

### Phase 4: Calculation History

**Rationale:** Independent feature that can be developed in parallel with Phase 3. Depends only on Phase 1 (calculation engine) - history entries created on each calculation. Uses localStorage for persistence.

**Delivers:**
- History data structure (array of {expression, result, timestamp} objects)
- localStorage wrapper with error handling (JSON serialization, quota exceeded handling)
- History panel HTML/CSS rendering
- Add entry on calculation complete
- Clear history functionality
- Click history item to restore value (UX enhancement)

**Uses stack:**
- localStorage API for persistence (5MB limit sufficient)
- JSON.stringify/parse for serialization
- Event delegation for history item clicks

**Implements architecture:**
- History Manager component
- LocalStorage wrapper abstraction
- Separation of history data from display

**Addresses features:**
- Calculation history (competitive differentiator)
- Persistent state (competitive differentiator)
- Copy result to clipboard (competitive differentiator)

**Avoids pitfalls:**
- Storing history in DOM instead of state (Integration gotcha)
- Unbounded history array (Performance trap - implement max 100 entries)
- Synchronous localStorage writes blocking main thread (Performance trap - debounce saves)

### Phase 5: Polish and Theming

**Rationale:** Final phase after all core functionality complete. Applies visual polish, dark mode, animations without affecting core logic. Can validate basic calculator works before investing in aesthetics.

**Delivers:**
- Dark mode implementation (CSS class toggle, system preference detection)
- Clean/minimal design refinement
- Transitions and animations for button presses
- Touch target optimization for mobile (minimum 44×44px)
- Contrast ratio validation (WCAG AA 4.5:1 minimum)

**Uses stack:**
- CSS Custom Properties for theme variables
- prefers-color-scheme media query for system detection
- CSS transitions for smooth state changes

**Addresses features:**
- Dark mode/themes (competitive differentiator)
- Minimal/clean aesthetic (competitive differentiator)

**Avoids pitfalls:**
- Poor contrast in dark mode (UX pitfall)
- Tiny touch targets on mobile (UX pitfall)
- No visual feedback on button press (UX pitfall)

### Phase 6: Accessibility Audit

**Rationale:** After UI is complete, comprehensive accessibility testing ensures WCAG compliance. Addresses screen reader support, ARIA labels, semantic HTML validation.

**Delivers:**
- ARIA labels on symbol buttons (aria-label="multiply" on × button)
- aria-live="polite" region for display (announces results to screen readers)
- Semantic HTML validation (verify `<button>` elements, not `<div onclick="">`)
- Screen reader testing with NVDA/VoiceOver
- Keyboard navigation verification
- Color contrast validation

**Addresses features:**
- Screen reader support (accessibility requirement)
- Keyboard navigation (table stakes, validated here)

**Avoids pitfalls:**
- Buttons lack semantic HTML (Accessibility pitfall)
- No ARIA labels on symbol buttons (Accessibility pitfall)
- Display not announced to screen readers (Accessibility pitfall)

### Phase Ordering Rationale

**Critical path:** 1 → 2 → (3 or 4 parallel) → 5 → 6

**Why this order:**
- Phase 1 first: Pure calculation logic is foundational, testable without browser, prevents expensive architectural changes later
- Phase 2 second: Display and buttons are simplest UI components, prove calculator works end-to-end
- Phases 3 and 4 parallel: Keyboard and History are independent features, both depend only on Phase 1, can be developed simultaneously
- Phase 5 deferred: Polish doesn't affect functionality, can validate core calculator works before investing in aesthetics
- Phase 6 last: Accessibility audit after UI complete ensures nothing is missed, easier to fix with stable codebase

**Dependency insights from architecture research:**
- Calculation engine (Phase 1) has zero dependencies - build first
- Display (Phase 2) depends on engine state existing
- Keyboard (Phase 3) reuses button event handlers - no new calculation logic
- History (Phase 4) listens to calculation completion - independent of UI
- Polish (Phase 5) is pure CSS/theming - no logic changes
- Accessibility (Phase 6) validates all previous phases

**How this avoids pitfalls:**
- Floating-point precision, state machine design, input validation addressed in Phase 1 before UI complexity
- Keyboard support in Phase 3 (not afterthought) ensures accessibility foundation
- History in Phase 4 with localStorage abstraction prevents data management issues
- Accessibility audit in Phase 6 catches gaps before production

### Research Flags

Phases with standard patterns (skip /gsd:research-phase):
- **Phase 1 (Core Calculator):** Well-documented calculation patterns, established state machine approaches, extensive tutorials available
- **Phase 2 (Display/Buttons):** Standard DOM manipulation, CSS Grid layouts heavily documented
- **Phase 3 (Keyboard):** Keyboard event handling well-established, standard key mappings documented
- **Phase 4 (History):** localStorage patterns well-documented, simple data structure
- **Phase 5 (Polish):** CSS theming and dark mode implementation standard patterns
- **Phase 6 (Accessibility):** WCAG guidelines and testing tools well-established

**No phases require deeper research** - calculator domain is mature with extensive documentation, established patterns, and clear best practices. All research needs satisfied by project-level research (STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md).

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Vanilla JavaScript stack is industry consensus for static calculators in 2025. Multiple authoritative sources (MDN, Frontend Masters, Medium tech writers) converge on no-framework approach. GitHub Pages deployment well-documented. |
| Features | HIGH | Feature tiers validated across multiple calculator apps (Windows Calculator, Google Calculator, iPhone Calculator). Table stakes vs differentiators confirmed by UX research (Nielsen Norman Group, calculator design case studies). MVP scope clear. |
| Architecture | HIGH | MVC pattern, state machine, event delegation are established best practices for calculator apps. Multiple reference implementations available (GitHub repos, tutorials). Pitfall documentation extensive. |
| Pitfalls | HIGH | Floating-point precision, operation chaining, keyboard support failures documented across 10+ sources. Edge cases well-understood (division by zero, decimal handling, display overflow). Recovery strategies validated. |

**Overall confidence:** HIGH

Research quality is exceptional - all four areas have authoritative sources (official docs, established tutorials, competitive analysis), converging recommendations, and validated patterns from production calculators. No conflicting guidance found.

### Gaps to Address

**No critical gaps identified.** Research covered all necessary areas for calculator implementation:

- Stack selection: Vanilla JavaScript consensus clear, no framework ambiguity
- Feature scope: Table stakes vs differentiators well-defined from competitive analysis
- Architecture: Standard patterns (MVC, state machine, event delegation) documented
- Pitfalls: Comprehensive coverage of edge cases and anti-patterns

**Minor validation items during implementation:**

- **Floating-point precision threshold:** Research recommends Math.round to 10 decimal places, but test with real calculations to verify if 10 vs 12 decimal precision affects results. Adjust if needed based on testing.

- **History array size limit:** Research flags unbounded history as performance trap but doesn't specify exact threshold. Implement max 100 entries initially, monitor localStorage size, adjust if needed.

- **Touch target size verification:** Research cites 44×44px minimum per iOS/Android guidelines. Measure actual button sizes in Phase 5 with browser dev tools to confirm compliance.

- **Screen reader testing specificity:** Research identifies ARIA labels needed but doesn't detail exact screen reader behavior. Test with NVDA (Windows) and VoiceOver (Mac) in Phase 6 to verify announcements make sense.

**How to handle during planning/execution:**
- All items above are validation tasks, not research gaps
- Defer to actual implementation and testing rather than upfront research
- Phase-specific testing will reveal if adjustments needed
- No additional /gsd:research-phase calls required

## Sources

All sources aggregated from individual research files. Confidence tiers based on authoritativeness and verification.

### Primary (HIGH confidence)

**Official Documentation:**
- MDN Web Docs (JavaScript modules, Web Storage API, CSS Grid, HTML5 semantic elements, ARIA) - Authoritative browser API documentation
- GitHub Pages Official Docs - Authoritative deployment guide
- W3C (HTML Validator, Keyboard Interface, ARIA practices) - Web standards authority
- WCAG Guidelines - Accessibility compliance standards

**Modern Stack (2025+):**
- Frontend Masters: "What You Need to Know about Modern CSS (2025 Edition)" - Authoritative CSS guide
- CSS in 2026: New Features (LogRocket) - Feature overview from established tech publisher
- Vanilla JavaScript trends (Medium tech writers) - Industry consensus analysis

**Calculator Implementation:**
- freeCodeCamp: "How to build an HTML calculator app from scratch" - Comprehensive tutorial, well-vetted
- Freshman.tech Calculator Tutorial - Step-by-step guide with pitfall coverage
- WebDevSimplified Vanilla JavaScript Calculator (GitHub) - Reference implementation

**Architecture Patterns:**
- freeCodeCamp MVC Pattern Guide - Educational resource with clear examples
- State management guides (Medium) - Industry best practices

### Secondary (MEDIUM confidence)

**Design & UX:**
- Nielsen Norman Group: "12 Design Recommendations for Calculator Tools" - UX research firm
- Muzli Calculator Design Patterns (60+ examples) - Design inspiration aggregator
- UXPin Calculator Prototyping Guide - Design tool vendor perspective

**Feature Analysis:**
- Windows Calculator, Google Calculator, iPhone Calculator documentation - Competitive feature analysis
- Calculator app reviews (Google Play, App Store) - User expectation validation

**Pitfalls & Edge Cases:**
- Floating-point precision articles (Patrick Karsh, CODE Magazine, GeeksforGeeks) - Technical deep dives
- Calculator testing guides (Botgauge: 15+ Test Cases) - QA perspective
- WebAIM Keyboard Accessibility - Accessibility best practices

### Tertiary (LOW confidence)

**Community Discussions:**
- GitHub calculator repositories (reference implementations) - Useful patterns but varying quality
- Medium blog posts (individual developer perspectives) - Anecdotal but informative
- TechIssues calculator bugs (iOS 18 Calculator) - Edge case documentation

**When to reference:**
- Primary sources for architecture decisions and implementation patterns
- Secondary sources for feature prioritization and UX validation
- Tertiary sources for edge case awareness and alternative approaches

---
*Research completed: 2026-02-14*
*Ready for roadmap: yes*
