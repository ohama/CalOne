# Phase 2: Display and Button Interface - Research

**Researched:** 2026-02-14
**Domain:** Vanilla JavaScript DOM manipulation, CSS Grid layout, Responsive design
**Confidence:** HIGH

## Summary

Phase 2 implements the visual calculator interface using semantic HTML buttons, CSS Grid layout, and vanilla JavaScript DOM event handling. The research confirms that modern browser support for CSS Grid, event delegation patterns, and responsive design utilities makes this straightforward with no build tools required.

The standard approach uses:
- Semantic `<button>` elements for accessibility and keyboard support out-of-the-box
- CSS Grid with `grid-template-areas` for calculator layout (4-column grid)
- Event delegation pattern for efficient button click handling
- Mobile-first responsive design with viewport units and media queries
- `textContent` (not `innerHTML`) for XSS-safe display updates

**Primary recommendation:** Use a single event listener on the button container with event delegation, semantic HTML buttons for accessibility, and CSS Grid for the button layout. The existing calculator API from Phase 1 already handles all logic, so this phase is purely DOM binding and styling.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JS (ES6+) | Native | DOM manipulation, event handling | No dependencies needed for simple calculator UI, works on GitHub Pages |
| CSS Grid | Native | Button layout | Modern standard for 2D layouts, better than flexbox for grid patterns |
| CSS Media Queries | Native | Responsive design | Standard responsive approach, supported everywhere |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| N/A | - | No additional libraries needed | - |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Event delegation | Individual button listeners | Event delegation reduces memory usage and handles dynamically added elements better |
| CSS Grid | Flexbox | Flexbox works but Grid is simpler for 2D button grids |
| `<button>` elements | `<div>` with onclick | Semantic buttons provide keyboard accessibility, focus management, and ARIA roles automatically |

**Installation:**
```bash
# No installation needed - vanilla HTML/CSS/JS only
```

## Architecture Patterns

### Recommended Project Structure
```
/
├── index.html          # Main HTML with calculator UI
├── css/
│   └── main.css        # Calculator styles (to be created)
└── js/
    ├── calculator.js   # Existing: calculator logic (Phase 1)
    └── main.js         # Existing: DOM bindings (to be enhanced)
```

### Pattern 1: Event Delegation for Button Handling
**What:** Attach a single event listener to the button container, use `event.target` to determine which button was clicked
**When to use:** When you have many similar elements (calculator buttons) that need event handlers
**Example:**
```javascript
// Source: https://javascript.info/event-delegation
const buttonContainer = document.querySelector('.calculator-buttons');

buttonContainer.addEventListener('click', (event) => {
  if (event.target.tagName !== 'BUTTON') return;

  const { action, value } = event.target.dataset;

  if (action === 'digit') {
    inputDigit(value);
  } else if (action === 'operator') {
    handleOperator(value);
  } else if (action === 'decimal') {
    inputDecimal();
  } else if (action === 'clear') {
    resetCalculator();
  } else if (action === 'backspace') {
    handleBackspace();
  } else if (action === 'sign') {
    toggleSign();
  } else if (action === 'percent') {
    handlePercent();
  }

  updateDisplay();
});
```

### Pattern 2: CSS Grid with grid-template-areas for Calculator Layout
**What:** Use named grid areas to create the standard calculator button layout
**When to use:** When creating structured 2D layouts like calculator interfaces
**Example:**
```css
/* Source: https://freshman.tech/css-grid-calculator/ */
.calculator-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background-color: #999;
}

/* Special buttons that span multiple columns */
.button-zero {
  grid-column: span 2;
}

/* Alternative using grid-template-areas for more complex layouts */
.calculator-buttons-advanced {
  display: grid;
  grid-template-areas:
    "ac sign percent divide"
    "seven eight nine multiply"
    "four five six subtract"
    "one two three add"
    "zero zero decimal equals";
  gap: 1px;
}

.button[data-value="0"] {
  grid-area: zero;
}
```

### Pattern 3: Mobile-First Responsive Design
**What:** Write base styles for mobile, then use `min-width` media queries to enhance for larger screens
**When to use:** All responsive web projects; provides better performance on mobile devices
**Example:**
```css
/* Source: https://jpgdesigns.com/mobile-first-css/ */
/* Base styles: mobile (320px+) */
.calculator {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  font-size: 1.5rem;
}

.calculator-button {
  height: 60px;
  font-size: 1.25rem;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .calculator {
    max-width: 400px;
  }

  .calculator-button {
    height: 80px;
    font-size: 1.5rem;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .calculator {
    max-width: 480px;
  }
}
```

