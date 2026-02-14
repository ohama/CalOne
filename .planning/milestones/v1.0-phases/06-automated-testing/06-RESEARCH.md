# Phase 6: Automated Testing - Research

**Researched:** 2026-02-14
**Domain:** Automated testing for vanilla JavaScript browser applications
**Confidence:** HIGH

## Summary

This research investigates automated testing approaches for a vanilla JavaScript calculator application that has no build tools, no npm setup, and targets GitHub Pages deployment. The project has three main JavaScript files (calculator.js, history.js, main.js) containing pure calculation functions, localStorage-dependent history management, and DOM event handlers respectively.

The standard approach for modern JavaScript testing in 2026 is **Vitest with browser mode**, which has become the de facto testing framework replacing Jest. Vitest can work as a standalone testing framework (without requiring Vite as the build tool) and offers true browser testing through Playwright or WebDriver providers. This allows testing of browser-specific APIs like localStorage and DOM manipulation without simulation limitations of jsdom/happy-dom.

For this project, the testing strategy should combine **unit tests for pure functions** (calculation logic) and **browser-mode integration tests** for DOM and localStorage features. This requires introducing npm/package.json to the project, but tests will run headlessly from command line without human interaction. The project source files remain vanilla with no build step required for deployment.

**Primary recommendation:** Use Vitest v4+ with Playwright browser provider for automated testing that covers pure functions, localStorage persistence, and DOM interactions without build tooling for the source code itself.

## Standard Stack

The established libraries/tools for automated JavaScript testing in 2026:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vitest | 4.x+ | Test framework and runner | Industry standard for 2026, 2-10x faster than Jest, native ESM support, browser mode graduated to stable |
| @vitest/browser-playwright | 4.x+ | Browser testing provider | Official Vitest browser provider, supports parallel execution, cross-browser testing |
| @vitest/coverage-v8 | 4.x+ | Code coverage reporting | Native V8 coverage with AST remapping for accuracy matching Istanbul |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| playwright | Latest | Browser automation engine | Required by @vitest/browser-playwright for actual browser testing |
| @vitest/ui | 4.x+ | Visual test dashboard | Optional, for local development test visualization |
| happy-dom | Latest | Lightweight DOM simulation | Alternative to browser mode for faster pure-DOM tests (not needed if using browser mode) |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vitest | Jest | Jest is legacy (slower, requires more config), but mature ecosystem and better for React Native |
| Playwright provider | WebdriverIO | Similar capabilities, slightly broader browser support, but Playwright recommended by Vitest team |
| Browser mode | jsdom/happy-dom | Faster test execution, but doesn't test real browser APIs (localStorage issues in Node v25+) |
| Vitest | Custom test framework | Much simpler to build, but lacks coverage reporting, parallel execution, CI integration |

**Installation:**
```bash
# Initialize npm in project (creates package.json)
npm init -y

# Install Vitest with browser mode and Playwright
npm install -D vitest @vitest/browser-playwright playwright @vitest/coverage-v8
```

**Note:** Source code files remain vanilla JavaScript with no build step. Only test infrastructure requires npm.

## Architecture Patterns

### Recommended Project Structure

```
cal/
├── js/                          # Source files (vanilla JS, no build)
│   ├── calculator.js            # Pure calculation functions
│   ├── history.js               # localStorage-dependent features
│   └── main.js                  # DOM event handlers
├── tests/                       # Test files
│   ├── calculator.test.js       # Unit tests for pure functions
│   ├── history.test.js          # Browser-mode tests for localStorage
│   └── integration.test.js      # Full integration tests with DOM
├── index.html                   # Entry point (unchanged)
├── package.json                 # NEW: npm metadata and scripts
├── vitest.config.js             # NEW: Test configuration
└── .github/
    └── workflows/
        └── test.yml             # NEW: CI workflow for automated testing
```

### Pattern 1: Separate Pure Function Tests from Browser Tests

**What:** Vitest supports multiple test environments in the same project. Pure calculation functions can use default node environment while browser-dependent features use browser mode.

**When to use:** When project has mix of pure logic and browser APIs (like this calculator project).

