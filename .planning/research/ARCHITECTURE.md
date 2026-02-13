# Architecture Research

**Domain:** Calculator Web Application
**Researched:** 2026-02-14
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Display  │  │  Button  │  │ History  │  │ Keyboard │    │
│  │Component │  │  Panel   │  │  Panel   │  │ Handler  │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │             │             │             │           │
│       └─────────────┴─────────────┴─────────────┘           │
│                          ↓                                   │
├─────────────────────────────────────────────────────────────┤
│                     CONTROLLER LAYER                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            Calculator Controller                     │    │
│  │  • Input Handler                                     │    │
│  │  • Event Router                                      │    │
│  │  • State Coordinator                                 │    │
│  └──────────────────┬──────────────────────────────────┘    │
│                     ↓                                        │
├─────────────────────────────────────────────────────────────┤
│                       MODEL LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Calculation  │  │    State     │  │   History    │       │
│  │    Engine    │  │   Manager    │  │   Manager    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
├─────────────────────────────────────────────────────────────┤
│                    PERSISTENCE LAYER                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            LocalStorage Manager                      │    │
│  │  • History persistence                               │    │
│  │  • Settings persistence (optional)                   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Display Component** | Shows current input, results, and intermediate calculations | Updates DOM element (.textContent) based on state changes |
| **Button Panel** | Renders clickable buttons for numbers, operators, functions | Grid of button elements with data attributes for identification |
| **Keyboard Handler** | Maps keyboard events to calculator actions | document.addEventListener('keydown') with key mapping object |
| **History Panel** | Displays past calculations | List rendering from LocalStorage data, with clear/delete options |
| **Calculator Controller** | Coordinates between UI and model, routes user actions | Central event handler that delegates to appropriate model methods |
| **Calculation Engine** | Performs arithmetic operations, handles operator precedence | Evaluates expressions, manages floating-point precision |
| **State Manager** | Maintains current calculator state (display, operands, operator) | Object/class holding currentValue, previousValue, operator, waitingForNewValue |
| **History Manager** | Manages calculation history data structure | Array of calculation objects with methods to add/retrieve/clear |
| **LocalStorage Manager** | Persists and retrieves data from browser storage | JSON.stringify/parse wrapper with error handling |

## Recommended Project Structure

```
cal/
├── index.html              # Single page entry point
├── css/
│   └── styles.css          # All styling (display, buttons, layout)
├── js/
│   ├── main.js             # App initialization and controller
│   ├── calculator.js       # Calculation engine and state management
│   ├── display.js          # Display component logic
│   ├── history.js          # History management
│   └── keyboard.js         # Keyboard event handling
└── .planning/
    └── research/           # Research documentation
```

### Structure Rationale