### Pattern 4: Touch-Friendly Button States
**What:** Provide visual feedback for button interactions on both desktop (hover) and mobile (active/touch)
**When to use:** Interactive buttons that need user feedback
**Example:**
```css
/* Source: https://medium.com/@mezoistvan/finally-a-css-only-solution-to-hover-on-touchscreens-c498af39c31c */
.calculator-button {
  background: #e0e0e0;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s;
  -webkit-tap-highlight-color: transparent; /* Remove blue highlight on mobile */
}

/* Desktop hover */
@media (hover: hover) and (pointer: fine) {
  .calculator-button:hover {
    background: #d0d0d0;
  }
}

/* Touch feedback (works on all devices) */
.calculator-button:active {
  background: #c0c0c0;
  transform: scale(0.98);
}

/* Focus for keyboard navigation */
.calculator-button:focus {
  outline: 2px solid #007AFF;
  outline-offset: 2px;
}
```

### Pattern 5: Display Overflow Handling
**What:** Truncate or scale display text when numbers are too long
**When to use:** Calculator displays with limited width
**Example:**
```css
/* Source: https://css-tricks.com/snippets/css/truncate-string-with-ellipsis/ */
.calculator-display {
  width: 100%;
  text-align: right;
  padding: 1rem;
  font-size: 2.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background: #f0f0f0;
  border-radius: 8px 8px 0 0;
}

/* Alternative: Dynamic font scaling */
.calculator-display-adaptive {
  font-size: clamp(1.5rem, 5vw, 2.5rem); /* Scales between 1.5rem and 2.5rem */
}
```

### Anti-Patterns to Avoid
- **Using `<div>` instead of `<button>`:** Loses keyboard accessibility, focus management, and screen reader support. Buttons provide these features automatically.
- **Individual event listeners per button:** Creates memory overhead and doesn't handle dynamic buttons. Use event delegation instead.
- **Using `innerHTML` for display updates:** Opens XSS vulnerabilities. Use `textContent` for text-only updates.
- **Hardcoded pixel widths for mobile:** Breaks on different screen sizes. Use viewport units, percentages, or max-width with auto margins.
- **Float-based layouts:** Outdated and harder to maintain. CSS Grid is the modern standard for calculator layouts.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Button click handling | 16+ individual event listeners | Event delegation pattern | Reduces memory usage, handles dynamic elements, centralizes logic |
| Backspace logic | Custom string manipulation | `string.slice(0, -1)` with state validation | Edge cases: '0', single digit, 'Error' state, waiting for operand |
| Responsive breakpoints | Custom pixel values | Standard breakpoints: 768px (tablet), 1024px (desktop) | Industry standard, tested across devices |
| Display overflow | Custom JavaScript text scaling | CSS `text-overflow: ellipsis` + `formatForDisplay()` | Calculator API already handles scientific notation for large numbers |
| Touch feedback | JavaScript touch event handlers | CSS `:active` pseudo-class + media queries | Native, hardware-accelerated, works across all touch devices |

**Key insight:** Calculator UIs are well-understood domain. Standard CSS Grid + event delegation patterns handle 90% of the work. Don't reinvent layout or event handling.

## Common Pitfalls

### Pitfall 1: Forgetting to Update Display After State Changes
**What goes wrong:** Buttons trigger calculator API functions but display doesn't update, showing stale values
**Why it happens:** The calculator state object updates internally, but DOM doesn't auto-sync
**How to avoid:** Always call `updateDisplay()` after any calculator state change (except when batching multiple operations)
**Warning signs:** Display shows "0" when state has values, display doesn't update after button clicks

### Pitfall 2: Event Bubbling with Non-Button Elements
**What goes wrong:** Event delegation fires on button container clicks between buttons or on nested spans
**Why it happens:** Click events bubble up from child elements
**How to avoid:** Check `event.target.tagName === 'BUTTON'` or use `event.target.closest('button')` to find the nearest button ancestor
**Warning signs:** Console errors like "Cannot read property 'dataset' of undefined"