**Example:**
```javascript
// tests/calculator.test.js
// Pure function tests run in Node environment (faster)
import { describe, it, expect } from 'vitest'
import { inputDigit, performCalculation, handlePercent } from '../js/calculator.js'

describe('Calculator pure functions', () => {
  it('should add two numbers correctly', () => {
    // Test without browser dependencies
    const result = performCalculation()
    expect(result).toBe(3)
  })
})
```

```javascript
// tests/history.test.js
// Browser tests use real localStorage
// @vitest-environment browser
import { describe, it, expect, beforeEach } from 'vitest'
import { addToHistory, loadHistory, clearHistory } from '../js/history.js'

describe('History with localStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should persist history to localStorage', () => {
    addToHistory('2 + 2', '4')
    const history = loadHistory()
    expect(history).toHaveLength(1)
    expect(history[0].expression).toBe('2 + 2')
  })
})
```

### Pattern 2: Browser Mode Configuration

**What:** Configure Vitest to run tests in actual browsers using Playwright provider.

**When to use:** For testing browser APIs (localStorage, DOM, window globals) that need real browser environment.

**Example:**
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Browser mode configuration
    browser: {
      enabled: true,
      provider: 'playwright',
      name: 'chromium',
      headless: true,
    },
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['js/**/*.js'],
      exclude: ['js/main.js'], // Exclude DOM-heavy files if needed
    },
  },
})
```

### Pattern 3: Testing localStorage with Real Browser APIs

**What:** Use browser mode to test localStorage without mocks, ensuring real browser behavior.

**When to use:** When testing browser storage APIs, quota errors, or cross-session persistence.

**Example:**
```javascript
// tests/history.test.js
// @vitest-environment browser
import { describe, it, expect, beforeEach } from 'vitest'

