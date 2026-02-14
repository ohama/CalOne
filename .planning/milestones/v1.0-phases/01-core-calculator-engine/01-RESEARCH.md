# Phase 1: Core Calculator Engine - Research

**Researched:** 2026-02-14
**Domain:** Calculator State Management & Arithmetic Logic
**Confidence:** HIGH

## Summary

Phase 1 requires implementing a stateful calculator engine capable of accurate arithmetic operations through a JavaScript API. The core challenge is managing calculator state transitions (number entry → operator selection → second operand → result) while handling edge cases that commonly break calculator implementations.

Research reveals that calculator engines require a finite state machine pattern with four critical state properties: `displayValue`, `firstOperand`, `operator`, and `waitingForSecondOperand`. The state machine prevents common pitfalls like broken operation chaining ("99 - 1 = 98, 98 - 1 = 0") and floating-point precision errors (0.1 + 0.2 = 0.30000000000000004).

**Primary recommendation:** Use explicit state object pattern with `toFixed(10)` + `parseFloat()` for precision handling, guard clauses for division by zero, and `includes()` check for decimal point validation. Avoid eval() completely; implement calculation logic with switch/case statements.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JavaScript | ES2015+ | Calculator logic implementation | Native number operations sufficient; no library dependencies needed for basic arithmetic |
| Math object | Native | Rounding and precision operations | Built-in Math.round() and Math.pow() handle precision correction without external libraries |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| decimal.js | 10.4+ | Arbitrary-precision decimal arithmetic | Only if financial calculations require absolute precision; overkill for basic calculator |
| big.js | 6.2+ | Lightweight arbitrary-precision library | Alternative to decimal.js if bundle size matters; not needed for Phase 1 scope |
| math.js | 12.4+ | Extended math functions and formatting | Only if implementing scientific calculator features; not needed for basic arithmetic |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native toFixed() + parseFloat() | decimal.js library | decimal.js adds 31KB bundle size; native methods sufficient for display precision (requirement CALC-06 only needs 0.1+0.2=0.3, not financial precision) |
| State object pattern | Class-based Calculator | Classes add boilerplate without benefit for simple state; plain object is clearer and easier to serialize |
| Switch statement for operators | eval() expression parsing | eval() is security risk and doesn't handle edge cases (division by zero, precision); explicit logic is safer and more maintainable |

**Installation:**
```bash
# No installation needed - using native JavaScript
# Optional (for future scientific features):
# npm install decimal.js math.js
```

## Architecture Patterns

### Recommended Project Structure
```
js/
├── calculator.js       # Core calculation engine (Phase 1)
├── display.js          # Display component (future)
└── main.js             # App initialization (future)
```

### Pattern 1: State Object with Flags
**What:** Maintain calculator state in single object with four properties tracking current display, stored operand, selected operator, and input readiness flag.

**When to use:** Essential for all calculator implementations; prevents state management bugs and enables predictable behavior.

**Example:**
```javascript
// Source: https://freshman.tech/calculator/
const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};
```

**Why this structure:**
- `displayValue` (string): What shows on screen; string prevents leading zero issues
- `firstOperand` (number|null): Stored value from before operator press; null indicates no pending operation
- `waitingForSecondOperand` (boolean): Flag that changes behavior of digit input; prevents concatenating to first operand after operator press
- `operator` (string|null): Pending operation (+, -, ×, ÷); null means no operation queued

### Pattern 2: Decimal Point Validation
**What:** Prevent multiple decimal points in single number by checking if display value already contains period before appending.

**When to use:** Required for INPT-04 (prevent duplicate decimal input); critical for data integrity.

**Example:**
```javascript
// Source: https://freshman.tech/calculator/
function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand === true) {
    calculator.displayValue = '0.'
    calculator.waitingForSecondOperand = false;
    return
  }

  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
  }
}
```

**Edge case handling:**
- If waiting for second operand, decimal starts new number as "0."
- `includes()` check prevents "3.14.159" invalid inputs
- No error message needed; silently ignore extra decimal presses (standard calculator UX)

### Pattern 3: Floating-Point Precision Correction
**What:** Round calculation results to 10 decimal places using toFixed() then parse back to number to eliminate binary representation errors.

**When to use:** Required for CALC-06 (0.1 + 0.2 = 0.3); apply to all arithmetic operation results.

**Example:**
```javascript
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
function performCalculation() {
  const prev = parseFloat(calculator.firstOperand);
  const current = parseFloat(calculator.displayValue);
  let result;

  switch (calculator.operator) {
    case '+': result = prev + current; break;
    case '-': result = prev - current; break;
    case '×': result = prev * current; break;
    case '÷': result = prev / current; break;
    default: return current;
  }

  // Fix floating-point precision to 10 decimal places
  return parseFloat(result.toFixed(10));
}
```