### Pitfall 3: Mobile Hover State Stickiness
**What goes wrong:** On mobile, :hover styles get "stuck" after tapping a button
**Why it happens:** Mobile browsers simulate hover on tap, but don't clear it until next tap
**How to avoid:** Use `@media (hover: hover)` to apply :hover only on devices with true hover capability
**Warning signs:** Buttons stay highlighted after tap on mobile, inconsistent visual feedback

### Pitfall 4: Accessibility - Missing Keyboard Support
**What goes wrong:** Calculator works with mouse/touch but not with keyboard
**Why it happens:** Using `<div>` instead of `<button>`, or forgetting `tabindex`
**How to avoid:** Use semantic `<button>` elements which are keyboard-focusable by default
**Warning signs:** Can't tab to buttons, pressing Enter/Space doesn't trigger buttons

### Pitfall 5: Display Width Not Constrained
**What goes wrong:** Very long numbers push calculator width or overflow visibly
**Why it happens:** Display container has no width constraint or overflow handling
**How to avoid:** Set explicit `max-width` on calculator container, use `overflow: hidden` and `text-overflow: ellipsis` on display
**Warning signs:** Calculator grows horizontally on mobile, horizontal scrollbar appears

### Pitfall 6: Backspace on Special States
**What goes wrong:** Backspace after "Error", after "=", or on single digit "5" causes bugs
**Why it happens:** Backspace needs to handle: Error state (reset to 0), waitingForSecondOperand (clear display), single digit (reset to 0)
**How to avoid:** Implement `handleBackspace()` with state checks:
  - If displayValue is 'Error', reset to '0'
  - If waitingForSecondOperand, reset to '0' and clear flag
  - If single digit, reset to '0'
  - Otherwise, slice last character
**Warning signs:** Backspace on "Error" creates "Erro", backspace on "5" creates empty string

### Pitfall 7: Not Preventing Default Button Behavior
**What goes wrong:** Buttons submit forms if wrapped in a `<form>` element
**Why it happens:** `<button>` elements inside forms have default `type="submit"`
**How to avoid:** Set `type="button"` on all calculator buttons, or call `event.preventDefault()` in handler
**Warning signs:** Page refreshes on button click, form submission occurs

## Code Examples

Verified patterns from official sources:

### Complete Button Container Setup
```html
<!-- Semantic HTML with data attributes for action dispatch -->
<div class="calculator">
  <div class="calculator-display" id="display">0</div>

  <div class="calculator-buttons">
    <button type="button" class="button button-function" data-action="clear">AC</button>
    <button type="button" class="button button-function" data-action="sign">+/-</button>
    <button type="button" class="button button-function" data-action="percent">%</button>
    <button type="button" class="button button-operator" data-action="operator" data-value="÷">÷</button>

    <button type="button" class="button" data-action="digit" data-value="7">7</button>
    <button type="button" class="button" data-action="digit" data-value="8">8</button>
    <button type="button" class="button" data-action="digit" data-value="9">9</button>
    <button type="button" class="button button-operator" data-action="operator" data-value="×">×</button>

    <button type="button" class="button" data-action="digit" data-value="4">4</button>
    <button type="button" class="button" data-action="digit" data-value="5">5</button>
    <button type="button" class="button" data-action="digit" data-value="6">6</button>
    <button type="button" class="button button-operator" data-action="operator" data-value="-">-</button>

    <button type="button" class="button" data-action="digit" data-value="1">1</button>
    <button type="button" class="button" data-action="digit" data-value="2">2</button>
    <button type="button" class="button" data-action="digit" data-value="3">3</button>
    <button type="button" class="button button-operator" data-action="operator" data-value="+">+</button>

    <button type="button" class="button button-zero" data-action="digit" data-value="0">0</button>
    <button type="button" class="button" data-action="decimal">.</button>
    <button type="button" class="button button-operator button-equals" data-action="operator" data-value="=">=</button>
  </div>
</div>
```