describe('localStorage persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should handle quota exceeded errors gracefully', () => {
    // Fill localStorage to trigger quota
    const largeData = new Array(10000).fill('test')

    // Test graceful degradation
    const result = saveHistory(largeData)
    expect(result).toBe(false) // Should fail gracefully
  })
})
```

### Anti-Patterns to Avoid

- **Testing implementation details instead of behavior:** Don't test internal state variables; test observable behavior (display updates, history entries)
- **Mocking localStorage in Node environment:** Use browser mode instead of localStorage mocks (vitest-localstorage-mock). Real browser APIs are more reliable in 2026.
- **Single monolithic test file:** Split tests by concern (pure functions vs. browser features vs. integration)
- **Not resetting state between tests:** Always clear calculator state and localStorage in beforeEach hooks
- **Testing framework code:** Don't test that Vitest works; test that your calculator works

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Test runner | Custom test framework with console.log | Vitest | Parallel execution, watch mode, coverage reporting, CI integration all built-in |
| Code coverage | Manual tracking of tested functions | @vitest/coverage-v8 | Accurate line/branch/statement coverage with HTML reports |
| Browser automation | Manual Selenium scripts | Playwright via Vitest browser mode | Headless testing, auto-wait, parallel execution, cross-browser support |
| localStorage mocking | Custom mock objects | Real browser (browser mode) | Avoids Node.js v25+ Web Storage API conflicts, tests actual browser behavior |
| Assertion library | if/throw statements | Vitest's expect() | Readable failures, type safety, comprehensive matchers |
| CI integration | Custom bash scripts | GitHub Actions workflow | Matrix testing, caching, artifact uploads, status badges |

**Key insight:** Modern testing frameworks like Vitest provide comprehensive solutions for test execution, coverage, browser simulation, and CI integration. Custom solutions miss edge cases (parallel test isolation, async handling, memory leaks) and lack tooling ecosystem.

## Common Pitfalls

### Pitfall 1: Introducing Build Tools When Not Needed

**What goes wrong:** Developers add Vite/webpack for bundling source code when adopting Vitest, breaking the vanilla JS + GitHub Pages deployment model.

**Why it happens:** Vitest is "powered by Vite" which sounds like Vite is required for the application itself.

**How to avoid:** Use Vitest as standalone test framework. Source files (js/*.js) remain vanilla with script tags in HTML. Only tests use npm/Vitest infrastructure. Add `/node_modules` and `/coverage` to .gitignore. GitHub Pages deployment serves vanilla files directly.

**Warning signs:** If you're adding build scripts to package.json for the source code, you've gone too far.

### Pitfall 2: localStorage Testing Issues with jsdom/happy-dom

**What goes wrong:** Tests using jsdom or happy-dom environment fail with localStorage.getItem is not a function in Node.js v25+.

**Why it happens:** Node.js v25.0.0 enabled Web Storage API by default, causing conflicts with DOM simulators.

**How to avoid:** Use browser mode with Playwright provider instead of jsdom/happy-dom. Browser mode tests run in real browser with actual localStorage. For projects requiring jsdom, set NODE_OPTIONS="--no-webstorage" environment variable.

**Warning signs:** Test errors mentioning "localStorage is not defined" or "getItem is not a function" when using jsdom/happy-dom.

### Pitfall 3: Not Testing Browser-Specific Behavior

**What goes wrong:** Unit tests pass but integration fails because tests don't cover DOM event handling, localStorage quotas, or browser API edge cases.

**Why it happens:** Developers stick to simple unit tests for pure functions and skip integration tests because they're "harder to set up."

**How to avoid:** Use Vitest browser mode for integration tests. Test that clicking buttons updates display, that history persists across page reloads, that quota errors are handled. Write integration tests alongside unit tests.

**Warning signs:** High test coverage numbers but bugs appear in production related to user interactions or persistence.

### Pitfall 4: Forgetting to Reset State Between Tests

**What goes wrong:** Tests pass individually but fail when run together. Test order affects results.

**Why it happens:** Calculator state (calculator.displayValue, calculator.operator) and localStorage persist across tests.

**How to avoid:** Use beforeEach hooks to reset calculator state and clear localStorage before each test. Import and call resetCalculator() at start of each test.

**Warning signs:** Tests pass with `.only` but fail in full suite. Different results when running tests in different order.

### Pitfall 5: Testing Private Implementation Instead of Public API

**What goes wrong:** Tests break when refactoring even though behavior is unchanged.

**Why it happens:** Tests check internal state variables (calculator.waitingForSecondOperand) instead of observable behavior (display shows "5").

**How to avoid:** Test through public API. For calculator: test display values, history entries, error messages. Don't access internal state unless necessary for debugging.

**Warning signs:** Every refactor requires updating tests even when user-facing behavior is unchanged.

## Code Examples

Verified patterns from official sources and research:

### Basic Vitest Configuration for Vanilla JS Project

```javascript
// vitest.config.js
// Source: https://vitest.dev/guide/
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Default environment for pure function tests
    environment: 'node',

    // Browser mode for integration tests
    browser: {
      enabled: true,
      provider: 'playwright',
      name: 'chromium',
      headless: true,
    },

    // Coverage settings
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['js/**/*.js'],
      exclude: ['js/main.js'], // Adjust as needed
      all: true,
    },

    // Test file patterns
    include: ['tests/**/*.test.js'],
  },
})
```

### Unit Test for Pure Calculator Functions

```javascript
// tests/calculator.test.js
// Source: https://vitest.dev/guide/
import { describe, it, expect, beforeEach } from 'vitest'
// Note: May need to adjust imports based on how calculator.js exports functions

describe('Calculator arithmetic operations', () => {
  beforeEach(() => {
    // Reset calculator state before each test
    resetCalculator()
  })

  it('should add two numbers correctly', () => {
    inputDigit('2')
    handleOperator('+')
    inputDigit('3')
    handleOperator('=')
    expect(calculator.displayValue).toBe('5')
  })

  it('should handle floating point precision (0.1 + 0.2 = 0.3)', () => {
    inputDigit('0')
    inputDecimal()
    inputDigit('1')
    handleOperator('+')
    inputDigit('0')
    inputDecimal()
    inputDigit('2')
    handleOperator('=')
    expect(calculator.displayValue).toBe('0.3')
  })

  it('should return Error for division by zero', () => {
    inputDigit('5')
    handleOperator('÷')
    inputDigit('0')
    handleOperator('=')
    expect(calculator.displayValue).toBe('Error')
  })
})
```

### Browser Mode Test for localStorage

```javascript
// tests/history.test.js
// @vitest-environment browser
// Source: https://vitest.dev/guide/browser/
import { describe, it, expect, beforeEach } from 'vitest'