- **Single HTML file**: Simple SPA, all content loaded at once, no routing needed
- **css/**: Separation of presentation concerns, could be split further (display.css, buttons.css) if complexity grows
- **js/ modular split**: Each file has single responsibility, making testing and maintenance easier
  - `main.js` acts as the glue between components
  - `calculator.js` contains pure logic (no DOM manipulation), highly testable
  - `display.js` handles all DOM updates for display area
  - `history.js` manages history data + LocalStorage
  - `keyboard.js` isolates keyboard mapping logic

## Architectural Patterns

### Pattern 1: MVC (Model-View-Controller)

**What:** Separates business logic (Model), user interface (View), and coordination (Controller). For calculators, this means arithmetic operations are isolated from DOM manipulation.

**When to use:** Essential for maintainability even in simple calculators. Makes testing calculation logic independent of UI.

**Trade-offs:**
- **Pro:** Clear separation of concerns, testable business logic, easier to debug
- **Pro:** Can swap UI framework without touching calculation engine
- **Con:** More files/classes than putting everything in one script
- **Con:** Requires discipline to maintain boundaries

**Example:**
```javascript
// Model: calculator.js
class Calculator {
  constructor() {
    this.currentValue = '0';
    this.previousValue = null;
    this.operator = null;
    this.waitingForNewValue = false;
  }

  inputDigit(digit) {
    if (this.waitingForNewValue) {
      this.currentValue = String(digit);
      this.waitingForNewValue = false;
    } else {
      this.currentValue = this.currentValue === '0'
        ? String(digit)
        : this.currentValue + digit;
    }
  }

  performOperation(nextOperator) {
    if (this.previousValue === null) {
      this.previousValue = this.currentValue;
    } else if (this.operator) {
      const result = this.calculate();
      this.currentValue = String(result);
      this.previousValue = this.currentValue;
    }
    this.waitingForNewValue = true;
    this.operator = nextOperator;
  }

  calculate() {
    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);

    switch (this.operator) {
      case '+': return prev + current;
      case '-': return prev - current;
      case '×': return prev * current;
      case '÷': return current !== 0 ? prev / current : 'Error';
      default: return current;
    }
  }
}

// Controller: main.js
class CalculatorController {
  constructor() {
    this.calculator = new Calculator();
    this.display = new Display();
    this.history = new HistoryManager();
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document.querySelectorAll('.number').forEach(button => {
      button.addEventListener('click', (e) => {
        this.calculator.inputDigit(e.target.textContent);
        this.display.update(this.calculator.currentValue);
      });
    });

    document.querySelectorAll('.operator').forEach(button => {
      button.addEventListener('click', (e) => {
        this.calculator.performOperation(e.target.textContent);
        this.display.update(this.calculator.currentValue);
      });
    });
  }
}

// View: display.js
class Display {
  constructor() {
    this.element = document.querySelector('.display');
  }

  update(value) {
    this.element.textContent = value;
  }

  clear() {
    this.element.textContent = '0';
  }
}
```

### Pattern 2: Event Delegation for Button Handling

**What:** Instead of attaching individual event listeners to each button, attach one listener to the parent container and use event bubbling to determine which button was clicked.

**When to use:** When you have many similar buttons (0-9, operators). Reduces memory footprint and simplifies dynamic button creation.

**Trade-offs:**
- **Pro:** Single event listener instead of 20+, better performance
- **Pro:** Easier to add/remove buttons dynamically
- **Con:** Need to check event.target to determine which button was clicked
- **Con:** Slightly more complex event handling logic

**Example:**
```javascript
document.querySelector('.button-panel').addEventListener('click', (e) => {
  if (!e.target.matches('button')) return;

  const buttonType = e.target.dataset.type;
  const buttonValue = e.target.dataset.value;

  switch (buttonType) {
    case 'number':
      calculator.inputDigit(buttonValue);
      break;
    case 'operator':
      calculator.performOperation(buttonValue);
      break;
    case 'function':
      handleFunction(buttonValue); // AC, +/-, %
      break;
    case 'equals':
      calculator.equals();
      break;
  }

  updateDisplay();
});
```

### Pattern 3: State Machine for Input Handling

**What:** Calculator behavior changes based on current state (e.g., "waiting for first operand" vs "waiting for operator" vs "waiting for second operand"). Track state explicitly to avoid bugs.

**When to use:** Essential for correct calculator behavior, especially handling edge cases like consecutive operator presses.

**Trade-offs:**
- **Pro:** Prevents invalid state transitions, makes behavior predictable
- **Pro:** Easier to reason about complex interaction flows
- **Con:** Requires careful state design upfront
- **Con:** More code than simple if/else chains

**Example:**
```javascript
class CalculatorState {
  constructor() {
    this.reset();
  }

  reset() {
    this.displayValue = '0';
    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = false;
  }

  inputDigit(digit) {
    if (this.waitingForSecondOperand) {
      this.displayValue = String(digit);
      this.waitingForSecondOperand = false;
    } else {
      this.displayValue = this.displayValue === '0'
        ? String(digit)
        : this.displayValue + digit;
    }
  }

  inputDecimal() {
    if (this.waitingForSecondOperand) {
      this.displayValue = '0.';
      this.waitingForSecondOperand = false;
      return;
    }

    if (!this.displayValue.includes('.')) {
      this.displayValue += '.';
    }
  }

  handleOperator(nextOperator) {
    const inputValue = parseFloat(this.displayValue);

    if (this.firstOperand === null) {
      this.firstOperand = inputValue;
    } else if (this.operator) {
      const result = this.performCalculation();
      this.displayValue = String(result);
      this.firstOperand = result;
    }

    this.waitingForSecondOperand = true;
    this.operator = nextOperator;
  }
}
```

### Pattern 4: LocalStorage Wrapper for History Persistence

**What:** Abstraction layer over localStorage that handles JSON serialization, error handling, and provides clean API.

**When to use:** Always when using localStorage to avoid repetitive JSON.stringify/parse and error handling throughout codebase.

**Trade-offs:**
- **Pro:** Centralized error handling for storage quota exceeded, parsing errors
- **Pro:** Type-safe API, easier to mock for testing
- **Con:** Additional abstraction layer
- **Con:** Slight performance overhead (negligible for calculator use case)

**Example:**
```javascript
class StorageManager {
  constructor(storageKey = 'calculator-history') {
    this.storageKey = storageKey;
  }

  save(data) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(this.storageKey, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  load() {
    try {
      const serialized = localStorage.getItem(this.storageKey);
      return serialized ? JSON.parse(serialized) : [];
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return [];
    }
  }

  clear() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }
}
```

## Data Flow

### User Input Flow

```
User Action (click button or press key)
    ↓
Event Listener (button click or keydown)
    ↓
Controller (identifies action type)
    ↓
Calculator Model (updates internal state)
    ↓
Display Component (reads new state, updates DOM)
```

### Calculation Flow

```
User presses operator
    ↓
Controller.handleOperator()
    ↓
Calculator.performOperation()
    ↓
  • Stores first operand
  • Sets operator
  • Sets waitingForSecondOperand flag
    ↓
User inputs second operand
    ↓
Calculator.inputDigit()
    ↓
User presses equals (or next operator)
    ↓
Calculator.calculate()
    ↓
  • Retrieves operands and operator
  • Performs arithmetic
  • Returns result
    ↓
History.addEntry(expression, result)
    ↓
LocalStorage.save(history)
    ↓
Display.update(result)
```

### Keyboard Input Flow

```
User presses key
    ↓
document.keydown listener
    ↓
KeyboardHandler.mapKeyToAction(key)
    ↓
  • Numbers (0-9) → inputDigit()
  • Operators (+, -, *, /) → performOperation()
  • Enter → calculate()
  • Escape → clear()
  • Backspace → deleteLastDigit()
    ↓
Trigger same controller methods as button clicks
    ↓
(same flow as User Input Flow)
```

### History Flow

```
Calculation completed
    ↓
HistoryManager.addEntry({
  expression: "5 + 3",
  result: 8,
  timestamp: Date.now()
})
    ↓
Update in-memory history array
    ↓
StorageManager.save(historyArray)
    ↓
HistoryDisplay.render(historyArray)
    ↓
Creates DOM elements for each history item
```

## Build Order & Dependencies

### Phase 1: Core Calculation Engine (No Dependencies)
**Build first** - Pure JavaScript logic, no DOM required
- Calculator class with state management
- Basic arithmetic operations (+, -, ×, ÷)
- Decimal point handling
- Can be fully unit tested without browser

### Phase 2: Display Component (Depends on: Phase 1)
**Build second** - Simplest UI component
- Display class that updates DOM
- Connect to calculator state
- Shows current value, updates on state change
- Basic integration test: can render calculator output

### Phase 3: Button Interface (Depends on: Phase 1, 2)
**Build third** - User input via buttons
- Button HTML structure
- Event delegation for button panel
- Wire buttons to calculator methods
- Update display on button clicks
- Integration test: full click-through calculations

### Phase 4: Keyboard Support (Depends on: Phase 3)
**Build fourth** - Parallel input method
- Keyboard event listener
- Key-to-action mapping
- Reuse existing calculator methods (no new logic)
- Integration test: keyboard produces same results as buttons

### Phase 5: Advanced Functions (Depends on: Phase 1-3)
**Build fifth** - Special operations
- Percentage calculation
- Sign toggle (+/-)
- Clear/All Clear distinction
- Can build in parallel with Phase 4

### Phase 6: History Manager (Depends on: Phase 1)
**Build sixth** - Independent feature
- History data structure
- LocalStorage wrapper
- Add entry on each calculation
- Can build in parallel with Phases 4-5

### Phase 7: History UI (Depends on: Phase 6)
**Build seventh** - History display
- History panel HTML/CSS
- Render history from LocalStorage
- Clear history button
- Click history item to restore value

### Dependency Graph

```
Phase 1 (Calculator Engine)
   ├─→ Phase 2 (Display)
   │     └─→ Phase 3 (Buttons)
   │           ├─→ Phase 4 (Keyboard)
   │           └─→ Phase 5 (Advanced Functions)
   └─→ Phase 6 (History Manager)
         └─→ Phase 7 (History UI)
```

**Critical Path:** 1 → 2 → 3 → (4 or 5) → 6 → 7

**Parallelizable:**
- Phase 4 and 5 can be built simultaneously after Phase 3
- Phase 6 can start once Phase 1 is complete (independent of UI)

## Anti-Patterns

### Anti-Pattern 1: Using eval() for Calculation

**What people do:** Build expression string (e.g., "5+3*2") and use eval() to calculate
```javascript
// DON'T DO THIS
function calculate(expression) {
  return eval(expression); // DANGEROUS!
}
```

**Why it's wrong:**
- **Security risk:** eval() executes arbitrary code, major vulnerability if user input isn't sanitized
- **Floating-point errors:** Doesn't handle JavaScript's 0.1 + 0.2 = 0.30000000000000004 problem
- **Poor error handling:** eval() throws errors that are hard to catch gracefully
- **No operator precedence control:** Can't customize calculation order

**Do this instead:**
- Implement calculation logic explicitly with switch/case or strategy pattern
- Handle each operator separately
- Add proper error handling for division by zero, overflow, etc.
- Round results to prevent floating-point display errors

```javascript
// DO THIS
function calculate(operand1, operator, operand2) {
  const a = parseFloat(operand1);
  const b = parseFloat(operand2);
  let result;

  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '×': result = a * b; break;
    case '÷':
      if (b === 0) return 'Error';
      result = a / b;
      break;
    default: return 'Error';
  }

  // Round to 10 decimal places to avoid floating point display errors
  return Math.round(result * 1e10) / 1e10;
}
```

### Anti-Pattern 2: Mixing State Management with Display Logic

**What people do:** Store calculator state in the DOM (reading display.textContent as source of truth)
```javascript
// DON'T DO THIS
function handleNumber(num) {
  const display = document.querySelector('.display');
  display.textContent += num; // State lives in DOM
}

function calculate() {
  const displayValue = document.querySelector('.display').textContent;
  // Parse display string to figure out what to calculate...
}
```

**Why it's wrong:**
- **Hard to test:** Can't unit test without setting up DOM
- **Fragile:** Display formatting (commas, spacing) corrupts state
- **Debugging nightmare:** State scattered across DOM elements
- **No history:** Can't track previous values without reading multiple DOM nodes

**Do this instead:**
- Keep state in JavaScript objects/classes
- Display is a pure function of state (state → display, never display → state)
- Render display by reading state, never read display to get state

```javascript
// DO THIS
class Calculator {
  constructor() {
    this.state = {
      currentValue: '0',
      previousValue: null,
      operator: null
    };
  }

  inputDigit(digit) {
    // Update state
    this.state.currentValue = this.state.currentValue === '0'
      ? String(digit)
      : this.state.currentValue + digit;

    // Render updated state to display
    this.render();
  }

  render() {
    // Display is ALWAYS derived from state
    const display = document.querySelector('.display');
    display.textContent = this.state.currentValue;
  }
}
```

### Anti-Pattern 3: Separate Event Listeners for Each Button

**What people do:** Attach individual click listeners to all 20+ buttons
```javascript
// DON'T DO THIS
document.querySelector('#btn-0').addEventListener('click', () => inputDigit('0'));
document.querySelector('#btn-1').addEventListener('click', () => inputDigit('1'));
document.querySelector('#btn-2').addEventListener('click', () => inputDigit('2'));
// ... 20 more lines
document.querySelector('#btn-plus').addEventListener('click', () => setOperator('+'));
// etc.
```

**Why it's wrong:**
- **Memory overhead:** 20+ event listeners instead of 1
- **Repetitive code:** Violates DRY principle
- **Hard to maintain:** Adding a button requires new listener
- **Performance:** More event listeners = slower event handling

**Do this instead:**
- Use event delegation with a single listener on parent
- Use data attributes to identify button type and value
- Switch/case or mapping object to route actions

```javascript
// DO THIS
document.querySelector('.button-panel').addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;

  const type = button.dataset.type;
  const value = button.dataset.value;

  const actions = {
    'number': () => calculator.inputDigit(value),
    'operator': () => calculator.performOperation(value),
    'function': () => calculator.handleFunction(value),
    'equals': () => calculator.calculate()
  };

  actions[type]?.();
  updateDisplay();
});
```

### Anti-Pattern 4: Ignoring Floating-Point Precision

**What people do:** Display raw JavaScript arithmetic results
```javascript
// DON'T DO THIS
function add(a, b) {
  return a + b; // 0.1 + 0.2 = 0.30000000000000004
}

function divide(a, b) {
  return a / b; // 10 / 3 = 3.3333333333333335
}
```

**Why it's wrong:**
- **Ugly output:** Users see "0.30000000000000004" instead of "0.3"
- **Loss of trust:** Calculator that shows wrong decimals feels broken
- **Accumulating errors:** Repeated operations compound the error

**Do this instead:**
- Round results to reasonable precision (10-12 decimal places)
- Use toFixed() for display (but store full precision internally)
- Consider libraries like decimal.js for financial calculations
- Add maximum display length to prevent overflow

```javascript
// DO THIS
function calculate(a, operator, b) {
  let result;

  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '×': result = a * b; break;
    case '÷': result = a / b; break;
  }

  // Round to 10 decimal places to fix floating point errors
  result = Math.round(result * 1e10) / 1e10;

  // Limit display to 12 characters
  const resultStr = String(result);
  return resultStr.length > 12
    ? parseFloat(resultStr).toExponential(5)
    : result;
}
```

### Anti-Pattern 5: Not Handling Edge Cases

**What people do:** Assume happy path, no validation
```javascript
// DON'T DO THIS
function divide(a, b) {
  return a / b; // Division by zero returns Infinity
}

function inputDigit(digit) {
  this.display += digit; // Display can grow infinitely
}
```

**Why it's wrong:**
- **Division by zero:** Shows "Infinity" or "NaN" instead of helpful error
- **Display overflow:** Numbers can exceed screen width
- **Multiple decimals:** User can enter "3.14.15.9"
- **Operator spam:** Pressing "++++++" causes errors

**Do this instead:**
- Validate all inputs
- Handle division by zero explicitly
- Limit display length
- Prevent multiple decimal points
- Ignore redundant operators

```javascript
// DO THIS
function divide(a, b) {
  if (b === 0) {
    return 'Error'; // or throw meaningful error
  }
  return a / b;
}

function inputDigit(digit) {
  // Limit display to 12 characters
  if (this.displayValue.length >= 12) return;

  this.displayValue = this.displayValue === '0'
    ? String(digit)
    : this.displayValue + digit;
}

function inputDecimal() {
  // Prevent multiple decimal points
  if (this.displayValue.includes('.')) return;

  this.displayValue += '.';
}

function setOperator(nextOperator) {
  // Ignore if operator already set and waiting for second operand
  if (this.waitingForSecondOperand && this.operator) {
    this.operator = nextOperator; // Allow operator change
    return;
  }
  // ... normal operator logic
}
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **Single user (100%)** | Current architecture is perfect. All state in memory + LocalStorage. No server needed. GitHub Pages static hosting. |
| **Multiple devices (sync)** | Add backend API to sync history across devices. Requires authentication, database (Firebase/Supabase good choices). History becomes server-authoritative. |
| **Advanced features (scientific)** | Maintain same architecture, but calculation engine grows significantly. Consider separating basic vs scientific into modules. May need expression parser instead of stateful operators. |
| **Mobile app** | Same logic, different view layer. Calculation engine and state management are framework-agnostic. Could wrap in Capacitor/Electron or rebuild UI in React Native using same calculation classes. |

### Scaling Priorities

**Current project (basic calculator) needs ZERO scaling considerations.** Architecture is optimal for the use case.

**If expanding to scientific calculator:**
1. **First bottleneck:** Expression parsing complexity
   - **Fix:** Implement tokenizer + parser (RPN or AST-based)
   - **Example:** Convert "sin(30) + cos(45)" to evaluatable structure

2. **Second bottleneck:** Calculation precision (floating-point errors)
   - **Fix:** Integrate decimal.js or similar arbitrary-precision library
   - **Example:** Replace native operators with library methods

**If adding cloud sync:**
1. **First bottleneck:** LocalStorage conflicts across devices
   - **Fix:** Server-side history storage with timestamps
   - **Example:** Merge histories by timestamp, last-write-wins for conflicts

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **LocalStorage** | Direct browser API | 5MB limit, synchronous, string values only. Use JSON.stringify/parse. Handle quota exceeded errors. |
| **GitHub Pages** | Static file hosting | No build step needed for vanilla JS. Just push HTML/CSS/JS files. Automatic HTTPS. |
| **None (deliberately)** | Pure client-side app | No external APIs, no analytics, no CDNs (except optional fonts). Works offline after first load. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Calculator ↔ Display** | Function calls | Display reads calculator state via getter methods, never modifies it. One-way data flow. |
| **Controller ↔ Calculator** | Method calls | Controller calls calculator methods (inputDigit, setOperator), calculator returns new state. |
| **Calculator ↔ History** | Event/callback | When calculation completes, calculator notifies history manager to add entry. Could use Observer pattern or simple callback. |
| **History ↔ LocalStorage** | Abstraction layer | HistoryManager uses StorageManager wrapper, never calls localStorage directly. Easier to mock for testing. |
| **Keyboard Handler ↔ Controller** | Shared interface | Keyboard events trigger same controller methods as button clicks. No duplicate logic. |

## Recommended Component Interfaces

### Calculator Engine API

```javascript
class Calculator {
  // State getters (read-only)
  get displayValue(): string
  get canCalculate(): boolean

  // Input methods
  inputDigit(digit: string): void
  inputDecimal(): void
  deleteLastDigit(): void

  // Operations
  setOperator(operator: '+' | '-' | '×' | '÷'): void
  calculate(): number | 'Error'

  // Functions
  toggleSign(): void
  percent(): void
  clear(): void
  allClear(): void
}
```

### History Manager API

```javascript
class HistoryManager {
  // Query history
  getAll(): Array<HistoryEntry>
  get length(): number

  // Modify history
  addEntry(expression: string, result: number): void
  clear(): void

  // Persistence
  save(): void
  load(): void
}

interface HistoryEntry {
  expression: string;
  result: number;
  timestamp: number;
}
```

### Display Component API

```javascript
class Display {
  // Update display
  update(value: string): void
  clear(): void

  // Error handling
  showError(message: string): void
}
```

## Sources

**General Web Architecture:**
- [Web Application Architecture: The Latest Guide (2026 AI Update)](https://www.clickittech.com/software-development/web-application-architecture/)
- [Web Application Architecture: Key Components and Layers](https://hqsoftwarelab.com/blog/web-application-architecture/)

**Calculator Implementation Patterns:**
- [GitHub - WebDevSimplified/Vanilla-JavaScript-Calculator](https://github.com/WebDevSimplified/Vanilla-JavaScript-Calculator)
- [Building a Fully Functional Interactive Calculator with Vanilla JavaScript](https://blog.michaelforde.com/building-a-fully-functional-interactive-calculator-with-vanilla-javascript/)
- [Building a Simple Calculator with React.js](https://medium.com/@gosagnik/building-a-simple-calculator-with-react-js-65a5a2fb43e2)

**Architecture Patterns:**
- [Design Patterns For Calculator Component Interactions](https://peerdh.com/blogs/programming-insights/design-patterns-for-calculator-component-interactions-3)
- [Basic Calculator: A Low-Level Design Approach](https://medium.com/@riyag283/basic-calculator-a-low-level-design-approach-b00c8fb39edd)

**MVC Pattern:**
- [Model View Controller: How to Use the MVC Architecture to Achieve Separation of Concerns](https://medium.com/@andrew.dewhirst8/model-view-controller-how-to-use-the-mvc-architecture-to-achieve-separation-of-concerns-1042c093f51d)
- [GitHub - jmbothe/calculator-MVC](https://github.com/jmbothe/calculator-MVC)
- [The Model View Controller Pattern – MVC Architecture and Frameworks Explained](https://www.freecodecamp.org/news/the-model-view-controller-pattern-mvc-architecture-and-frameworks-explained/)

**State Management:**
- [Mastering State Management in Web Applications](https://medium.com/@arunkumarofficialwork/mastering-state-management-in-web-applications-a-deep-dive-into-strategy-tools-and-best-e9d2e3f69942)
- [State Management: A Guide to Handling Application State Efficiently](https://medium.com/@sumajagurlinka22/state-management-a-guide-to-handling-application-state-efficiently-7751f4abc6e6)

**Keyboard Support:**
- [Build a Feature-Rich Calculator with Pure JS](https://medium.com/@igorcbraz/build-a-feature-rich-calculator-with-pure-javascript-20ce17fbe47d)
- [GitHub - fs98/calculator (Vanilla JavaScript Calculator with keyboard support)](https://github.com/fs98/calculator)

**History & LocalStorage:**
- [Calculator with History Function in HTML, CSS, and JavaScript](https://maximmaeder.com/calculator-with-history-function-in-html-css-and-javascript/)
- [The Art of Persistent Local Storage: A Developer's Guide to State Persistence](https://medium.com/@lcs2021021/the-art-of-persistent-local-storage-a-developers-guide-to-state-persistence-29ed77816ea6)
- [Using Browser Storage for Application State Management](https://medium.com/@artemkhrenov/using-browser-storage-for-application-state-management-705ae125e174)

**Floating-Point Precision:**
- [Math is Hard in JavaScript: Floating-Point Precision in JavaScript](https://patrickkarsh.medium.com/why-math-is-hard-in-javascript-floating-point-precision-in-javascript-41706aa7a89d)
- [Handling Floating Point Precision in JavaScript](https://www.javacodegeeks.com/2024/11/handling-floating-point-precision-in-javascript.html)
- [JavaScript Rounding Errors (in Financial Applications)](https://www.robinwieruch.de/javascript-rounding-errors/)
- [Understanding Floating Point Errors and How to Avoid Them](https://medium.com/@ashandimanthalk/understanding-floating-point-errors-and-how-to-avoid-them-with-javascript-examples-aade8df393b3)

---
*Architecture research for: Calculator Web App*
*Researched: 2026-02-14*
