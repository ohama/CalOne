# Phase 3: Keyboard Support - Research

**Researched:** 2026-02-14
**Domain:** Vanilla JavaScript Keyboard Event Handling
**Confidence:** HIGH

## Summary

Keyboard event handling in vanilla JavaScript is a mature, well-documented domain with standardized APIs across all modern browsers. The research focused on identifying the modern standard approach (using `event.key` with `keydown` events), understanding accessibility requirements for keyboard-only users, and cataloguing common pitfalls specific to calculator-style input applications.

The standard approach is to attach a single `keydown` event listener to `document` or `window`, map key values to calculator actions, and reuse existing calculator functions. The deprecated `keyCode` property should be avoided in favor of the `event.key` property, which has been widely supported since March 2017.

For this calculator implementation, keyboard support can be added with minimal code by creating a keyboard event handler that maps keys to the existing button click handler's action/value pattern, or directly calls calculator functions. Focus management is already handled by the semantic `<button>` elements and existing `:focus-visible` CSS.

**Primary recommendation:** Use `document.addEventListener('keydown', handler)` with `event.key` property to map keys to calculator actions, and call `event.preventDefault()` for handled keys to avoid browser default behavior.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JS | ES6+ (2015+) | Native keyboard event handling | No libraries needed - KeyboardEvent API is standardized across browsers since 2015 |
| KeyboardEvent.key | Baseline (2017+) | Key identification property | Widely supported modern standard replacing deprecated keyCode |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| N/A | - | No supporting libraries needed | Vanilla JS is sufficient for basic keyboard input |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vanilla JS | Mousetrap, HotKeys.js | Only needed for complex keyboard shortcuts (Ctrl+combinations, sequences) - overkill for simple calculator |
| event.key | event.code | Use `code` for games/physical position needs; `key` is better for character-based input like calculators |
| document listener | input element listener | Calculator has no text input field; document-level listener works globally |

**Installation:**
```bash
# No installation needed - native browser APIs
```

## Architecture Patterns

### Recommended Project Structure
```
js/
├── calculator.js    # Calculator engine (existing)
├── main.js          # Event handlers (existing + keyboard handler)
└── (no new files needed)
```

### Pattern 1: Global Keyboard Handler
**What:** Single event listener on document/window that maps keys to actions
**When to use:** When keyboard input should work anywhere on the page (not just in a text field)
**Example:**
```javascript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
document.addEventListener('keydown', (event) => {
  // Check if event was already handled
  if (event.defaultPrevented) {
    return;
  }

  switch (event.key) {
    case '0': case '1': case '2': case '3': case '4':
    case '5': case '6': case '7': case '8': case '9':
      inputDigit(event.key);
      break;
    case '+': case '-': case '*': case '/':
      handleOperator(mapKeyToOperator(event.key));
      break;
    case 'Enter':
      handleOperator('=');
      break;
    case 'Escape':
      resetCalculator();
      break;
    case 'Backspace':
      handleBackspace();
      break;
    case '.':
      inputDecimal();
      break;
    default:
      return; // Quit when key is not handled
  }

  // Prevent default browser behavior for handled keys
  event.preventDefault();
  updateDisplay();
});
```

### Pattern 2: Key Mapping Function
**What:** Helper function to map keyboard symbols to calculator display symbols
**When to use:** When keyboard input differs from display representation (e.g., `*` → `×`, `/` → `÷`)
**Example:**
```javascript
function mapKeyToOperator(key) {
  const operatorMap = {
    '*': '×',
    '/': '÷',
    '+': '+',
    '-': '-'
  };
  return operatorMap[key] || key;
}
```

### Pattern 3: Reuse Existing Handler (Alternative)
**What:** Programmatically trigger existing button click handler from keyboard
**When to use:** When you want to completely reuse button click logic without duplication
**Example:**
```javascript
document.addEventListener('keydown', (event) => {
  const buttonSelector = getButtonSelector(event.key);
  if (!buttonSelector) return;

  const button = document.querySelector(buttonSelector);
  if (button) {
    button.click(); // Programmatically trigger existing handler
    event.preventDefault();
  }
});
```