describe('History localStorage persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset history cache
    if (typeof clearHistory === 'function') {
      clearHistory()
    }
  })

  it('should persist history to localStorage', () => {
    addToHistory('2 + 2', '4')

    // Verify in memory
    const history = loadHistory()
    expect(history).toHaveLength(1)
    expect(history[0].expression).toBe('2 + 2')
    expect(history[0].result).toBe('4')

    // Verify in localStorage
    const stored = localStorage.getItem('calc_history_v1')
    expect(stored).toBeDefined()
    const parsed = JSON.parse(stored)
    expect(parsed).toHaveLength(1)
  })

  it('should enforce max history entries (FIFO)', () => {
    // Add more than MAX_HISTORY_ENTRIES
    for (let i = 0; i < 60; i++) {
      addToHistory(`${i} + 1`, String(i + 1))
    }

    const history = loadHistory()
    expect(history.length).toBeLessThanOrEqual(50)
    // Verify oldest entries were removed
    expect(history[0].expression).toContain('10 + 1') // First 10 removed
  })

  it('should handle localStorage not available gracefully', () => {
    // Note: This test would need to mock storage unavailability
    // In browser mode, localStorage is always available
    // Consider testing the isStorageSupported() function separately
  })
})
```

### Integration Test with DOM

```javascript
// tests/integration.test.js
// @vitest-environment browser
// Source: Vitest browser mode documentation
import { describe, it, expect, beforeEach } from 'vitest'

describe('Calculator DOM integration', () => {
  beforeEach(() => {
    // Setup: Load actual HTML into test environment
    document.body.innerHTML = `
      <div id="display">0</div>
      <div class="calculator-buttons">
        <button data-action="digit" data-value="2">2</button>
        <button data-action="operator" data-value="+">+</button>
        <button data-action="digit" data-value="3">3</button>
        <button data-action="operator" data-value="=">=</button>
      </div>
    `

    // Initialize
    resetCalculator()
    updateDisplay()
  })

  it('should update display when buttons are clicked', () => {
    const display = document.getElementById('display')

    // Simulate button clicks
    const twoButton = document.querySelector('[data-value="2"]')
    twoButton.click()
    expect(display.textContent).toBe('2')

    const plusButton = document.querySelector('[data-value="+"]')
    plusButton.click()

    const threeButton = document.querySelector('[data-value="3"]')
    threeButton.click()
    expect(display.textContent).toBe('3')

    const equalsButton = document.querySelector('[data-value="="]')
    equalsButton.click()
    expect(display.textContent).toBe('5')
  })
})
```

### Package.json Scripts

```json
{
  "name": "cal-calculator",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "@vitest/browser-playwright": "^4.0.0",
    "@vitest/coverage-v8": "^4.0.0",
    "@vitest/ui": "^4.0.0",
    "playwright": "^1.40.0",
    "vitest": "^4.0.0"
  }
}
```

### GitHub Actions CI Workflow

```yaml
# .github/workflows/test.yml
# Source: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs
name: Automated Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Install Playwright browsers
      run: npx playwright install --with-deps chromium

    - name: Run tests
      run: npm test

    - name: Generate coverage report
      run: npm run test:coverage

    - name: Upload coverage to Codecov (optional)
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Jest with jsdom | Vitest with browser mode | 2024-2025 (Vitest 4.0) | Real browser testing instead of DOM simulation, 2-10x faster execution |
| Custom localStorage mocks | Native browser localStorage in tests | 2025 (Node v25 Web Storage conflicts) | More reliable tests, fewer mock maintenance issues |
| Mocha + Chai + Sinon stack | Vitest all-in-one | 2023-2024 | Single framework instead of 3+ libraries, unified config |
| Istanbul coverage via babel | V8 native coverage | 2024 (Vitest 3.2+) | Faster coverage without instrumentation overhead |
| Karma for browser testing | Vitest browser mode | 2024-2025 | Simpler setup, no separate browser runner needed |

**Deprecated/outdated:**
- **Karma:** Officially deprecated, replaced by Vitest browser mode and Playwright Test
- **c8 coverage provider:** Merged into @vitest/coverage-v8 package (c8 package last updated 3 years ago)
- **jsdom for localStorage testing:** Problematic in Node v25+, use browser mode instead
- **Jest for new projects:** Still maintained but slower, Vitest is 2026 standard for new vanilla JS projects