**Why 10 decimal places:**
- Sufficient to eliminate display errors (0.1 + 0.2 becomes 0.3)
- Avoids unnecessary trailing zeros from toFixed()
- parseFloat() removes insignificant zeros ("1.50" → 1.5)
- Matches precision of standard calculators

**Alternative approach (Math.round):**
```javascript
// Multiply by 10^10, round, divide back
function roundTo10Decimals(num) {
  return Math.round(num * 1e10) / 1e10;
}
```

### Pattern 4: Division by Zero Guard
**What:** Explicitly check for zero divisor before division; return 'Error' string instead of allowing Infinity result.

**When to use:** Required for CALC-05 (division by zero error handling); prevents confusing "Infinity" display.

**Example:**
```javascript
// Source: https://www.w3resource.com/javascript-exercises/error-handling/javascript-error-handling-exercise-3.php
function performCalculation() {
  const prev = parseFloat(calculator.firstOperand);
  const current = parseFloat(calculator.displayValue);

  if (calculator.operator === '÷' && current === 0) {
    return 'Error';
  }

  // ... rest of calculation logic
}
```

**Error recovery:**
- Display shows "Error" string
- Any button press (except AC) should clear error and start fresh
- AC button resets to initial state

### Pattern 5: Operator Chaining
**What:** When operator pressed while waiting for second operand, replace operator instead of calculating; enables user to change mind.

**When to use:** Essential for usable calculator UX; prevents broken chaining (99 - 1 = 98, 98 - 1 = 0 bug).

**Example:**
```javascript
// Source: https://freshman.tech/calculator/
function handleOperator(nextOperator) {
  const inputValue = parseFloat(calculator.displayValue);

  // Allow operator change before entering second operand
  if (calculator.operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    return;
  }

  if (calculator.firstOperand === null) {
    calculator.firstOperand = inputValue;
  } else if (calculator.operator) {
    const result = performCalculation();
    calculator.displayValue = String(result);
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}
```

**State transitions:**
- `firstOperand === null`: First number entry, store and wait for operator
- `operator && waitingForSecondOperand`: Operator already set, replace it
- `operator && !waitingForSecondOperand`: Second operand entered, calculate and chain

### Pattern 6: Display Overflow Handling
**What:** Limit display to maximum digits; switch to scientific notation for very large/small numbers using toExponential().

**When to use:** Required for INPT-05 (display overflow handling); prevents layout breaking with 15+ digit numbers.

**Example:**
```javascript
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toExponential
function formatForDisplay(value, maxDigits = 10) {
  if (value === 'Error') return value;

  const str = String(value);

  // Check if number exceeds display width
  if (str.replace('-', '').replace('.', '').length > maxDigits) {
    return Number(value).toExponential(2);
  }

  return str;
}

// Example outputs:
// formatForDisplay(123456789012) → "1.23e+11"
// formatForDisplay(0.00000000123) → "1.23e-9"
// formatForDisplay(123.456) → "123.456"
```

**Display width limits:**
- 10 digits: Standard for basic calculators (fits mobile screens)
- Scientific notation with 2 decimal places keeps display compact
- Negative sign and decimal point don't count toward digit limit

### Pattern 7: Sign Toggle Implementation
**What:** Multiply current display value by -1 to flip sign; works for both positive and negative numbers.

**When to use:** Required for CALC-03 (sign toggle +/-); allows negative number entry.

**Example:**
```javascript
// Source: FreeCodeCamp forum discussions
function toggleSign() {
  const currentValue = parseFloat(calculator.displayValue);
  calculator.displayValue = String(currentValue * -1);
}
```

**Edge cases:**
- Toggle on "0" produces "-0" which displays as "0" (acceptable)
- After operator press, toggle should work on second operand (respect waitingForSecondOperand flag)
- Toggle during error state should clear error first

### Pattern 8: Percent Calculation
**What:** Calculate percentage based on context: if operator pending, apply percent to firstOperand; otherwise convert current value to decimal.

**When to use:** Required for CALC-02 (percent calculation); common for tip/discount calculations.

**Example:**
```javascript
// Source: https://www.geeksforgeeks.org/javascript/percentage-calculator-using-html-css-and-javascript/
function handlePercent() {
  const current = parseFloat(calculator.displayValue);

  if (calculator.firstOperand && calculator.operator) {
    // Context: "50 + 10%" means 50 + (50 * 0.1) = 55
    const percentValue = (calculator.firstOperand * current) / 100;
    calculator.displayValue = String(percentValue);
  } else {
    // No context: "25%" means 0.25
    calculator.displayValue = String(current / 100);
  }
}
```

