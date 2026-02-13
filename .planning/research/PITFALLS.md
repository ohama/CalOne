# Pitfalls Research

**Domain:** Calculator Web App
**Researched:** 2026-02-14
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Floating-Point Precision Errors

**What goes wrong:**
JavaScript's IEEE 754 double-precision format causes rounding errors where 0.1 + 0.2 returns 0.30000000000000004 instead of 0.3. Users see incorrect results like "2 - √4 = -0.0000000001" instead of 0, destroying trust in the calculator.

**Why it happens:**
Certain decimal fractions cannot be represented precisely in binary form. Developers assume JavaScript's native number type will "just work" for arithmetic without understanding the underlying binary representation limitations.

**How to avoid:**
- Round displayed results using toFixed() for presentation
- For critical calculations, use integer-based arithmetic (multiply by 10^n, calculate, divide back)
- Consider libraries like decimal.js, big.js, or bignumber.js for high-precision needs
- Implement epsilon-based equality checks instead of direct comparison (e.g., Math.abs(a - b) < 0.0000001)

**Warning signs:**
- Test calculations like 0.1 + 0.2 show unexpected decimals
- Subtraction results in very small negative numbers instead of zero
- Users report "weird decimal errors" in feedback

**Phase to address:**
Phase 1 (Core Calculator Logic) - Must be addressed from the start as retrofitting precision handling is complex and error-prone.

---

### Pitfall 2: Broken Operation Chaining

**What goes wrong:**
Consecutive operations fail to calculate correctly. Example: "99 - 1 = 98, 98 - 1 = 0" (should be 97). Or pressing "5 * - + 5" produces -25 instead of 10. Users cannot perform multi-step calculations without calculator breaking.

**Why it happens:**
State management fails to track previousKeyType correctly, causing operator precedence errors or calculation logic to skip when it shouldn't. Developers test simple cases like "2 + 2" but miss complex operator sequences.

**How to avoid:**
- Track calculator state meticulously: currentValue, previousValue, operator, previousKeyType
- When operator is pressed, check if previousKeyType was also an operator and handle replacement logic
- Test comprehensive sequences: "5 + 3 - 2 × 4 ÷ 2"
- Implement state machine pattern to manage transitions between number entry, operator selection, and result display

**Warning signs:**
- Second calculation in a chain produces wrong value
- Multiple operator presses cause calculation when they shouldn't
- Switching operators mid-calculation breaks state

**Phase to address:**
Phase 1 (Core Calculator Logic) - The state machine architecture must be correct from the start to avoid expensive refactoring later.

---

### Pitfall 3: Incomplete Keyboard Support

**What goes wrong:**
Keyboard input stops working randomly, doesn't handle focus properly, or accepts invalid keys. Users who prefer keyboard navigation (including accessibility users) cannot use the calculator efficiently.

**Why it happens:**
Developers build with mouse clicks first, add keyboard as afterthought. Focus management is missed, event listeners don't filter invalid keys, or keyboard events aren't tested across different browsers.

**How to avoid:**
- Implement keyboard support from day one, not as enhancement
- Use event.key to map keyboard to calculator functions (Enter/= for equals, Backspace for delete, Escape for clear)
- Reject non-numeric values explicitly with input validation
- Ensure calculator has proper focus management when opened
- Test with keyboard-only navigation (Tab, Shift+Tab, Enter, number keys, operator keys)
- Add visual focus indicators for keyboard users

**Warning signs:**
- Calculator works with mouse but not keyboard
- Typing letters appears in display instead of being rejected
- Tab navigation skips buttons or gets stuck
- No visible focus indicator when tabbing through buttons

**Phase to address:**
Phase 2 (Keyboard Support) - Addressed as core feature, not optional enhancement. Critical for accessibility compliance.

---

### Pitfall 4: Equals Button Repetition Logic Missing

**What goes wrong:**
Pressing equals multiple times does nothing or produces unexpected results. Standard calculator UX expects "1 + 1 = = =" to produce 2, 3, 4 (repeating the last operation).

**Why it happens:**
Developers clear state after equals press, not preserving the last operation for repetition. This breaks expected calculator behavior that users rely on.