### Anti-Patterns to Avoid
- **Using `keypress` event:** Deprecated and inconsistent across browsers - use `keydown` instead
- **Using `keyCode` property:** Deprecated since 2017 - use `event.key` instead
- **Not calling `preventDefault()`:** Browser may execute default behavior (e.g., Backspace navigates back)
- **Attaching listener to specific element instead of document:** Won't work when focus is elsewhere
- **Checking `event.repeat` and ignoring repeats:** Creates bad UX - users expect held keys to repeat

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Complex keyboard shortcuts (Ctrl+combinations, sequences) | Custom key combination parser | Mousetrap.js or HotKeys.js | Edge cases: modifier key order, cross-platform differences, conflict detection |
| International keyboard layouts | Custom key mapping for all locales | `event.key` (not `event.code`) | Handles AZERTY, QWERTY, Dvorak automatically |
| Focus trap management | Custom focus cycling logic | Native `<dialog>` element with inert attribute | Browser handles focus trap, Escape key, accessibility |

**Key insight:** For simple calculator keyboard input (alphanumeric + basic keys), native APIs are sufficient. Only reach for libraries when implementing complex shortcuts or focus management patterns.

## Common Pitfalls

### Pitfall 1: Using Deprecated `keyCode` Property
**What goes wrong:** Code uses `event.keyCode === 13` instead of `event.key === 'Enter'`
**Why it happens:** Old tutorials and Stack Overflow answers from pre-2017 era still use keyCode
**How to avoid:** Always use `event.key` property for modern browsers (supported since March 2017)
**Warning signs:** Numeric codes in keyboard handler (e.g., `13`, `27`, `8`) instead of readable strings

### Pitfall 2: Forgetting `preventDefault()` on Handled Keys
**What goes wrong:** Pressing Backspace deletes calculator input AND navigates browser back
**Why it happens:** Browser executes default behavior unless explicitly prevented
**How to avoid:** Call `event.preventDefault()` after successfully handling a key
**Warning signs:** Browser navigation, text selection, or other default behaviors during keyboard use

### Pitfall 3: Duplicate Input from Multiple Listeners
**What goes wrong:** Same key press handled by both keyboard listener and button click listener
**Why it happens:** Keyboard handler calls `button.click()` which triggers existing click listener
**How to avoid:** Either map keys to actions directly OR programmatically click buttons, not both
**Warning signs:** Double input on keyboard press, incorrect calculator state

### Pitfall 4: Not Checking `event.defaultPrevented`
**What goes wrong:** Multiple handlers process the same event
**Why it happens:** Event bubbles through multiple listeners
**How to avoid:** Check `if (event.defaultPrevented) return;` at start of handler
**Warning signs:** Unexpected side effects, functions called multiple times per keypress

### Pitfall 5: Handling Keys When Focus is in Input Fields
**What goes wrong:** Typing in a hypothetical form field triggers calculator actions
**Why it happens:** Document-level listener captures all keyboard events globally
**How to avoid:** Check `event.target.tagName` - ignore if target is INPUT, TEXTAREA, or contenteditable
**Warning signs:** Calculator responds to typing in unrelated form fields (not applicable to this project - no input fields)

### Pitfall 6: Using `keyup` Instead of `keydown`
**What goes wrong:** Delayed response - action triggers when key is released instead of pressed
**Why it happens:** Confusion about event timing
**How to avoid:** Use `keydown` for immediate response (standard for most UIs)
**Warning signs:** Calculator feels sluggish, users complain about delayed response

## Code Examples

Verified patterns from official sources:

### Basic Keyboard Handler with event.key
```javascript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
window.addEventListener('keydown', (event) => {
  if (event.defaultPrevented) {
    return;
  }

  switch (event.key) {
    case 'Enter':
      // Handle enter key
      break;
    case 'Escape':
      // Handle escape key
      break;
    case 'Backspace':
      // Handle backspace
      break;
    case ' ':
      // Handle space key (note: single space string)
      break;
    default:
      return; // Quit when this doesn't handle the key event
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);
```

### Checking for Modifier Keys
```javascript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
document.addEventListener('keydown', (event) => {
  const keyName = event.key;

  if (keyName === 'Control') {
    return; // Do nothing if only Control key
  }

  if (event.ctrlKey) {
    alert(`Combination of ctrlKey + ${keyName}`);
  } else {
    alert(`Key pressed ${keyName}`);
  }
});
```

