// @vitest-environment browser
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { updateDisplay, handleButtonClick, handleKeyboardInput } from '../js/main.js'
import { calculator, resetCalculator, inputDigit, handleOperator } from '../js/calculator.js'
import { clearHistory } from '../js/history.js'

describe('Integration Tests - DOM and Events', () => {
  beforeEach(() => {
    // Create minimal DOM structure for testing
    document.body.innerHTML = `
      <div class="calculator-container">
        <div class="calculator">
          <div class="calculator-display-row">
            <div class="calculator-display" id="display">0</div>
            <button type="button" class="button-backspace" data-action="backspace">⌫</button>
          </div>
          <div class="calculator-buttons">
            <button type="button" class="button button-function" data-action="clear">AC</button>
            <button type="button" class="button button-function" data-action="sign">+/-</button>
            <button type="button" class="button button-function" data-action="percent">%</button>
            <button type="button" class="button button-operator" data-action="operator" data-value="÷">÷</button>
            <button type="button" class="button" data-action="digit" data-value="7">7</button>
            <button type="button" class="button" data-action="digit" data-value="8">8</button>
            <button type="button" class="button" data-action="digit" data-value="9">9</button>
            <button type="button" class="button button-operator" data-action="operator" data-value="×">×</button>
            <button type="button" class="button" data-action="digit" data-value="4">4</button>
            <button type="button" class="button" data-action="digit" data-value="5">5</button>
            <button type="button" class="button" data-action="digit" data-value="6">6</button>
            <button type="button" class="button button-operator" data-action="operator" data-value="-">-</button>
            <button type="button" class="button" data-action="digit" data-value="1">1</button>
            <button type="button" class="button" data-action="digit" data-value="2">2</button>
            <button type="button" class="button" data-action="digit" data-value="3">3</button>
            <button type="button" class="button button-operator" data-action="operator" data-value="+">+</button>
            <button type="button" class="button button-zero" data-action="digit" data-value="0">0</button>
            <button type="button" class="button" data-action="decimal">.</button>
            <button type="button" class="button button-operator" data-action="operator" data-value="=">=</button>
          </div>
        </div>
        <div class="history-panel">
          <div class="history-header">
            <h2>History</h2>
            <button type="button" class="button-clear-history" data-action="clear-history">Clear</button>
          </div>
          <div id="history-list" class="history-list">
            <p class="history-empty">No calculations yet</p>
          </div>
        </div>
      </div>
    `

    // Reset calculator state
    resetCalculator()

    // Clear history and localStorage
    clearHistory()
    localStorage.clear()
  })

  afterEach(() => {
    // Clean up DOM
    document.body.innerHTML = ''
  })

  describe('DOM Setup and Display Updates', () => {
    it('should have display element in DOM', () => {
      const display = document.getElementById('display')
      expect(display).toBeTruthy()
      expect(display.textContent).toBe('0')
    })

    it('should update display element when updateDisplay() is called', () => {
      calculator.displayValue = '42'
      updateDisplay()

      const display = document.getElementById('display')
      expect(display.textContent).toBe('42')
    })

    it('should reflect calculator state in display', () => {
      inputDigit('5')
      updateDisplay()

      const display = document.getElementById('display')
      expect(display.textContent).toBe('5')
    })

    it('should display large numbers correctly', () => {
      calculator.displayValue = '1000000'
      updateDisplay()

      const display = document.getElementById('display')
      expect(display.textContent).toBe('1000000')
    })
  })

  describe('Button Click Handling', () => {
    it('should update display when digit button is clicked', () => {
      const button = document.querySelector('[data-value="2"]')
      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: button, enumerable: true })

      handleButtonClick(event)

      const display = document.getElementById('display')
      expect(display.textContent).toBe('2')
    })

    it('should handle operator button click', () => {
      inputDigit('5')
      updateDisplay()

      const operatorButton = document.querySelector('[data-value="+"]')
      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: operatorButton, enumerable: true })

      handleButtonClick(event)

      expect(calculator.operator).toBe('+')
      expect(calculator.waitingForSecondOperand).toBe(true)
    })

    it('should handle equals button click and show result', () => {
      inputDigit('2')
      handleOperator('+')
      inputDigit('3')
      updateDisplay()

      const equalsButton = document.querySelector('[data-value="="]')
      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: equalsButton, enumerable: true })

      handleButtonClick(event)

      const display = document.getElementById('display')
      expect(display.textContent).toBe('5')
    })

    it('should complete full calculation flow: 2 + 3 = 5', () => {
      // Click 2
      const button2 = document.querySelector('[data-value="2"]')
      let event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: button2, enumerable: true })
      handleButtonClick(event)

      // Click +
      const buttonPlus = document.querySelector('[data-value="+"]')
      event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: buttonPlus, enumerable: true })
      handleButtonClick(event)

      // Click 3
      const button3 = document.querySelector('[data-value="3"]')
      event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: button3, enumerable: true })
      handleButtonClick(event)

      // Click =
      const buttonEquals = document.querySelector('[data-value="="]')
      event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: buttonEquals, enumerable: true })
      handleButtonClick(event)

      const display = document.getElementById('display')
      expect(display.textContent).toBe('5')
      expect(calculator.displayValue).toBe('5')
    })

    it('should handle clear button click', () => {
      inputDigit('9')
      inputDigit('9')
      updateDisplay()

      const clearButton = document.querySelector('[data-action="clear"]')
      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: clearButton, enumerable: true })

      handleButtonClick(event)

      const display = document.getElementById('display')
      expect(display.textContent).toBe('0')
      expect(calculator.displayValue).toBe('0')
    })

    it('should handle decimal button click', () => {
      const decimalButton = document.querySelector('[data-action="decimal"]')
      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: decimalButton, enumerable: true })

      handleButtonClick(event)

      const display = document.getElementById('display')
      expect(display.textContent).toBe('0.')
    })

    it('should handle backspace button click', () => {
      inputDigit('1')
      inputDigit('2')
      inputDigit('3')
      updateDisplay()

      const backspaceButton = document.querySelector('[data-action="backspace"]')
      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: backspaceButton, enumerable: true })

      handleButtonClick(event)

      const display = document.getElementById('display')
      expect(display.textContent).toBe('12')
    })
  })

  describe('Keyboard Event Handling', () => {
    it('should handle digit key press', () => {
      const event = new KeyboardEvent('keydown', { key: '2' })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      handleKeyboardInput(event)

      expect(calculator.displayValue).toBe('2')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should handle operator key press', () => {
      inputDigit('5')

      const event = new KeyboardEvent('keydown', { key: '+' })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      handleKeyboardInput(event)

      expect(calculator.operator).toBe('+')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should map asterisk to multiplication symbol', () => {
      inputDigit('3')

      const event = new KeyboardEvent('keydown', { key: '*' })
      handleKeyboardInput(event)

      expect(calculator.operator).toBe('×')
    })

    it('should map slash to division symbol', () => {
      inputDigit('8')

      const event = new KeyboardEvent('keydown', { key: '/' })
      handleKeyboardInput(event)

      expect(calculator.operator).toBe('÷')
    })

    it('should handle Enter key for equals', () => {
      inputDigit('2')
      handleOperator('+')
      inputDigit('3')

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      handleKeyboardInput(event)

      expect(calculator.displayValue).toBe('5')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should handle equals key for calculation', () => {
      inputDigit('1')
      inputDigit('0')
      handleOperator('-')
      inputDigit('4')

      const event = new KeyboardEvent('keydown', { key: '=' })
      handleKeyboardInput(event)

      expect(calculator.displayValue).toBe('6')
    })

    it('should handle Escape key for clear', () => {
      inputDigit('9')
      inputDigit('9')

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      handleKeyboardInput(event)

      expect(calculator.displayValue).toBe('0')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should handle Backspace key for delete', () => {
      inputDigit('1')
      inputDigit('2')
      inputDigit('3')

      const event = new KeyboardEvent('keydown', { key: 'Backspace' })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      handleKeyboardInput(event)

      expect(calculator.displayValue).toBe('12')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should handle decimal point key', () => {
      inputDigit('5')

      const event = new KeyboardEvent('keydown', { key: '.' })
      handleKeyboardInput(event)

      expect(calculator.displayValue).toBe('5.')
    })

    it('should not prevent default for unhandled keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      handleKeyboardInput(event)

      expect(preventDefaultSpy).not.toHaveBeenCalled()
    })

    it('should skip already-prevented events', () => {
      const event = new KeyboardEvent('keydown', { key: '5' })
      Object.defineProperty(event, 'defaultPrevented', { value: true })

      handleKeyboardInput(event)

      // Calculator state should not change
      expect(calculator.displayValue).toBe('0')
    })
  })

  describe('Full Calculation Flows', () => {
    it('should complete 2 + 3 = 5 via button clicks', () => {
      const button2 = document.querySelector('[data-value="2"]')
      const buttonPlus = document.querySelector('[data-value="+"]')
      const button3 = document.querySelector('[data-value="3"]')
      const buttonEquals = document.querySelector('[data-value="="]')

      // Simulate button clicks
      handleButtonClick({ target: button2, bubbles: true })
      handleButtonClick({ target: buttonPlus, bubbles: true })
      handleButtonClick({ target: button3, bubbles: true })
      handleButtonClick({ target: buttonEquals, bubbles: true })

      const display = document.getElementById('display')
      expect(display.textContent).toBe('5')
    })

    it('should complete 10 - 4 = 6 via keyboard events', () => {
      handleKeyboardInput(new KeyboardEvent('keydown', { key: '1' }))
      handleKeyboardInput(new KeyboardEvent('keydown', { key: '0' }))
      handleKeyboardInput(new KeyboardEvent('keydown', { key: '-' }))
      handleKeyboardInput(new KeyboardEvent('keydown', { key: '4' }))
      handleKeyboardInput(new KeyboardEvent('keydown', { key: 'Enter' }))

      expect(calculator.displayValue).toBe('6')

      updateDisplay()
      const display = document.getElementById('display')
      expect(display.textContent).toBe('6')
    })

    it('should complete 8 × 7 = 56 via mixed button and keyboard', () => {
      // Enter 8 via keyboard
      handleKeyboardInput(new KeyboardEvent('keydown', { key: '8' }))

      // Click × button
      const buttonMultiply = document.querySelector('[data-value="×"]')
      handleButtonClick({ target: buttonMultiply, bubbles: true })

      // Enter 7 via keyboard
      handleKeyboardInput(new KeyboardEvent('keydown', { key: '7' }))

      // Click = button
      const buttonEquals = document.querySelector('[data-value="="]')
      handleButtonClick({ target: buttonEquals, bubbles: true })

      const display = document.getElementById('display')
      expect(display.textContent).toBe('56')
    })

    it('should complete decimal calculation 2.5 + 1.5 = 4', () => {
      const button2 = document.querySelector('[data-value="2"]')
      const buttonDecimal = document.querySelector('[data-action="decimal"]')
      const button5 = document.querySelector('[data-value="5"]')
      const buttonPlus = document.querySelector('[data-value="+"]')
      const button1 = document.querySelector('[data-value="1"]')
      const buttonEquals = document.querySelector('[data-value="="]')

      handleButtonClick({ target: button2, bubbles: true })
      handleButtonClick({ target: buttonDecimal, bubbles: true })
      handleButtonClick({ target: button5, bubbles: true })
      handleButtonClick({ target: buttonPlus, bubbles: true })
      handleButtonClick({ target: button1, bubbles: true })
      handleButtonClick({ target: buttonDecimal, bubbles: true })
      handleButtonClick({ target: button5, bubbles: true })
      handleButtonClick({ target: buttonEquals, bubbles: true })

      const display = document.getElementById('display')
      expect(display.textContent).toBe('4')
    })

    it('should handle clear mid-calculation', () => {
      inputDigit('5')
      handleOperator('+')
      inputDigit('3')

      const clearButton = document.querySelector('[data-action="clear"]')
      handleButtonClick({ target: clearButton, bubbles: true })

      expect(calculator.displayValue).toBe('0')
      expect(calculator.operator).toBeNull()
      expect(calculator.firstOperand).toBeNull()
    })
  })

  describe('Event Delegation', () => {
    it('should handle click on button element via closest()', () => {
      const button = document.querySelector('[data-value="7"]')

      // Create a click event on the button
      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: button, enumerable: true })

      // Mock closest to return the button
      button.closest = vi.fn(() => button)

      handleButtonClick(event)

      expect(button.closest).toHaveBeenCalledWith('button')
      expect(calculator.displayValue).toBe('7')
    })

    it('should handle click on button child element via closest()', () => {
      const button = document.querySelector('[data-value="8"]')

      // Create a span inside the button
      const span = document.createElement('span')
      span.textContent = '8'
      button.appendChild(span)

      // Create click event on the span
      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: span, enumerable: true })

      handleButtonClick(event)

      expect(calculator.displayValue).toBe('8')
    })

    it('should not handle click outside buttons', () => {
      const display = document.getElementById('display')
      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: display, enumerable: true })

      // Should not change calculator state
      handleButtonClick(event)

      expect(calculator.displayValue).toBe('0')
    })

    it('should not handle click on non-button element', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: div, enumerable: true })

      handleButtonClick(event)

      expect(calculator.displayValue).toBe('0')
    })
  })

  describe('Integration with History', () => {
    it('should allow clear history button click', () => {
      const clearHistoryButton = document.querySelector('[data-action="clear-history"]')
      expect(clearHistoryButton).toBeTruthy()

      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'target', { value: clearHistoryButton, enumerable: true })

      // Should not throw
      expect(() => handleButtonClick(event)).not.toThrow()
    })

    it('should have history list element in DOM', () => {
      const historyList = document.getElementById('history-list')
      expect(historyList).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid button clicks', () => {
      const button5 = document.querySelector('[data-value="5"]')

      // Click 5 multiple times rapidly
      for (let i = 0; i < 5; i++) {
        const event = new MouseEvent('click', { bubbles: true })
        Object.defineProperty(event, 'target', { value: button5, enumerable: true })
        handleButtonClick(event)
      }

      const display = document.getElementById('display')
      expect(display.textContent).toBe('55555')
    })

    it('should handle rapid keyboard events', () => {
      for (let i = 0; i < 3; i++) {
        handleKeyboardInput(new KeyboardEvent('keydown', { key: '9' }))
      }

      updateDisplay()
      const display = document.getElementById('display')
      expect(display.textContent).toBe('999')
    })

    it('should maintain state consistency between button and keyboard', () => {
      // Start with button
      const button2 = document.querySelector('[data-value="2"]')
      handleButtonClick({ target: button2, bubbles: true })

      // Continue with keyboard
      handleKeyboardInput(new KeyboardEvent('keydown', { key: '+' }))
      handleKeyboardInput(new KeyboardEvent('keydown', { key: '3' }))

      // Finish with button
      const buttonEquals = document.querySelector('[data-value="="]')
      handleButtonClick({ target: buttonEquals, bubbles: true })

      expect(calculator.displayValue).toBe('5')
    })
  })
})