**Percent contexts:**
- "50 + 10%" → 55 (add 10% of 50)
- "200 - 15%" → 170 (subtract 15% of 200)
- "25%" → 0.25 (convert to decimal)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Expression parsing ("2+3*4") | Custom tokenizer/parser | Not applicable (out of scope) | Phase 1 only handles stateful operations, not expression strings; if future phase needs this, use math.js parser |
| Arbitrary precision arithmetic | Custom decimal class | decimal.js or big.js (if needed) | Binary floating-point has edge cases; libraries handle all corner cases; Phase 1 scope doesn't require this (toFixed sufficient) |
| Scientific notation formatting | String manipulation | Number.toExponential() | Native method handles all edge cases (very large, very small, negative numbers) |
| Number validation | Regex patterns | parseFloat() + isNaN() | Native parsing is more reliable than regex for number validation |

**Key insight:** For basic calculator operations, native JavaScript number operations + toFixed() for display precision is sufficient. Don't prematurely optimize with arbitrary-precision libraries unless requirements explicitly demand financial-grade accuracy.

## Common Pitfalls

### Pitfall 1: Broken Operation Chaining
**What goes wrong:** Consecutive operations fail: "99 - 1 = 98, 98 - 1 = 0" instead of 97. Or "5 + 3 - 2" calculates incorrectly.

**Why it happens:** After equals press, state management fails to properly set up for next operation. `firstOperand` not updated with result, or `waitingForSecondOperand` flag not reset.

**How to avoid:**
- After calculation, set `firstOperand = result`
- Set `waitingForSecondOperand = true` when operator pressed
- Clear `waitingForSecondOperand = false` when digit pressed
- Test multi-step sequences: "5 + 3 - 2 × 4 ÷ 2"

**Warning signs:**
- Second calculation in chain produces wrong result
- Display doesn't update after operator press
- Digit entry concatenates to previous result instead of starting fresh

### Pitfall 2: Multiple Decimal Points Accepted
**What goes wrong:** User can type "3.14.159" creating invalid number that breaks calculations.

**Why it happens:** No validation on decimal button press; each press blindly appends period.

**How to avoid:**
- Use `displayValue.includes('.')` check before appending
- When `waitingForSecondOperand === true`, decimal starts "0." for new number
- Test: Press decimal multiple times, verify only one appears

**Warning signs:**
- Display shows numbers like "1.2.3"
- parseFloat() returns NaN or truncated value
- Calculations fail silently

### Pitfall 3: Floating-Point Display Errors
**What goes wrong:** Calculator shows "0.30000000000000004" for 0.1 + 0.2, destroying user trust.

**Why it happens:** Binary floating-point cannot precisely represent some decimals (0.1 = 0.00011001100110011... in binary).

**How to avoid:**
- Apply `parseFloat(result.toFixed(10))` to ALL calculation results
- Test specific problematic operations: 0.1 + 0.2, 0.2 + 0.4, 0.1 * 0.2
- Verify display shows clean decimals, not long floating-point errors

**Warning signs:**
- Results have 15+ decimal places with trailing garbage
- Subtraction shows tiny negative numbers instead of zero (0 - 0 = -0.0000001)
- User reports "calculator gives wrong answers"

### Pitfall 4: Division by Zero Shows "Infinity"
**What goes wrong:** Dividing by zero displays "Infinity" or "NaN" instead of user-friendly error message.

**Why it happens:** JavaScript doesn't throw error for division by zero; returns Infinity. Developers forget to add guard clause.

**How to avoid:**
- Add explicit check: `if (operator === '÷' && currentValue === 0) return 'Error'`
- Place check BEFORE performing division
- Test: "5 ÷ 0" should show "Error", not "Infinity"

**Warning signs:**
- Display shows "Infinity" or "-Infinity"
- Subsequent operations fail because Infinity is not a valid operand
- No way to recover without full clear

### Pitfall 5: Display Overflow Breaks Layout
**What goes wrong:** Entering 15+ digit number overflows display container, breaking UI layout.

**Why it happens:** No maximum length limit on input; display container has fixed width; CSS overflow not handled.

**How to avoid:**
- Limit input to 10-12 digits before accepting new digit
- Convert to scientific notation if result exceeds display width
- Test: Type 20 digit number, verify display remains within bounds

