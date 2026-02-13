// Update display element with current calculator value
function updateDisplay() {
  const display = document.getElementById('display');
  display.textContent = formatForDisplay(calculator.displayValue);
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
});

// Log ready message
console.log('Calculator engine loaded. Try the commands in the instructions above.');
console.log('Current state:', calculator);