**How to avoid:**
- When equals is pressed, store the last operation (operator + secondValue)
- On subsequent equals presses with no new input, repeat the stored operation
- Track state to distinguish between "equals after new input" vs "equals repeated"
- Test sequences: "10 + 5 = = =" should produce 15, 20, 25

**Warning signs:**
- Equals pressed twice does nothing
- Calculator clears state instead of repeating operation
- Users complain calculator "doesn't work like other calculators"

**Phase to address:**
Phase 1 (Core Calculator Logic) - Part of core behavior expectations, inexpensive to add during initial implementation.

---

### Pitfall 5: Input Validation Failures

**What goes wrong:**
Calculator accepts negative time values, empty inputs, letters in numbers, or multiple decimal points without error messages. Produces nonsensical results like calculating with undefined values or allowing "5..3" as input.

**Why it happens:**
No input validation guards, assuming all inputs will be valid. Event handlers don't check what's already in the display before appending characters.

**How to avoid:**
- Validate each input before accepting:
  - Only one decimal point per number
  - No leading zeros (except "0.")
  - Reject non-numeric characters for number entry
  - Check for empty/undefined values before calculation
- Provide user-friendly error messages, not silent failures
- Implement input sanitization layer between UI and calculation logic

**Warning signs:**
- Display shows multiple decimal points: "3.14.159"
- Typing letters doesn't trigger error
- Calculation with empty values returns NaN or undefined
- No feedback when invalid input attempted

**Phase to address:**
Phase 1 (Core Calculator Logic) - Input validation must be foundational to prevent undefined behavior cascading through the system.

---

### Pitfall 6: No Display Overflow Handling

**What goes wrong:**
Calculator breaks or displays gibberish when numbers exceed display width. Result like "999999999999999999" overflows the display container or causes layout shift.

**Why it happens:**
Fixed-width display without overflow strategy. Developers test with small numbers like "2 + 2" and miss that 15+ digit results break the UI.

**How to avoid:**
- Set maximum input length (typically 10-15 digits)
- Switch to scientific notation for very large/small numbers (e.g., 1.23e+15)
- Use CSS text overflow handling (ellipsis or scale font size)
- Provide error message for overflow: "Number too large"
- Test with edge cases: 999999999999 × 999999999999

**Warning signs:**
- Long numbers overflow display visually
- Layout breaks with large results
- No limit on number of digits that can be entered
- Scientific notation not implemented

**Phase to address:**
Phase 1 (Core Calculator Logic) - Display constraints affect calculation logic design and should be established early.

---

### Pitfall 7: Clear Button Confusion (AC vs C vs CE)

**What goes wrong:**
Users don't understand what the clear button does. Expecting to clear last entry (CE) but the button clears everything (AC), or vice versa. Frustration when they lose entire calculation when trying to fix one typo.

**Why it happens:**
Implementing only one type of clear without considering user expectations. AC (All Clear), C (Clear), and CE (Clear Entry) have different behaviors that users expect from physical calculators.

**How to avoid:**
- For minimal calculator, implement AC (All Clear) that resets everything
- Add CE (Clear Entry) or backspace functionality to delete last digit/entry
- Provide visual feedback showing what was cleared
- Consider Escape for AC, Backspace for CE (single character delete)
- Label buttons clearly: "AC" or "Clear All" vs "CE" or "⌫"

**Warning signs:**
- Users complain about "having to start over for small mistakes"
- No way to delete last digit without clearing everything
- Button labeled "C" but behavior unclear

**Phase to address:**
Phase 1 (Core Calculator Logic) for AC, Phase 2 (Enhanced Features) for CE/backspace refinement.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using eval() for calculation | Quick implementation, parses "2+2" string directly | Security risk, hard to debug, can't control edge cases | Never - trivial to implement proper calculation logic |
| Global state variables | Easy access from anywhere | Race conditions, hard to test, breaks state machine | Never - proper state management is straightforward |
| Inline styles instead of CSS classes | Faster to write initially | Unmaintainable, no theming support, poor performance | Never - CSS setup takes minutes |
| Skipping input validation | Works with "happy path" testing | Breaks with real user input, security issues | Never - validation is critical from start |
| Mouse-only event handlers | Simpler than keyboard support | Inaccessible, poor UX, fails compliance | Never - keyboard support is table stakes |
| No error handling | Code looks cleaner | Silent failures, NaN propagation, user confusion | Never - basic try/catch and guards are essential |

