# Phase 4: Calculation History - Research

**Researched:** 2026-02-14
**Domain:** Browser localStorage persistence & calculation expression tracking
**Confidence:** HIGH

## Summary

Phase 4 adds calculation history to the existing vanilla JavaScript calculator. The primary technical challenge is twofold: (1) extending the current state-only calculator to track complete expressions (e.g., "5 + 3 = 8") for display, and (2) persisting this history across browser sessions using the localStorage API.

The existing calculator stores only operational state (displayValue, firstOperand, operator, waitingForSecondOperand) but does not track full expressions. History requires capturing both the expression string ("5 + 3") and its result ("8") at calculation time, storing these as structured data in localStorage using JSON serialization.

The standard approach uses an array of history entry objects, each containing `expression` and `result` properties. localStorage stores this array as a JSON string, with proper error handling for quota exceeded and security exceptions. The UI displays history in a dedicated panel using simple HTML/CSS, with a clear button to empty the history array.

**Primary recommendation:** Use array of objects as history data structure (`[{expression: "5 + 3", result: "8"}]`), store in localStorage with JSON serialization, add expression tracking to calculator engine before storing to history, implement quota exceeded error handling with try-catch.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| localStorage API | Native (ES5+) | Browser storage for key-value pairs | Built-in, widely supported, perfect for <10MB data |
| JSON.stringify/parse | Native (ES5+) | Serialize objects for localStorage | Only way to store complex data in localStorage |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| DOMException | Native | Error handling for storage | Detect quota exceeded and security errors |
| try-catch blocks | Native (ES3+) | Error boundary for storage operations | Always wrap setItem/getItem calls |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| localStorage | sessionStorage | Data cleared when tab closes (not persistent across sessions) |
| localStorage | IndexedDB | More powerful but overkill for simple history array; adds complexity |
| localStorage | Cookies | 4KB limit, sent with every request, not designed for client-side storage |
| Array of objects | Array of strings | Less flexible; harder to extend with metadata (timestamps, etc.) |

**Installation:**
```bash
# No installation needed - all native browser APIs
```

## Architecture Patterns

### Recommended Project Structure
```
js/
├── calculator.js        # Core calculator engine (existing)
├── history.js           # NEW: History management module
└── main.js             # Event handlers and initialization (existing)

index.html              # Add history panel HTML
css/main.css           # Add history panel styles
```

### Pattern 1: History Data Structure

**What:** Array of calculation entry objects, each with expression and result
**When to use:** Storing calculation history with expression display capability

**Example:**
```javascript
// History entry structure
const historyEntries = [
  { expression: "5 + 3", result: "8" },
  { expression: "10 × 2", result: "20" },
  { expression: "50 - 15", result: "35" }
];
```

### Pattern 2: Expression Tracking Extension

**What:** Extend calculator state to track expression string alongside state
**When to use:** When current state object doesn't store displayable expressions

**Example:**
```javascript
// Add to calculator state object
const calculator = {
  displayValue: '0',
  firstOperand: null,
  operator: null,
  waitingForSecondOperand: false,
  // NEW: Track expression for history
  currentExpression: ''
};

// Build expression string during operation
function handleOperator(nextOperator) {
  // ... existing logic ...

  // Track expression
  if (calculator.firstOperand !== null && calculator.operator && nextOperator === '=') {
    const expression = `${calculator.firstOperand} ${calculator.operator} ${calculator.displayValue}`;
    const result = calculator.displayValue;
    addToHistory(expression, result);
  }
}
```

### Pattern 3: localStorage Wrapper with Error Handling

**What:** Safe wrapper around localStorage operations with quota/security error handling
**When to use:** All localStorage read/write operations

**Example:**
```javascript
// Source: https://mmazzarolo.com/blog/2022-06-25-local-storage-status/
function isQuotaExceededError(err) {
  return (
    err instanceof DOMException &&
    (err.code === 22 ||
     err.code === 1014 ||
     err.name === 'QuotaExceededError' ||
     err.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  );
}

function isStorageSupported(type = 'localStorage') {
  let storage;
  try {
    storage = window[type];
    if (!storage) return false;
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (err) {
    return isQuotaExceededError(err) && storage.length > 0;
  }
}

// Use pattern
if (!isStorageSupported()) {
  console.warn('localStorage not available');
  // Fall back to in-memory storage
  return;
}

try {
  localStorage.setItem('calc_history', JSON.stringify(history));
} catch (err) {
  if (isQuotaExceededError(err)) {
    // Handle quota exceeded - perhaps clear old entries
    console.warn('Storage quota exceeded');
  }
}
```

