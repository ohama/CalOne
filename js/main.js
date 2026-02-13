// Update display element with current calculator value
function updateDisplay() {
  const display = document.getElementById('display');
  display.textContent = formatForDisplay(calculator.displayValue);
}

// Handle keyboard input for calculator
function handleKeyboardInput(event) {
  // Early return if event already handled
  if (event.defaultPrevented) return;

  let handled = false;

  // Number keys (0-9)
  if (event.key >= '0' && event.key <= '9') {
    inputDigit(event.key);
    handled = true;
  }
  // Operator keys (+, -, *, /)
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

  // Prevent default browser behavior and update display for handled keys
  if (handled) {
    event.preventDefault();
    updateDisplay();
  }
}

// Handle button clicks using event delegation
function handleButtonClick(event) {
  // Guard: only handle button clicks
  const button = event.target.closest('button');
  if (!button) return;

  const { action, value } = button.dataset;

  // Dispatch to calculator API based on action
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
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  updateDisplay();

  const buttonContainer = document.querySelector('.calculator-buttons');
  if (buttonContainer) {
    buttonContainer.addEventListener('click', handleButtonClick);
  }

  const backspaceButton = document.querySelector('.button-backspace');
  if (backspaceButton) {
    backspaceButton.addEventListener('click', handleButtonClick);
  }

  // Attach keyboard event listener
  document.addEventListener('keydown', handleKeyboardInput);
});

// Log ready message
console.log('Calculator engine loaded. Try the commands in the instructions above.');
console.log('Current state:', calculator);
