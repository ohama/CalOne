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
    const result = performCalculation();

    calculator.displayValue = String(result);
    calculator.firstOperand = result;
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
