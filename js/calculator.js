// Calculator state object
const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

/**
 * Handle digit input (0-9)
 * @param {string} digit - The digit to input
 */
function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}

/**
 * Handle decimal point input
 * Prevents multiple decimal points in a single number
 */
function inputDecimal() {
  if (calculator.waitingForSecondOperand === true) {
    calculator.displayValue = '0.';
    calculator.waitingForSecondOperand = false;
    return;
  }

  // Only add decimal if one doesn't already exist
  if (!calculator.displayValue.includes('.')) {
    calculator.displayValue += '.';
  }
}

/**
 * Handle operator selection (+, -, ×, ÷, =)
 * @param {string} nextOperator - The operator to apply
 */
function handleOperator(nextOperator) {
  const inputValue = parseFloat(calculator.displayValue);

  if (calculator.firstOperand === null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (calculator.operator) {
    // Track completed calculation for history (only binary operations when = is pressed)
    if (nextOperator === '=' && calculator.operator !== '=') {
      const expression = `${calculator.firstOperand} ${calculator.operator} ${calculator.displayValue}`;
      const result = performCalculation();

      // Only add to history if result is not an error
      if (result !== 'Error' && typeof addToHistory === 'function') {
        addToHistory(expression, String(result));
      }

      calculator.displayValue = String(result);
      calculator.firstOperand = result;
    } else {
      const result = performCalculation();
      calculator.displayValue = String(result);
      calculator.firstOperand = result;
    }
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}

/**
 * Perform the arithmetic calculation
 * @returns {number|string} - The result or 'Error' for division by zero
 */
function performCalculation() {
  const { firstOperand, displayValue, operator } = calculator;
  const prev = firstOperand;
  const current = parseFloat(displayValue);

  // Guard clause: Division by zero
  if (operator === '÷' && current === 0) {
    return 'Error';
  }

  let result;

  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '×':
      result = prev * current;
      break;
    case '÷':
      result = prev / current;
      break;
    case '=':
      result = current;
      break;
    default:
      return current;
  }

  // Fix floating-point precision errors
  // This ensures 0.1 + 0.2 = 0.3, not 0.30000000000000004
  return parseFloat(result.toFixed(10));
}

/**
 * Reset calculator to initial state (AC - All Clear)
 */
function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
}

/**
 * Toggle sign of current number (+/-)
 */
function toggleSign() {
  const current = parseFloat(calculator.displayValue);
  calculator.displayValue = String(current * -1);
}

/**
 * Calculate percentage
 * Contextual: If in middle of operation, calculates percentage of first operand
 * Simple: Otherwise, divides by 100
 */
function handlePercent() {
  const current = parseFloat(calculator.displayValue);
  const { firstOperand, operator } = calculator;

  if (firstOperand !== null && operator) {
    // Contextual percent: "50 + 10%" means 50 + (50 × 0.1) = 55
    const percentValue = (firstOperand * current) / 100;
    calculator.displayValue = String(percentValue);
  } else {
    // Simple conversion: "25%" → 0.25
    calculator.displayValue = String(current / 100);
  }
}

/**
 * Handle backspace - delete last digit from display
 * Handles edge cases: Error state, single digit, waitingForSecondOperand
 */
function handleBackspace() {
  const { displayValue, waitingForSecondOperand } = calculator;

  // If displaying Error, reset to '0'
  if (displayValue === 'Error') {
    calculator.displayValue = '0';
    return;
  }

  // If waiting for second operand, clear display and reset flag
  if (waitingForSecondOperand) {
    calculator.displayValue = '0';
    calculator.waitingForSecondOperand = false;
    return;
  }

  // If single digit (e.g., "5"), reset to '0'
  if (displayValue.length === 1) {
    calculator.displayValue = '0';
    return;
  }

  // If single digit with negative sign (e.g., "-3"), reset to '0'
  if (displayValue.length === 2 && displayValue.startsWith('-')) {
    calculator.displayValue = '0';
    return;
  }

  // Otherwise, remove last character
  calculator.displayValue = displayValue.slice(0, -1);
}

/**
 * Format value for display, handling overflow with scientific notation
 * @param {string|number} value - The value to format
 * @param {number} maxDigits - Maximum digits before using scientific notation
 * @returns {string} - Formatted display string
 */
function formatForDisplay(value, maxDigits = 10) {
  if (value === 'Error') {
    return value;
  }

  const valueStr = String(value);

  // Count digits excluding '-' and '.'
  const digitCount = valueStr.replace(/[-.]/g, '').length;

  if (digitCount > maxDigits) {
    return Number(value).toExponential(2);
  }

  return valueStr;
}