### Pattern 4: History Management Module

**What:** Separate module for history operations (add, clear, load, save)
**When to use:** Keep calculator.js focused on calculation logic

**Example:**
```javascript
// history.js module
const HISTORY_KEY = 'calc_history_v1';
const MAX_HISTORY_ENTRIES = 50; // Prevent unbounded growth

function loadHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.warn('Failed to load history', err);
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    if (isQuotaExceededError(err)) {
      // Trim to half capacity and retry
      const trimmed = history.slice(-Math.floor(MAX_HISTORY_ENTRIES / 2));
      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    }
  }
}

function addToHistory(expression, result) {
  const history = loadHistory();
  history.push({ expression, result });

  // Enforce max entries (FIFO)
  if (history.length > MAX_HISTORY_ENTRIES) {
    history.shift();
  }

  saveHistory(history);
  renderHistory();
}

function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  } catch (err) {
    console.warn('Failed to clear history', err);
  }
}
```

### Anti-Patterns to Avoid

- **Storing on every button press:** Only store completed calculations (when `=` is pressed), not intermediate state
- **Not handling parse errors:** Always wrap `JSON.parse()` in try-catch; corrupted data will throw
- **Unbounded history growth:** Implement max entries limit to prevent localStorage quota issues
- **Using eval() for expression tracking:** Never use `eval()` - build expression strings manually for security
- **Storing sensitive data:** localStorage is not secure; only store non-sensitive calculation history

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Storage quota detection | Custom size calculation | `isQuotaExceededError()` pattern | Browsers throw different error codes (22, 1014) and names |
| Browser support detection | Simple `if (localStorage)` check | Test with actual setItem/getItem | Private browsing modes can have localStorage object but throw on use |
| JSON serialization errors | Assume JSON.parse always works | Wrap in try-catch with fallback | Corrupted data or manual editing breaks parsing |
| Expression evaluation | Using `eval()` on strings | Manual expression building from state | Security risk; eval can execute arbitrary code |

**Key insight:** localStorage appears simple but has cross-browser edge cases (quota exceeded error codes, private browsing, security exceptions) that require defensive programming patterns established by the community.

## Common Pitfalls

### Pitfall 1: Forgetting JSON Serialization

**What goes wrong:** Attempting to store objects directly without JSON.stringify
**Why it happens:** localStorage API accepts values silently but calls `.toString()` on objects, resulting in `"[object Object]"`
**How to avoid:** Always use `JSON.stringify()` before setItem and `JSON.parse()` after getItem for objects/arrays
**Warning signs:** History loads but shows "[object Object]" or undefined when accessed

### Pitfall 2: Not Tracking Full Expressions

**What goes wrong:** History shows only results (e.g., "8") without expressions (e.g., "5 + 3")
**Why it happens:** Current calculator state doesn't build expression strings; only tracks operands/operators separately
**How to avoid:** Add expression-building logic that captures `firstOperand operator displayValue` before storing to history
**Warning signs:** Can display results but can't show what calculation produced them

### Pitfall 3: Quota Exceeded Without Error Handling

**What goes wrong:** Application crashes when localStorage quota is exceeded (typically 5-10MB)
**Why it happens:** localStorage.setItem throws DOMException when quota exceeded; unhandled exception stops execution
**How to avoid:** Wrap all setItem calls in try-catch, detect quota errors, implement max entry limits
**Warning signs:** App works initially but crashes after many calculations; errors in console about quota

### Pitfall 4: Private Browsing Mode Failures

**What goes wrong:** localStorage exists but throws SecurityError on setItem in private/incognito mode
**Why it happens:** Some browsers disable persistence in private mode while keeping the API accessible
**How to avoid:** Test storage with actual setItem operation in support detection function, not just `if (window.localStorage)`
**Warning signs:** Works in normal mode but fails silently in private browsing; no errors shown to user

### Pitfall 5: Not Preventing Duplicate Entries

**What goes wrong:** Same calculation appears multiple times in history (e.g., "5 + 5 = 10" repeated)
**Why it happens:** User clicks `=` multiple times or recalculates same expression
**How to avoid:** Either allow duplicates (chronological log) or check if last entry matches before adding
**Warning signs:** History list grows rapidly with identical entries; user confusion about duplicate calculations