### Event Delegation Handler
```javascript
// Source: https://javascript.info/event-delegation
// Enhanced from: https://blog.logrocket.com/patterns-efficient-dom-manipulation-vanilla-javascript/

const buttonContainer = document.querySelector('.calculator-buttons');

buttonContainer.addEventListener('click', (event) => {
  // Guard: Only handle button clicks
  const button = event.target.closest('button');
  if (!button) return;

  const { action, value } = button.dataset;

  // Dispatch to calculator API
  switch (action) {
    case 'digit':
      inputDigit(value);
      break;
    case 'operator':
      handleOperator(value);
      break;
    case 'decimal':
      inputDecimal();
      break;
    case 'clear':
      resetCalculator();
      break;
    case 'backspace':
      handleBackspace();
      break;
    case 'sign':
      toggleSign();
      break;
    case 'percent':
      handlePercent();
      break;
    default:
      return; // Unknown action, don't update display
  }

  // Always update display after state change
  updateDisplay();
});
```

### Backspace Implementation
```javascript
// To be added to calculator.js
function handleBackspace() {
  const { displayValue, waitingForSecondOperand } = calculator;

  // If showing Error, reset to 0
  if (displayValue === 'Error') {
    calculator.displayValue = '0';
    return;
  }

  // If waiting for second operand, clear display
  if (waitingForSecondOperand) {
    calculator.displayValue = '0';
    calculator.waitingForSecondOperand = false;
    return;
  }

  // If single digit (including "0", "-5"), reset to 0
  if (displayValue.length === 1 || (displayValue.length === 2 && displayValue.startsWith('-'))) {
    calculator.displayValue = '0';
    return;
  }

  // Otherwise, remove last character
  calculator.displayValue = displayValue.slice(0, -1);
}
```

### Responsive CSS Grid Layout
```css
/* Source: https://freshman.tech/css-grid-calculator/ */
.calculator {
  width: 100%;
  max-width: 320px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calculator-display {
  padding: 1.5rem 1rem;
  text-align: right;
  font-size: 2.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
  background: #f0f0f0;
  color: #000;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-height: 4rem;
}

.calculator-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: #999;
}

.button {
  height: 60px;
  border: none;
  background: #e0e0e0;
  font-size: 1.25rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  cursor: pointer;
  transition: background-color 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.button-zero {
  grid-column: span 2;
}

.button-function {
  background: #d0d0d0;
  color: #000;
}

.button-operator {
  background: #ff9500;
  color: #fff;
  font-weight: 600;
}

.button-equals {
  background: #ff9500;
}

/* Desktop hover */
@media (hover: hover) and (pointer: fine) {
  .button:hover {
    filter: brightness(0.95);
  }
}

/* Touch/click feedback */
.button:active {
  filter: brightness(0.9);
  transform: scale(0.98);
}

/* Keyboard focus */
.button:focus-visible {
  outline: 2px solid #007AFF;
  outline-offset: -2px;
  z-index: 1;
}

/* Tablet and desktop */
@media (min-width: 768px) {
  .calculator {
    max-width: 400px;
  }

  .button {
    height: 80px;
    font-size: 1.5rem;
  }

  .calculator-display {
    font-size: 3rem;
  }
}
```