## Open Questions

Things that couldn't be fully resolved:

1. **Export strategy for vanilla JS files**
   - What we know: Current calculator.js, history.js use global scope, no module exports. Tests need to import functions.
   - What's unclear: Best way to add exports without breaking existing HTML script tags (which expect globals)
   - Recommendation: Convert source files to ES modules with `export` statements. Update HTML to use `<script type="module">`. This is web-standard in 2026 and works on GitHub Pages. Alternatively, create wrapper files for tests that import from source.

2. **Coverage thresholds for this project**
   - What we know: Vitest supports coverage thresholds (lines, branches, statements, functions)
   - What's unclear: What threshold is reasonable for a small calculator app (100%? 90%? 80%?)
   - Recommendation: Start with 80% coverage across all metrics. Pure functions (calculator.js) should aim for 95%+. DOM-heavy code (main.js) may be harder to cover fully.

3. **Testing keyboard event handlers**
   - What we know: main.js has keyboard event listener for calculator input
   - What's unclear: Best practice for testing keyboard events in Vitest browser mode
   - Recommendation: Use Playwright's keyboard API in browser mode tests to simulate real key presses. Alternatively, dispatch KeyboardEvent objects programmatically. Research needed during implementation.

## Sources

### Primary (HIGH confidence)

- [Vitest Official Documentation](https://vitest.dev/guide/) - Getting started, configuration, browser mode setup
- [Vitest Browser Mode Guide](https://vitest.dev/guide/browser/) - Browser testing with Playwright provider
- [Vitest Coverage Guide](https://vitest.dev/guide/coverage) - V8 and Istanbul coverage configuration
- [GitHub Actions Node.js Documentation](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs) - CI workflow setup

### Secondary (MEDIUM confidence)

- [Vitest in 2026: The New Standard for Modern JavaScript Testing](https://jeffbruchado.com.br/en/blog/vitest-2026-standard-modern-javascript-testing) - Current state of Vitest adoption
- [Jest vs Vitest: Which Test Runner Should You Use in 2025?](https://medium.com/@ruverd/jest-vs-vitest-which-test-runner-should-you-use-in-2025-5c85e4f2bda9) - Framework comparison
- [Playwright vs Puppeteer: Which to choose in 2026?](https://www.browserstack.com/guide/playwright-vs-puppeteer) - Browser automation comparison
- [How to Test LocalStorage with Vitest](https://runthatline.com/vitest-mock-localstorage/) - localStorage testing strategies
- [jsdom vs happy-dom: Navigating the Nuances of JavaScript Testing](https://blog.seancoughlin.me/jsdom-vs-happy-dom-navigating-the-nuances-of-javascript-testing) - DOM simulation comparison

### Tertiary (LOW confidence)

- [Testing JavaScript without a (third-party) framework](https://alexwlchan.net/2023/testing-javascript-without-a-framework/) - Custom test framework approach (dated 2023)
- [Top 5 JavaScript Test Automation Frameworks in 2026](https://www.qable.io/blog/top-5-javascript-test-automation-frameworks-in-2026) - General framework overview
- [How to unit test vanilla JavaScript](https://gomakethings.com/how-to-unit-test-vanilla-javascript/) - Basic testing concepts

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Vitest is well-documented, widely adopted standard for 2026 JavaScript testing
- Architecture: HIGH - Official Vitest browser mode documentation provides clear patterns and examples
- Pitfalls: MEDIUM-HIGH - localStorage Node.js v25 issue well-documented, other pitfalls based on general testing best practices
- Vanilla JS integration: MEDIUM - ES module export strategy for vanilla JS + tests needs validation during implementation

**Research date:** 2026-02-14
**Valid until:** 2026-03-14 (30 days - testing ecosystem is relatively stable)

**Special notes:**
- This project has unique constraint of vanilla JS source files (no build step) but needs testing infrastructure
- Solution: Vitest as dev dependency, source files remain vanilla, tests use ES modules
- Requires package.json creation (breaking "no npm" constraint) but only for testing, not deployment
- GitHub Pages deployment remains simple: serve vanilla files directly, no build step
