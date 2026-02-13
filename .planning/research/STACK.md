# Stack Research

**Domain:** Calculator Web App (Static Site)
**Researched:** 2026-02-14
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| HTML5 | Living Standard | Markup structure with semantic elements | Native browser support, no dependencies. Use semantic elements like `<main>`, `<section>`, `<button>` for better accessibility and SEO. The 2025 standard emphasizes semantic HTML for improved screen reader support and maintainability. |
| CSS3 (Native) | Living Standard | Styling and layout with modern features | Native CSS has matured significantly - supports Grid, Flexbox, CSS Custom Properties, Nesting, Container Queries, and `:has()` pseudo-class. No preprocessor needed in 2025. |
| Vanilla JavaScript | ES2015+ (ES6+) | Application logic and interactivity | Modern browsers fully support ES6+ features (modules, arrow functions, template literals, destructuring). No framework overhead = faster load times and simpler deployment to GitHub Pages. |
| GitHub Pages | N/A | Static site hosting | Free, automatic HTTPS, continuous deployment from Git push. Perfect for HTML/CSS/JS static sites with no build step. |

### Supporting Libraries

**None Required**

For a minimal calculator app, no external libraries are needed. The platform provides everything:

| Need | Native Solution | Why No Library Needed |
|------|----------------|----------------------|
| DOM manipulation | `querySelector`, `addEventListener` | Native APIs are fast, well-supported, and sufficient for calculator UI |
| State management | JavaScript object + `localStorage` | Simple state tracking doesn't require Redux/MobX overhead |
| Calculation | JavaScript Math operators | Built-in precision handling with `parseFloat()` and `Number.toFixed()` |
| History persistence | `localStorage` API | Native Web Storage API stores 5MB per origin, perfect for calculation history |
| Keyboard support | `keydown` event listeners | Native event handling covers all keyboard interactions |
| Styling | CSS Grid + Custom Properties | Modern CSS handles button grid layout and theming without Sass/Tailwind |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| VS Code / any text editor | Code editing | No special IDE requirements for vanilla stack |
| Live Server (VS Code extension) | Local development server | Simple HTTP server for testing. Alternative: `python -m http.server` |
| Browser DevTools | Debugging and inspection | Chrome/Firefox DevTools have excellent JavaScript debugging, Network inspection, and CSS Grid/Flexbox visualizers |
| Git | Version control | Required for GitHub Pages deployment |
| W3C HTML Validator | HTML validation | Ensures semantic HTML follows standards: https://validator.w3.org/ |
| ESLint (optional) | JavaScript linting | Can be run via command line without build step if desired, but not required |

### Modern CSS Features to Use (2025)

| Feature | Purpose | Browser Support |
|---------|---------|-----------------|
| CSS Grid | Calculator button grid layout | Universal (100% modern browsers) |
| CSS Custom Properties | Theming (colors, spacing) | Universal - enables light/dark themes with minimal code |
| CSS Nesting | Cleaner selector organization | Native in 2025 (no Sass needed) |
| `:has()` pseudo-class | Parent selectors for dynamic styling | Widely supported in 2025 |
| `calc()` function | Dynamic sizing calculations | Universal |
| Container Queries | Responsive layout based on calculator container | Widely supported in 2025 |

### Modern JavaScript Patterns to Use (2025)

| Pattern | Purpose | Notes |
|---------|---------|-------|
| ES6 Modules (`import`/`export`) | Code organization | Use `<script type="module">` in HTML - works without build tools in modern browsers |
| Object state pattern | State management | Store `displayValue`, `firstOperand`, `operator`, `waitingForSecondOperand` in single object |
| Event delegation | Efficient event handling | Single listener on calculator container vs. per-button listeners |
| `JSON.stringify` / `JSON.parse` | localStorage data serialization | Required for storing calculation history objects |
| Template literals | String formatting | Cleaner display value formatting |

## Installation

**No installation or build step required.**

```bash
# 1. Clone or create repository
git init
# or
git clone <your-repo-url>

# 2. Create files
touch index.html styles.css script.js

# 3. Develop locally (option 1: VS Code Live Server)
# Install "Live Server" extension in VS Code
# Right-click index.html → "Open with Live Server"

# 4. Develop locally (option 2: Python HTTP server)
python3 -m http.server 8000
# Navigate to http://localhost:8000

# 5. Deploy to GitHub Pages
git add .
git commit -m "Initial calculator app"
git push origin main

# 6. Enable GitHub Pages in repository Settings > Pages
# Select branch: main, folder: / (root)
# Site will be live at https://<username>.github.io/<repo-name>/
```