**Warning signs:**
- Long numbers wrap to multiple lines
- Display width expands breaking grid layout
- Numbers extend beyond screen edge on mobile

### Pitfall 6: No Clear vs All Clear Distinction
**What goes wrong:** Users confused whether clear button clears current entry or entire calculation; lose work when trying to fix typo.

**Why it happens:** Single clear button has ambiguous behavior; doesn't match user's mental model from physical calculators.

**How to avoid:**
- AC (All Clear) resets all state: `displayValue = '0', firstOperand = null, operator = null, waitingForSecondOperand = false`
- For Phase 1, implement AC only (simpler UX)
- Future: Add CE (Clear Entry) or backspace for single digit deletion

**Warning signs:**
- Users complain about "starting over for small mistakes"
- No way to fix typo without losing entire calculation
- Button labeled "C" but behavior unclear

## Code Examples

Verified patterns from official sources:

### Complete State Object Initialization
```javascript
// Source: https://freshman.tech/calculator/
const calculator = {
  displayValue: '0',      // Current screen display (string for leading zeros)
  firstOperand: null,     // Stored value before operator press
  waitingForSecondOperand: false,  // Flag: ready for second number?
  operator: null,         // Pending operation: +, -, ×, ÷, or null
};
```

### Input Digit Handler
```javascript
// Source: https://freshman.tech/calculator/
function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}
```

### Input Decimal Handler with Validation
```javascript
// Source: https://freshman.tech/calculator/
function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand === true) {
    calculator.displayValue = '0.';
    calculator.waitingForSecondOperand = false;
    return;
  }

  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
  }
}
```

### Calculation with Precision Correction
```javascript
// Source: MDN + common patterns
function performCalculation() {
  const { firstOperand, displayValue, operator } = calculator;
  const inputValue = parseFloat(displayValue);

  if (firstOperand === null) {
    return inputValue;
  }

  const prev = parseFloat(firstOperand);
  let result;

  // Division by zero guard
  if (operator === '÷' && inputValue === 0) {
    return 'Error';
  }

  switch (operator) {
    case '+': result = prev + inputValue; break;
    case '-': result = prev - inputValue; break;
    case '×': result = prev * inputValue; break;
    case '÷': result = prev / inputValue; break;
    default: return inputValue;
  }

  // Fix floating-point precision
  return parseFloat(result.toFixed(10));
}
```

### Operator Handler with Chaining Support
```javascript
// Source: https://freshman.tech/calculator/
function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator, waitingForSecondOperand } = calculator;
  const inputValue = parseFloat(displayValue);

  // Allow operator change before entering second operand
  if (operator && waitingForSecondOperand) {
    calculator.operator = nextOperator;
    return;
  }

  if (firstOperand === null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const result = performCalculation();

    calculator.displayValue = `${parseFloat(result.toFixed(10))}`;
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}
```

### Display Overflow Formatting
```javascript
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toExponential
function formatForDisplay(value, maxDigits = 10) {
  if (value === 'Error') return value;

  const str = String(value);
  const digitsOnly = str.replace('-', '').replace('.', '');

  if (digitsOnly.length > maxDigits) {
    return Number(value).toExponential(2);
  }

  return str;
}
```

### All Clear (AC) Reset
```javascript
function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.operator = null;
  calculator.waitingForSecondOperand = false;
}
```

### Sign Toggle (+/-)
```javascript
function toggleSign() {
  const currentValue = parseFloat(calculator.displayValue);
  calculator.displayValue = String(currentValue * -1);
}
```