## Integration Gotchas

Common mistakes when connecting calculator features.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Calculation History | Storing history in DOM instead of state | Maintain separate history array in state, render from state |
| Keyboard Events | Adding listeners to individual buttons | Single event listener on document/container, delegate by key |
| Display Updates | Directly manipulating innerHTML | Update state, render from state (unidirectional data flow) |
| Theme Switching | Inline style changes via JS | Toggle CSS class on root element, let CSS handle styling |
| LocalStorage Persistence | Saving after every keystroke | Debounced saves or save on calculation complete |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Re-rendering entire calculator on every update | Smooth initially, laggy with complex DOM | Update only changed elements, use efficient selectors | With animations/transitions |
| Unbounded history array | Works fine at start | Memory grows indefinitely, slows down | After ~1000 history entries |
| Synchronous localStorage writes | Imperceptible delay | Blocks main thread with large data | When history/state > 10KB |
| Multiple event listeners on buttons | No immediate issue | Memory leaks if buttons re-rendered | Single-page app context |

## UX Pitfalls

Common user experience mistakes in calculator apps.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No visual feedback on button press | User unsure if click registered | Active state styling, ripple effect, or brief highlight |
| Display truncates without indication | User sees "12345..." and doesn't know full number | Show scientific notation or provide scrollable display |
| No error messages | Calculation fails silently, user confused | Display "Error", "Cannot divide by zero", "Invalid input" |
| Instant clear with no undo | Accidental clear loses all work | Confirm clear for long calculations or add undo functionality |
| Poor contrast (especially dark mode) | Hard to read, eye strain | WCAG AA contrast ratios minimum (4.5:1 for text) |
| No loading state for history | History appears/disappears abruptly | Skeleton loaders or smooth transitions |
| Tiny touch targets on mobile | Mis-clicks, frustration | Minimum 44×44px touch targets per accessibility guidelines |

## Accessibility Pitfalls

Beyond keyboard support, critical accessibility failures.