## Alternatives Considered

| Category | Recommended | Alternative | When to Use Alternative |
|----------|-------------|-------------|-------------------------|
| JavaScript | Vanilla JS | React/Vue/Svelte | Only if building a complex multi-page app with shared state. Massive overkill for a calculator. |
| CSS | Native CSS3 | Sass/SCSS | Only if you need advanced features like mixins across hundreds of components. Native CSS nesting eliminates most Sass benefits in 2025. |
| CSS Framework | None | Tailwind/Bootstrap | Only if you need dozens of pre-built components. For a custom calculator design, utility classes create bloat and require build step. |
| Build Tools | None | Webpack/Vite/Parcel | Only if using TypeScript, JSX, or npm packages. Adds complexity and breaks "no build step" requirement. |
| Module System | ES6 Modules | CommonJS (require/module.exports) | CommonJS is for Node.js backend. ES6 modules work natively in browsers. |
| Storage | localStorage | IndexedDB | Only for large datasets (>5MB) or complex queries. Calculator history is tiny (~1KB). |
| Testing | Manual browser testing | Jest/Mocha/Cypress | Automated tests add value for larger projects, but require build setup. Manual testing sufficient for calculator scope. |
| Hosting | GitHub Pages | Netlify/Vercel | Both are excellent, but GitHub Pages is simplest for static sites (free, integrated with repo). |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| jQuery | Outdated (2015-era solution to browser inconsistencies that no longer exist). Native `querySelector` and `fetch` do everything jQuery did. | Vanilla JavaScript DOM APIs |
| `eval()` for calculations | Massive security risk (arbitrary code execution). Common beginner mistake for calculators. | Explicit operator logic with `switch` statement or operator map |
| Inline styles | Mixes concerns, hard to maintain, no theme support. | CSS classes with Custom Properties |
| `document.write()` | Deprecated, blocks page rendering, overwrites DOM. | `createElement` + `appendChild` or `innerHTML` |
| Global variables | Pollutes global scope, causes naming conflicts. | ES6 modules or IIFE pattern |
| `var` keyword | Function-scoped, hoisting issues, outdated. | `const` (default) or `let` |
| CSS-in-JS libraries (styled-components) | Requires React/build step. Overkill for static site. | Native CSS with Custom Properties |
| Polyfills for ES6+ | Modern browsers (2025) support ES6+. Polyfills add unnecessary bloat. | Write ES6+ directly |
| Third-party icon libraries (FontAwesome) | Adds HTTP request and bloat for simple icons. | Unicode symbols (`×`, `÷`, `±`) or inline SVG |

## Stack Patterns by Use Case

**Basic Calculator (Recommended for this project):**
- HTML5 semantic elements
- CSS Grid for button layout
- CSS Custom Properties for theming
- Vanilla JavaScript with object state pattern
- localStorage for history persistence
- ES6 modules for code organization (optional, can use single `<script>`)