### Pitfall 6: Cross-Tab Synchronization

**What goes wrong:** History changes in one tab don't appear in other tabs
**Why it happens:** localStorage changes don't automatically trigger re-renders; need storage event listener
**Why it's acceptable for v1:** Requirements don't mandate cross-tab sync; consider for v2
**How to address later:** Listen to `storage` event on window to sync across tabs

## Code Examples

Verified patterns from official sources:

### Basic localStorage CRUD Operations

```javascript
// Store history
const history = [
  { expression: "5 + 3", result: "8" }
];
localStorage.setItem('calc_history', JSON.stringify(history));

// Retrieve history
const stored = localStorage.getItem('calc_history');
const history = stored ? JSON.parse(stored) : [];

// Clear history
localStorage.removeItem('calc_history');

// Clear ALL localStorage (nuclear option)
localStorage.clear();
```

### Safe Storage Check Pattern

```javascript
// Source: https://mmazzarolo.com/blog/2022-06-25-local-storage-status/
function isStorageSupported(type = 'localStorage') {
  let storage;
  try {
    storage = window[type];
    if (!storage) return false;
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (err) {
    const isValidQuotaExceededError =
      isQuotaExceededError(err) && storage && storage.length > 0;
    return isValidQuotaExceededError;
  }
}
```

### Complete History Module Pattern

