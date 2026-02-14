# Calculator

A lightweight, accessible calculator web application built with vanilla JavaScript.

## Features

- Basic arithmetic operations (+, -, ×, ÷)
- Percentage calculations
- Sign toggling (+/-)
- Clear and backspace functionality
- Keyboard support
- Calculation history with localStorage persistence
- Responsive design for mobile and desktop

## Testing

This project uses Vitest for automated testing.

### Running Tests

```bash
# Install dependencies (first time only)
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

- `tests/calculator.test.js` - Unit tests for calculation logic
- `tests/history.test.js` - localStorage persistence tests (browser mode)
- `tests/integration.test.js` - DOM interaction and integration tests (browser mode)

Tests run automatically in GitHub Actions CI on every push.

## Development

Open `index.html` in a web browser to run the application locally. No build step required.

## License

MIT
