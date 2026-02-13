// Update display element with current calculator value
function updateDisplay() {
  const display = document.getElementById('display');
  display.textContent = formatForDisplay(calculator.displayValue);
}

// Initialize
updateDisplay();

// Log ready message
console.log('Calculator engine loaded. Try the commands in the instructions above.');
console.log('Current state:', calculator);