**If adding advanced features later:**
- Scientific calculator: Same stack, just more operators/functions
- Graphing calculator: Add Chart.js library (only if graphing needed)
- Multi-page app: Consider adding a lightweight router or Vue/React (but you'd lose "no build step")

## File Structure

```
/
├── index.html          # Main HTML file
├── styles.css          # All styles (can split into separate files if desired)
├── script.js           # Main application logic
├── modules/            # Optional: ES6 modules for code organization
│   ├── calculator.js   # Calculator logic
│   ├── display.js      # Display handling
│   └── storage.js      # localStorage utilities
└── README.md           # Documentation
```

**Alternative (single file for simplicity):**
```
/
├── index.html          # Includes <style> and <script> inline
└── README.md
```

## Version Compatibility

**No version conflicts exist** - all recommended technologies are browser-native standards.

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ (2021+) | Full ES6+, CSS Grid, Custom Properties support |
| Firefox | 88+ (2021+) | Full modern feature support |
| Safari | 14+ (2020+) | Full modern feature support |
| Edge | 90+ (2021+) | Chromium-based, same as Chrome |

**For ES6 Modules specifically:**
- Requires `<script type="module">` attribute
- Supported in all modern browsers (2020+)
- Falls back gracefully with `<script nomodule>` for legacy browsers (if needed)

## Key Architecture Decisions

### CSS Grid vs. Flexbox for Calculator Layout
**Decision: Use CSS Grid**

**Rationale:** Calculator buttons form a natural 2D grid (rows and columns). CSS Grid was designed for two-dimensional layouts, making button positioning trivial with `grid-template-areas` or `grid-column/grid-row`. Flexbox is one-dimensional (row or column), requiring nested flex containers for calculator layout.

**Example:**
```css
.calculator-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
```

### localStorage vs. sessionStorage for History
**Decision: Use localStorage**

**Rationale:** Calculator history should persist across browser sessions (users expect to see previous calculations when reopening the app). sessionStorage clears when tab closes. localStorage provides 5MB storage (far more than needed for calculation history) and persists indefinitely.

**Example:**
```javascript
// Save history
localStorage.setItem('calculatorHistory', JSON.stringify(historyArray));

// Load history
const history = JSON.parse(localStorage.getItem('calculatorHistory') || '[]');
```

### Single Script vs. ES6 Modules
**Decision: Start with single script, refactor to modules if code exceeds ~300 lines**

**Rationale:** For a simple calculator, a single `script.js` file (~200-300 lines) is easier to reason about and debug. ES6 modules add organizational benefits for larger codebases but introduce additional complexity (module scope, import/export, CORS issues on `file://` protocol). Use modules if implementing advanced features (scientific calculator, graphing, etc.).

### Object State Pattern vs. Class-Based Architecture
**Decision: Use object state pattern**

**Rationale:** Calculator state is simple (current display, operands, operator, flags). A plain JavaScript object is sufficient:
```javascript
const calculatorState = {
  displayValue: '0',
  firstOperand: null,
  operator: null,
  waitingForSecondOperand: false
};
```

Classes add boilerplate without clear benefits for this use case. Reserve classes for complex domain models with behavior.

## Performance Considerations

**Key metric: Time to Interactive (TTI)**

| Aspect | Strategy | Impact |
|--------|----------|--------|
| Bundle size | 0 KB (no dependencies) | Instant load on any connection |
| CSS | Single stylesheet (~2-5 KB) | No blocking requests |
| JavaScript | Single script (~5-15 KB) | No parsing overhead from frameworks |
| Images/Icons | Unicode or inline SVG | No additional HTTP requests |
| Fonts | System fonts or single Google Font | Minimize render-blocking resources |

**Expected performance (2025):**
- First Contentful Paint: <500ms
- Time to Interactive: <1s
- Lighthouse Score: 95-100

**No optimization needed** for a vanilla calculator - the stack is already optimal.

## Security Considerations

| Risk | Mitigation |
|------|------------|
| XSS (Cross-Site Scripting) | Avoid `innerHTML` with user input. Use `textContent` for display values. Never use `eval()`. |
| Code Injection | Never use `eval()`, `Function()`, or `setTimeout(string)` to evaluate calculator expressions. Use explicit operator logic. |
| localStorage Tampering | Validate and sanitize data read from localStorage (check types, handle JSON parse errors). |
| CORS Issues (dev) | Use local HTTP server (Live Server, `python -m http.server`) instead of `file://` protocol for ES6 modules. |

## Accessibility Considerations

| Requirement | Implementation |
|-------------|----------------|
| Keyboard navigation | Add `keydown` event listeners for number keys, operators, Enter (=), Escape (clear), Backspace (delete) |
| Screen reader support | Use semantic `<button>` elements (not `<div>` with click handlers). Add `aria-label` for symbol buttons (×, ÷, ±). |
| Focus indicators | Keep default browser focus outlines or style with `:focus-visible` |
| Color contrast | Use CSS Custom Properties to ensure 4.5:1 contrast ratio (WCAG AA) |
| Responsive text | Use `clamp()` for display text sizing to prevent overflow |

## Common Pitfalls (Calculator-Specific)

### Floating-Point Precision
**Problem:** `0.1 + 0.2 === 0.30000000000000004` in JavaScript

**Solution:**
```javascript
function calculate(a, operator, b) {
  let result;
  switch(operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = a / b; break;
  }
  // Round to 10 decimal places, remove trailing zeros
  return parseFloat(result.toFixed(10));
}
```

### Division by Zero
**Problem:** `1 / 0 === Infinity` (not an error in JavaScript)

**Solution:**
```javascript
if (operator === '/' && b === 0) {
  return 'Error';
}
```

### Repeated Decimal Point
**Problem:** User can type "1.2.3" if not handled

**Solution:**
```javascript
if (key === '.' && displayValue.includes('.')) {
  return; // Ignore second decimal point
}
```

### Operator Edge Cases
**Problem:** Clicking "=" without entering a second operand, or clicking operators repeatedly

**Solution:** Track state with `waitingForSecondOperand` flag, handle edge cases explicitly.

## Sources

**Modern Vanilla JavaScript (2025):**
- [Vanilla JavaScript Is Quietly Taking Over Again](https://medium.com/@arkhan.khansb/vanilla-javascript-is-quietly-taking-over-again-heres-why-developers-are-switching-back-5ee1588e2bfa) — Trend analysis
- [Why I Still Write Vanilla JavaScript in 2025](https://javascript.plainenglish.io/why-i-still-write-vanilla-javascript-in-2025-and-why-you-might-want-to-ed618d3460d4) — Developer perspective
- [How I structure my vanilla JS projects](https://gomakethings.com/how-i-structure-my-vanilla-js-projects/) — Organization patterns

**GitHub Pages Deployment:**
- [GitHub Pages Official Docs](https://pages.github.com/) — Authoritative source
- [Ready, Set, Launch: Creating a Static Site With GitHub Pages](https://kinsta.com/blog/github-pages/) — Step-by-step guide
- [How to deploy HTML website using GitHub Pages](https://github.com/orgs/community/discussions/160361) — Community guidance

**Modern CSS Features (2025):**
- [CSS in 2026: New Features Reshaping Frontend Development](https://blog.logrocket.com/css-in-2026/) — Feature overview
- [What You Need to Know about Modern CSS (2025 Edition)](https://frontendmasters.com/blog/what-you-need-to-know-about-modern-css-2025-edition/) — Authoritative guide
- [State, Logic, And Native Power: CSS Wrapped 2025](https://www.smashingmagazine.com/2025/12/state-logic-native-power-css-wrapped-2025/) — Native CSS capabilities
- [New CSS Features You Need to Know in 2025](https://www.geeksforgeeks.org/css/modern-css-features-you-need-to-know-in-2024/) — Feature list

**CSS Grid for Calculator Layout:**
- [Learn CSS Grid by building a simple Calculator Layout](https://freshman.tech/css-grid-calculator/) — Practical tutorial
- [CSS Layout: flexbox, grid, media queries and container queries](https://2ality.com/2025/10/css-layout.html) — Layout comparison
- [Relationship of grid layout to other layout methods](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Relationship_with_other_layout_methods) — MDN official docs

**ES6 Modules:**
- [JavaScript modules - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — Official documentation
- [Importing a frontend Javascript library without a build system](https://jvns.ca/blog/2024/11/18/how-to-import-a-javascript-library/) — No-build approach
- [ES6 Modules and How to Use Import and Export in JavaScript](https://www.digitalocean.com/community/tutorials/js-modules-es6) — Tutorial

**HTML5 Semantic Elements:**
- [Semantic HTML - Fundamentals and Best Practices 2025](https://www.seo-day.de/wiki/on-page-seo/html-optimierung/semantic-html.php?lang=en) — Best practices
- [What Is Semantic HTML? And How to Use It Correctly](https://www.semrush.com/blog/semantic-html5-guide/) — SEO-focused guide
- [HTML5 Semantic Elements Explained](https://pwskills.com/blog/html5-semantic-elements-explained/) — Reference guide

**Calculator Implementation:**
- [How to build an HTML calculator app from scratch using JavaScript](https://www.freecodecamp.org/news/how-to-build-an-html-calculator-app-from-scratch-using-javascript-4454b8714b98/) — Complete guide
- [How to Build A Calculator App in JavaScript](https://freshman.tech/calculator/) — Step-by-step tutorial
- [JavaScript Calculator App - GeeksforGeeks](https://www.geeksforgeeks.org/javascript/javascript-calculator/) — Reference implementation

**localStorage Best Practices:**
- [Web Storage API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) — Official documentation
- [JavaScript LocalStorage | In-Depth Guide & Tutorial](https://www.meticulous.ai/blog/localstorage-complete-guide) — Comprehensive guide
- [Client-Side Storage Guide: LocalStorage vs SessionStorage vs IndexedDB](https://www.frontendtools.tech/blog/client-side-storage-guide-localstorage-sessionstorage-indexeddb) — Comparison

**CSS Custom Properties for Theming:**
- [Using CSS custom properties (variables) - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties) — Official docs
- [Theming with CSS Custom Properties](https://itnext.io/theming-with-css-custom-properties-variables-and-calc-a89b37ad0013) — Theming guide
- [CSS Custom Properties and Theming](https://css-tricks.com/css-custom-properties-theming/) — CSS-Tricks guide

**Testing (Optional):**
- [Testing JavaScript without a framework](https://alexwlchan.net/2023/testing-javascript-without-a-framework/) — No-build testing approach
- [Testing - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Testing) — MDN testing guide

---
*Stack research for: Calculator Web App (GitHub Pages)*
*Researched: 2026-02-14*
*Confidence: HIGH — All recommendations based on 2025+ standards and official documentation*