### Updated Display Function (main.js)
```javascript
// Source: https://medium.com/@mdsiaofficial/performance-security-and-speed-best-practices-for-efficient-javascript-dom-manipulation-36e0a1723b6c
// Update display element with current calculator value
function updateDisplay() {
  const display = document.getElementById('display');

  // Use textContent (not innerHTML) for XSS safety
  // formatForDisplay() from calculator.js handles scientific notation
  display.textContent = formatForDisplay(calculator.displayValue);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateDisplay();

  // Attach event delegation handler
  const buttonContainer = document.querySelector('.calculator-buttons');
  if (buttonContainer) {
    buttonContainer.addEventListener('click', handleButtonClick);
  }
});

function handleButtonClick(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const { action, value } = button.dataset;

  switch (action) {
    case 'digit':
      inputDigit(value);
      break;
    case 'operator':
      handleOperator(value);
      break;
    case 'decimal':
      inputDecimal();
      break;
    case 'clear':
      resetCalculator();
      break;
    case 'backspace':
      handleBackspace();
      break;
    case 'sign':
      toggleSign();
      break;
    case 'percent':
      handlePercent();
      break;
    default:
      return;
  }

  updateDisplay();
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Float-based layouts | CSS Grid | ~2017 (Grid support stable) | Simpler, more maintainable calculator layouts |
| Individual event listeners | Event delegation | Best practice since ES5 | Reduced memory, better performance |
| jQuery for DOM manipulation | Vanilla JS DOM API | ~2015 (ES6 adoption) | No dependencies, smaller bundle, modern syntax |
| `innerHTML` for text updates | `textContent` for text | Ongoing security awareness | Prevents XSS vulnerabilities |
| Separate hover/active handlers | CSS pseudo-classes + media queries | ~2018 (touch device maturity) | Cleaner CSS, hardware-accelerated |
| Fixed pixel breakpoints | Fluid with max-width | Mobile-first trend (~2012+) | Better cross-device experience |

**Deprecated/outdated:**
- **Float layouts for grids:** Replaced by CSS Grid, which handles 2D layouts natively
- **Vendor prefixes for Grid:** No longer needed in 2026; all modern browsers support unprefixed Grid
- **`:hover` without `@media (hover: hover)`:** Causes sticky hover on mobile; wrap in media query
- **`onclick` attribute:** Use `addEventListener` for cleaner separation of concerns

## Open Questions

Things that couldn't be fully resolved:

1. **Backspace button placement in layout**
   - What we know: iOS calculator puts backspace in top-right (replaces ÷), Android calculators vary
   - What's unclear: Best placement for web calculator with both AC and backspace
   - Recommendation: Follow iOS pattern for v1 (replace AC with backspace after first digit input, similar to AC→C behavior), or add dedicated backspace button row. User testing would determine best UX.

2. **Display font sizing strategy for very long numbers**
   - What we know: `formatForDisplay()` uses scientific notation for 10+ digits; CSS can use `text-overflow: ellipsis` or dynamic `clamp()`
   - What's unclear: Whether ellipsis or scientific notation provides better UX
   - Recommendation: Use scientific notation from `formatForDisplay()` API (already implemented), apply `text-overflow: ellipsis` as CSS fallback for edge cases

3. **Button size for touch targets on mobile**
   - What we know: Apple HIG recommends 44×44pt minimum, Material Design recommends 48×48dp
   - What's unclear: Optimal size for calculator specifically (balance between usability and screen real estate)
   - Recommendation: Use 60px height on mobile (exceeds minimums), 80px on tablet+ for comfortable tapping

## Sources

### Primary (HIGH confidence)
- [MDN: CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout) - CSS Grid fundamentals
- [MDN: Using Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using) - Responsive design
- [MDN: textContent vs innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) - Security considerations
- [MDN: :hover pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:hover) - Touch device handling
- [W3C ARIA Practices: Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/) - Accessibility standards

### Secondary (MEDIUM confidence)
- [Learn CSS Grid by building a simple Calculator Layout](https://freshman.tech/css-grid-calculator/) - Practical calculator grid patterns
- [JavaScript Event Delegation](https://javascript.info/event-delegation) - Event handling patterns
- [Patterns for efficient DOM manipulation with vanilla JavaScript](https://blog.logrocket.com/patterns-efficient-dom-manipulation-vanilla-javascript/) - Performance best practices
- [CSS-Tricks: Truncate String with Ellipsis](https://css-tricks.com/snippets/css/truncate-string-with-ellipsis/) - Display overflow handling
- [Mobile First CSS: Ultimate Guide 2025](https://jpgdesigns.com/mobile-first-css/) - Responsive design approach
- [Explaining the Accessible Benefits of Using Semantic HTML Elements](https://css-tricks.com/explaining-the-accessible-benefits-of-using-semantic-html-elements/) - Button vs div accessibility
- [OWASP: DOM based XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) - Security best practices
- [Finally, a CSS only solution to :hover on touchscreens](https://medium.com/@mezoistvan/finally-a-css-only-solution-to-hover-on-touchscreens-c498af39c31c) - Touch-friendly interactions

### Tertiary (LOW confidence)
- [15+ Test Cases for Calculator](https://www.botgauge.com/blog/test-cases-calculator-complete-guide) - Edge case validation ideas
- [The "Hover Effect" for Mobile Buttons](https://uxmovement.com/mobile/the-hover-effect-for-mobile-buttons/) - Mobile UX patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Vanilla JS/CSS Grid is well-established, no alternative stacks needed
- Architecture: HIGH - Event delegation and CSS Grid patterns are industry standard with extensive documentation
- Pitfalls: HIGH - Common issues well-documented in calculator tutorials and accessibility guides

**Research date:** 2026-02-14
**Valid until:** 2027-02-14 (12 months - stable domain, CSS/JS fundamentals don't change rapidly)