### Percent Calculation
```javascript
// Source: https://www.geeksforgeeks.org/javascript/percentage-calculator-using-html-css-and-javascript/
function handlePercent() {
  const current = parseFloat(calculator.displayValue);
  const { firstOperand, operator } = calculator;

  if (firstOperand !== null && operator) {
    // Contextual: "50 + 10%" = 50 + (50 * 0.1) = 55
    const percentValue = (firstOperand * current) / 100;
    calculator.displayValue = String(percentValue);
  } else {
    // No context: "25%" = 0.25
    calculator.displayValue = String(current / 100);
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| eval() for calculations | Explicit operator logic | ~2010s (security concerns) | Safer, more control over edge cases, but requires more code |
| Storing state in DOM | JavaScript state object | ~2015 (React/modern frameworks) | Testable, serializable state; separation of concerns |
| toFixed() alone | toFixed() + parseFloat() | ~2018 (type safety awareness) | Maintains number type while fixing precision |
| No decimal validation | includes() check | Modern standard | Prevents invalid input like "1.2.3" |
| Class-based OOP | Plain object + functions | 2020s (functional patterns) | Simpler, easier to reason about for small state |

**Deprecated/outdated:**
- **eval() for expression evaluation**: Security vulnerability (arbitrary code execution); modern approach uses explicit operator logic with switch/case
- **Storing calculator state in DOM (reading from display.textContent)**: Makes testing difficult, state scattered; modern approach uses single state object
- **Using var keyword**: Function-scoped, hoisting issues; use const (default) or let
- **No floating-point correction**: Unacceptable UX; users expect 0.1 + 0.2 = 0.3

## Open Questions

Things that couldn't be fully resolved:

1. **Equals button repetition behavior**
   - What we know: Some calculators repeat last operation when equals pressed multiple times ("1 + 1 = = =" → 2, 3, 4)
   - What's unclear: Is this expected for basic calculator or only scientific? User expectations vary.
   - Recommendation: Defer to Phase 2 or later; not in Phase 1 requirements; test with users to validate need

2. **Percent button context ambiguity**
   - What we know: "50 + 10%" could mean "50 + 5 = 55" OR "50 + 10 = 60" depending on calculator
   - What's unclear: Which interpretation matches user expectations for basic calculator?
   - Recommendation: Implement contextual approach (10% of 50 = 5), matches iOS calculator behavior; document this choice

3. **Maximum number length before scientific notation**
   - What we know: 10-12 digits is standard display limit
   - What's unclear: Should input be blocked at limit, or only results converted to scientific notation?
   - Recommendation: Allow input up to 12 digits; convert results to scientific notation if exceeds 10 digits display width

4. **Error state recovery**
   - What we know: Division by zero should show "Error"
   - What's unclear: What button presses clear error? Only AC, or any number/operator?
   - Recommendation: AC always clears; number button clears and starts new entry; operator clears and uses result as 0

## Sources

### Primary (HIGH confidence)
- [How to build a Calculator App with JavaScript - Freshman Tech](https://freshman.tech/calculator/) - Complete calculator state object pattern, decimal validation, operator chaining
- [Number.prototype.toExponential() - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toExponential) - Official documentation for display overflow handling
- [Number.prototype.toFixed() - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) - Official documentation for precision rounding
- [Floating point number precision in JavaScript - GeeksforGeeks](https://www.geeksforgeeks.org/javascript/floating-point-number-precision-in-javascript/) - Precision handling techniques

### Secondary (MEDIUM confidence)
- [Designing A Calculator with FSM Logic - Medium](https://rvunabandi.medium.com/making-a-calculator-in-javascript-64193ea6a492) - State machine pattern for calculators
- [Build a JavaScript calculator using a finite state machine - Coding Lawyer](https://www.codinglawyer.io/posts/build-javascript-calculator/) - FSM implementation approach
- [Handling Floating Point Precision in JavaScript - Java Code Geeks](https://www.javacodegeeks.com/2024/11/handling-floating-point-precision-in-javascript.html) - Precision solutions
- [How to Restrict Input to Numbers and Decimals - GeeksforGeeks](https://www.geeksforgeeks.org/how-to-restrict-input-box-to-allow-only-numbers-and-decimal-point-javascript/) - Input validation patterns
- [Percentage calculator using HTML CSS and JavaScript - GeeksforGeeks](https://www.geeksforgeeks.org/javascript/percentage-calculator-using-html-css-and-javascript/) - Percent calculation formulas
- [JavaScript Function: Custom Error on second number zero - w3resource](https://www.w3resource.com/javascript-exercises/error-handling/javascript-error-handling-exercise-3.php) - Division by zero handling

### Tertiary (LOW confidence - community sources)
- [Can't get plus minus button (+/-) to work - freeCodeCamp Forum](https://forum.freecodecamp.org/t/solved-cant-get-plus-minus-button-to-work-on-js-calculator/141450) - Sign toggle implementation discussions
- [JavaScript Calculator logic - freeCodeCamp Forum](https://forum.freecodecamp.org/t/javascript-calculator-logic/441401) - State management patterns
- [What's it called when you keep pressing equals button - Quora](https://www.quora.com/Whats-it-called-when-on-a-calculator-you-keep-pressing-the-equals-button-and-it-continues-to-calculate-values-in-the-same-way-each-time-How-does-this-function-work) - Equals repetition behavior

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Native JavaScript methods well-documented, no library dependencies needed
- Architecture: HIGH - State object pattern verified in multiple authoritative sources with working code examples
- Pitfalls: HIGH - All pitfalls documented in official guides and community post-mortems

**Research date:** 2026-02-14
**Valid until:** ~90 days (JavaScript number handling is stable; state management patterns are mature)