### Handling Auto-Repeat (Key Held Down)
```javascript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat
document.addEventListener('keydown', (event) => {
  if (event.repeat) {
    // Key is being held down
    // For calculator: allow repeat (user can hold backspace to delete)
  }

  // Handle key press
  handleKey(event.key);
});
```

### Calculator-Specific Pattern
```javascript
// Combining patterns for calculator
document.addEventListener('keydown', (event) => {
  // Guard: already handled
  if (event.defaultPrevented) {
    return;
  }

  let handled = false;

  // Numbers 0-9
  if (event.key >= '0' && event.key <= '9') {
    inputDigit(event.key);
    handled = true;
  }
  // Operators
  else if (['+', '-', '*', '/'].includes(event.key)) {
    const operatorMap = { '*': '×', '/': '÷' };
    handleOperator(operatorMap[event.key] || event.key);
    handled = true;
  }
  // Special keys
  else {
    switch (event.key) {
      case 'Enter':
      case '=':
        handleOperator('=');
        handled = true;
        break;
      case 'Escape':
        resetCalculator();
        handled = true;
        break;
      case 'Backspace':
        handleBackspace();
        handled = true;
        break;
      case '.':
        inputDecimal();
        handled = true;
        break;
    }
  }

  if (handled) {
    event.preventDefault();
    updateDisplay();
  }
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `event.keyCode` | `event.key` | Deprecated 2017 | Must use `event.key` for modern code |
| `keypress` event | `keydown` event | Firefox 65 (2019) | `keypress` no longer fires for non-printable keys |
| `event.which` | `event.key` | Deprecated 2017 | jQuery legacy - avoid in vanilla JS |
| Numeric key codes | String key values | 2017+ standard | Code is more readable: `'Enter'` vs `13` |

**Deprecated/outdated:**
- `keyCode`: Deprecated - inconsistent across platforms and keyboard layouts
- `charCode`: Deprecated - only worked for printable characters
- `keyIdentifier`: Never standardized, removed from spec
- `keypress`: Deprecated - doesn't fire for non-printable keys in modern browsers
- `which`: jQuery-era property - superseded by `key` and `code`

## Open Questions

Things that couldn't be fully resolved:

1. **Auto-repeat behavior preference**
   - What we know: `event.repeat` property indicates if key is being held down
   - What's unclear: Whether calculator should allow auto-repeat for number keys (could lead to unintended input)
   - Recommendation: Allow auto-repeat for Backspace (common UX), optionally filter `event.repeat === true` for digits/operators to prevent accidental input

2. **NumPad key handling**
   - What we know: NumPad keys have same `event.key` values as main keyboard numbers ('0'-'9', '+', '-', '*', '/')
   - What's unclear: Whether NumPad Enter should behave differently than main Enter
   - Recommendation: Treat NumPad keys identically to main keyboard - no special handling needed

## Sources

### Primary (HIGH confidence)
- [MDN - KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) - Complete KeyboardEvent interface documentation
- [MDN - KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) - Key property specification and examples
- [MDN - keydown event](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event) - Event type documentation
- [MDN - KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) - Physical key code property
- [WebAIM - Keyboard Accessibility](https://webaim.org/techniques/keyboard/) - Accessibility best practices
- [MDN - Keyboard-navigable JavaScript widgets](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Keyboard-navigable_JavaScript_widgets) - ARIA and focus management

### Secondary (MEDIUM confidence)
- [Smashing Magazine - Guide To Keyboard Accessibility: JavaScript](https://www.smashingmagazine.com/2022/11/guide-keyboard-accessibility-javascript-part2/) - Best practices for interactive widgets
- [JavaScript.info - Keyboard: keydown and keyup](https://javascript.info/keyboard-events) - Tutorial with examples
- [Chrome Developers Blog - KeyboardEvents: Keys and Codes](https://developer.chrome.com/blog/keyboardevent-keys-codes) - History of key property introduction

### Tertiary (LOW confidence)
- Various Medium articles and Stack Overflow discussions - Used for pattern validation only

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - KeyboardEvent API is well-established, stable, and standardized since 2015
- Architecture: HIGH - Pattern is straightforward document listener with switch statement
- Pitfalls: HIGH - Verified from MDN docs and WebAIM accessibility guidelines

**Research date:** 2026-02-14
**Valid until:** 2027-02-14 (12 months - stable API, unlikely to change)