```javascript
// history.js
const HISTORY_KEY = 'calc_history_v1';
const MAX_ENTRIES = 50;

let historyCache = null;

function loadHistory() {
  if (historyCache !== null) return historyCache;

  if (!isStorageSupported()) {
    historyCache = [];
    return historyCache;
  }

  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    historyCache = stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.warn('Failed to load history, using empty array', err);
    historyCache = [];
  }

  return historyCache;
}

function saveHistory(history) {
  historyCache = history;

  if (!isStorageSupported()) {
    console.warn('Storage not supported, history not persisted');
    return false;
  }

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (err) {
    if (isQuotaExceededError(err)) {
      // Trim to half capacity and retry
      const trimmed = history.slice(-Math.floor(MAX_ENTRIES / 2));
      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
      return true;
    }
    console.error('Failed to save history', err);
    return false;
  }
}

function addToHistory(expression, result) {
  const history = loadHistory();
  history.push({ expression, result });

  if (history.length > MAX_ENTRIES) {
    history.shift(); // Remove oldest
  }

  saveHistory(history);
  renderHistory();
}

function clearHistory() {
  historyCache = [];
  if (isStorageSupported()) {
    localStorage.removeItem(HISTORY_KEY);
  }
  renderHistory();
}

function renderHistory() {
  const history = loadHistory();
  const container = document.getElementById('history-list');

  if (!container) return;

  if (history.length === 0) {
    container.innerHTML = '<p class="history-empty">No calculations yet</p>';
    return;
  }

  container.innerHTML = history
    .map(entry => `
      <div class="history-entry">
        <div class="history-expression">${escapeHtml(entry.expression)}</div>
        <div class="history-result">${escapeHtml(entry.result)}</div>
      </div>
    `)
    .join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

### Expression Tracking in Calculator

```javascript
// Extend handleOperator in calculator.js
function handleOperator(nextOperator) {
  const inputValue = parseFloat(calculator.displayValue);

  if (calculator.firstOperand === null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (calculator.operator) {
    const result = performCalculation();

    // NEW: Track completed calculation for history
    if (nextOperator === '=' && calculator.operator && calculator.firstOperand !== null) {
      const expression = `${calculator.firstOperand} ${calculator.operator} ${calculator.displayValue}`;
      addToHistory(expression, String(result));
    }

    calculator.displayValue = String(result);
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}
```

### HTML Structure for History Panel

```html
<!-- Add to index.html -->
<div class="calculator-container">
  <div class="calculator">
    <!-- Existing calculator HTML -->
  </div>

  <div class="history-panel">
    <div class="history-header">
      <h2>History</h2>
      <button type="button" class="history-clear" onclick="clearHistory()">Clear</button>
    </div>
    <div id="history-list" class="history-list">
      <!-- Dynamically populated by renderHistory() -->
    </div>
  </div>
</div>
```

### CSS for History Panel (Basic Responsive Pattern)

```css
/* Mobile-first: stacked layout */
.calculator-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.history-panel {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
}

.history-entry {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
}

.history-empty {
  text-align: center;
  color: #999;
}

/* Desktop: side-by-side layout */
@media (min-width: 768px) {
  .calculator-container {
    flex-direction: row;
    max-width: 1000px;
  }

  .calculator {
    flex: 0 0 400px;
  }

  .history-panel {
    flex: 1;
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Cookies for client storage | localStorage/sessionStorage | HTML5 (2014) | 5-10MB vs 4KB; no automatic server transmission |
| Manual browser detection | Feature detection with actual test | ~2015 | Catches private browsing and quota issues reliably |
| `if (localStorage)` check | `isStorageSupported()` with setItem test | ~2020 | Handles SecurityError in private mode correctly |
| Unbounded arrays | Max entries with FIFO trimming | Best practice since 2016 | Prevents quota exceeded errors |
| Single try-catch around all code | Granular try-catch per storage operation | Modern practice | Better error isolation and recovery |

**Deprecated/outdated:**
- **IE8 userData behavior**: Legacy IE storage mechanism; irrelevant for modern browsers (2026 baseline: ES6+)
- **Global `storage` polyfills**: No longer needed; all modern browsers support localStorage natively since ~2015
- **eval() for expression parsing**: Security risk; modern calculators build expression strings from state

## Open Questions

Things that couldn't be fully resolved:

1. **localStorage vs sessionStorage for v1**
   - What we know: Roadmap says "History persists across browser sessions using localStorage" in success criteria
   - What's unclear: REQUIREMENTS.md lists HIST-03 (localStorage persistence) as v2, not v1
   - Recommendation: Clarify with user. If strict v1 compliance needed, use in-memory only (no persistence) and add localStorage in Phase 4.1. If roadmap intent is correct, implement localStorage now.

2. **History UI layout: separate panel vs dropdown**
   - What we know: Common patterns show both approaches (side panel on desktop, bottom panel on mobile)
   - What's unclear: User hasn't specified preference for UI layout
   - Recommendation: Default to simple approach: bottom panel on mobile (stacked), side panel on desktop (flexbox), show/hide toggle button. Can iterate based on feedback.

3. **Duplicate calculation handling**
   - What we know: Calculator allows repeated `=` presses on same operation
   - What's unclear: Should "5 + 5 = 10" appear multiple times if user clicks `=` three times?
   - Recommendation: Allow duplicates (chronological log approach) for v1; users might intentionally recalculate. Add "prevent duplicates" toggle in v2 if needed.

4. **Expression format for special operations**
   - What we know: Percent and sign operations don't fit "A op B = C" pattern
   - What's unclear: How to display "50%" or "+/-" in history
   - Recommendation: Only track history for binary operations (+, -, ×, ÷) in v1. Skip unary operations (%, +/-) as they're transformations, not calculations.

## Sources

### Primary (HIGH confidence)

- [MDN - Window: localStorage property](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) - Official Web API documentation for localStorage
- [MDN - Client-side storage](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Client-side_storage) - Best practices guide
- [Matteo Mazzarolo - Handling localStorage errors](https://mmazzarolo.com/blog/2022-06-25-local-storage-status/) - Error handling pattern with code
- [Freshman.tech - How to build a Calculator App](https://freshman.tech/calculator/) - Calculator state structure explanation

### Secondary (MEDIUM confidence)

- [LogRocket - localStorage in JavaScript: A complete guide](https://blog.logrocket.com/localstorage-javascript-complete-guide/) - Best practices verified against MDN
- [Maxim Maeder - Calculator with History Function](https://maximmaeder.com/calculator-with-history-function-in-html-css-and-javascript/) - Practical implementation example
- [Medium - What I learned designing a calculator UI](https://medium.com/@kmerchant/what-i-learned-designing-a-calculator-ui-9358a3112445) - UI design patterns
- [Muzli - 60+ Best Calculator Designs](https://muz.li/inspiration/calculator-design/) - Design pattern research

### Tertiary (LOW confidence)

- Various GitHub calculator repositories - Code pattern validation only
- W3Schools localStorage reference - Supplementary, verified against MDN

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - localStorage is native browser API with extensive documentation and established patterns
- Architecture: HIGH - History module pattern is well-established; expression tracking approach verified in multiple implementations
- Pitfalls: HIGH - Error handling patterns verified from production code; quota/security issues well-documented

**Research date:** 2026-02-14
**Valid until:** 2027-02-14 (30 days for API patterns, but localStorage API is stable since HTML5)
**Note:** localStorage API is mature and stable; patterns unlikely to change significantly in near future