| Pitfall | Impact | Prevention |
|---------|--------|------------|
| Buttons lack semantic HTML | Screen readers announce "clickable" not "button" | Use `<button>` elements, not `<div onclick="">` |
| No ARIA labels on symbol buttons | Screen reader says "times" instead of "multiply" | `aria-label="multiply"` on × button |
| Display not announced to screen readers | Users don't hear calculation results | Use `aria-live="polite"` region for display |
| No focus indicators | Keyboard users lose track of position | Visible focus rings (don't remove outline) |
| Poor color contrast | Low vision users can't read | Test with contrast checkers, follow WCAG |
| No alt text for icon buttons | Screen reader users don't know button purpose | Provide descriptive alt or aria-label |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Decimal handling:** Often missing validation preventing "3.14.159" — verify single decimal point enforcement
- [ ] **Division by zero:** Often missing error handling — verify "5 ÷ 0" shows error, not Infinity
- [ ] **Negative numbers:** Often missing sign toggle functionality — verify "+/-" button works mid-calculation
- [ ] **Percent calculation:** Often broken context (5 + 10% should be 5.5, not 0.1) — verify percent uses left operand
- [ ] **Keyboard support:** Often incomplete (works for numbers, fails for operators) — verify all buttons have keyboard equivalent
- [ ] **Operation chaining:** Often breaks on second operation — verify "2 + 3 - 1 =" works correctly
- [ ] **Display overflow:** Often no maximum length — verify 15+ digit numbers handled gracefully
- [ ] **History persistence:** Often lost on refresh — verify localStorage/sessionStorage used
- [ ] **Error states:** Often no recovery path — verify errors can be cleared to resume calculations
- [ ] **Mobile touch targets:** Often too small — verify 44×44px minimum per iOS/Android guidelines
- [ ] **Screen reader support:** Often completely missing — verify ARIA labels and live regions implemented
- [ ] **Focus management:** Often broken or absent — verify Tab/Shift+Tab cycles through buttons logically

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Floating-point errors in production | MEDIUM | Wrap calculation logic, add rounding layer, add tests for precision, deploy patch |
| Broken operation chaining | HIGH | Refactor state machine, rewrite calculation logic, extensive regression testing |
| Missing keyboard support | MEDIUM | Add event listeners, create key mapping, test with keyboard-only, update docs |
| No input validation | MEDIUM | Add validation layer before calculations, sanitize display updates, add error handling |
| Display overflow issues | LOW | Add CSS constraints, implement scientific notation, add max length checks |
| Accessibility failures | MEDIUM-HIGH | Audit with axe/WAVE, add semantic HTML, implement ARIA, test with screen readers |
| Missing clear/backspace | LOW | Add state management for previous values, implement CE logic, add keyboard mapping |
| Division by zero unhandled | LOW | Add guard clause, return error state, update UI to show error message |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Floating-point precision | Phase 1: Core Calculator | Test suite includes 0.1+0.2, sqrt(4)-2, verify rounding |
| Operation chaining | Phase 1: Core Calculator | Test multi-step: 5+3-2×4÷2, verify state machine |
| Input validation | Phase 1: Core Calculator | Test invalid inputs: multiple decimals, letters, empty |
| Display overflow | Phase 1: Core Calculator | Test 15+ digit numbers, verify scientific notation |
| Division by zero | Phase 1: Core Calculator | Test "5÷0", verify error message displayed |
| Clear button behavior | Phase 1: Core Calculator | Test AC clears all, verify state reset |
| Keyboard support | Phase 2: Keyboard Support | Test all operations keyboard-only, no mouse |
| Focus management | Phase 2: Keyboard Support | Tab through all buttons, verify visible focus |
| Equals repetition | Phase 1: Core Calculator | Test "1+1===" produces 2,3,4 |
| Screen reader support | Phase 3: Accessibility | Test with NVDA/VoiceOver, verify ARIA labels |
| Touch target size | Phase 4: Mobile Polish | Measure button sizes, verify 44×44px minimum |
| History persistence | Phase 5: History Feature | Refresh page, verify history restored from storage |

## Sources

- [How to build an HTML calculator app from scratch using JavaScript - freeCodeCamp](https://www.freecodecamp.org/news/how-to-build-an-html-calculator-app-from-scratch-using-javascript-4454b8714b98/)
- [Math is Hard in JavaScript: Floating-Point Precision - Patrick Karsh](https://patrickkarsh.medium.com/why-math-is-hard-in-javascript-floating-point-precision-in-javascript-41706aa7a89d)
- [JavaScript Corner: Math and the Pitfalls of Floating Point Numbers - CODE Magazine](https://www.codemag.com/article/1811041/JavaScript-Corner-Math-and-the-Pitfalls-of-Floating-Point-Numbers)
- [Floating point number precision in JavaScript - GeeksforGeeks](https://www.geeksforgeeks.org/javascript/floating-point-number-precision-in-javascript/)
- [Top State Management Pitfalls in Modern UI - LogicLoom](https://logicloom.in/state-management-gone-wrong-avoiding-common-pitfalls-in-modern-ui-development/)
- [15+ Test Cases for Calculator - Botgauge](https://www.botgauge.com/blog/test-cases-calculator-complete-guide)
- [Calculator app on iOS 18 doesn't support repeating operations - TechIssuesToday](https://techissuestoday.com/ios-18-calculator-repeating-operations-support/)
- [How to build a calculator — part 2 - Zell Liew](https://zellwk.com/blog/calculator-part-2/)
- [What do AC and CE mean on a calculator? - TutorialsPoint](https://www.tutorialspoint.com/what-do-ac-and-ce-mean-on-a-calculator)
- [C vs. CE Button on a Calculator: What's the Difference? - ConquerYourExam](https://www.conqueryourexam.com/c-vs-ce-button-on-a-calculator/)
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [Calculator App - Frontend Mentor (Accessibility focus)](https://www.frontendmentor.io/solutions/calculator-app-html-css-js-tried-to-focus-on-accessibility-2yw2AOpoa)

---
*Pitfalls research for: Calculator Web App*
*Researched: 2026-02-14*
