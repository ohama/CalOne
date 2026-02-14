import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock history.js before importing calculator
vi.mock('../js/history.js', () => ({
  addToHistory: vi.fn(),
}))

import {
  calculator,
  inputDigit,
  inputDecimal,
  handleOperator,
  resetCalculator,
  toggleSign,
  handlePercent,
  handleBackspace,
  formatForDisplay
} from '../js/calculator.js'

describe('Calculator', () => {
  beforeEach(() => {
    resetCalculator()
  })

  describe('Basic Arithmetic Operations', () => {
    it('should add two numbers: 2 + 3 = 5', () => {
      inputDigit('2')
      handleOperator('+')
      inputDigit('3')
      handleOperator('=')
      expect(calculator.displayValue).toBe('5')
    })

    it('should subtract two numbers: 10 - 4 = 6', () => {
      inputDigit('1')
      inputDigit('0')
      handleOperator('-')
      inputDigit('4')
      handleOperator('=')
      expect(calculator.displayValue).toBe('6')
    })

    it('should multiply two numbers: 5 × 3 = 15', () => {
      inputDigit('5')
      handleOperator('×')
      inputDigit('3')
      handleOperator('=')
      expect(calculator.displayValue).toBe('15')
    })

    it('should divide two numbers: 8 ÷ 2 = 4', () => {
      inputDigit('8')
      handleOperator('÷')
      inputDigit('2')
      handleOperator('=')
      expect(calculator.displayValue).toBe('4')
    })
  })

  describe('Floating-Point Precision', () => {
    it('should handle 0.1 + 0.2 = 0.3 correctly', () => {
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

    it('should handle 0.3 - 0.1 = 0.2 correctly', () => {
      inputDigit('0')
      inputDecimal()
      inputDigit('3')
      handleOperator('-')
      inputDigit('0')
      inputDecimal()
      inputDigit('1')
      handleOperator('=')
      expect(calculator.displayValue).toBe('0.2')
    })

    it('should handle complex floating-point multiplication', () => {
      inputDigit('0')
      inputDecimal()
      inputDigit('1')
      handleOperator('×')
      inputDigit('0')
      inputDecimal()
      inputDigit('3')
      handleOperator('=')
      expect(calculator.displayValue).toBe('0.03')
    })
  })

  describe('Edge Cases', () => {
    it('should return Error for division by zero', () => {
      inputDigit('8')
      handleOperator('÷')
      inputDigit('0')
      handleOperator('=')
      expect(calculator.displayValue).toBe('Error')
    })

    it('should prevent multiple decimal points', () => {
      inputDigit('5')
      inputDecimal()
      inputDigit('2')
      inputDecimal() // Second decimal should be ignored
      inputDigit('3')
      expect(calculator.displayValue).toBe('5.23')
    })

    it('should reset display to 0 when backspacing single digit', () => {
      inputDigit('7')
      handleBackspace()
      expect(calculator.displayValue).toBe('0')
    })

    it('should reset to 0 when backspacing Error state', () => {
      inputDigit('5')
      handleOperator('÷')
      inputDigit('0')
      handleOperator('=')
      expect(calculator.displayValue).toBe('Error')
      handleBackspace()
      expect(calculator.displayValue).toBe('0')
    })

    it('should reset to 0 when backspacing after operator (waitingForSecondOperand)', () => {
      inputDigit('5')
      handleOperator('+')
      handleBackspace()
      expect(calculator.displayValue).toBe('0')
      expect(calculator.waitingForSecondOperand).toBe(false)
    })

    it('should reset to 0 when backspacing single negative digit', () => {
      inputDigit('5')
      toggleSign()
      expect(calculator.displayValue).toBe('-5')
      handleBackspace()
      expect(calculator.displayValue).toBe('0')
    })
  })

  describe('Operator Chaining', () => {
    it('should chain addition: 2 + 3 + 4 = 9', () => {
      inputDigit('2')
      handleOperator('+')
      inputDigit('3')
      handleOperator('+')
      expect(calculator.displayValue).toBe('5') // Intermediate result
      inputDigit('4')
      handleOperator('=')
      expect(calculator.displayValue).toBe('9')
    })

    it('should chain subtraction: 10 - 2 - 3 = 5', () => {
      inputDigit('1')
      inputDigit('0')
      handleOperator('-')
      inputDigit('2')
      handleOperator('-')
      expect(calculator.displayValue).toBe('8') // Intermediate result
      inputDigit('3')
      handleOperator('=')
      expect(calculator.displayValue).toBe('5')
    })

    it('should chain mixed operations: 10 × 2 - 5 = 15', () => {
      inputDigit('1')
      inputDigit('0')
      handleOperator('×')
      inputDigit('2')
      handleOperator('-')
      expect(calculator.displayValue).toBe('20') // Intermediate result
      inputDigit('5')
      handleOperator('=')
      expect(calculator.displayValue).toBe('15')
    })
  })

  describe('Unary Operations', () => {
    describe('Sign Toggle', () => {
      it('should toggle positive to negative', () => {
        inputDigit('5')
        toggleSign()
        expect(calculator.displayValue).toBe('-5')
      })

      it('should toggle negative to positive', () => {
        inputDigit('5')
        toggleSign()
        toggleSign()
        expect(calculator.displayValue).toBe('5')
      })

      it('should toggle zero', () => {
        resetCalculator()
        toggleSign()
        expect(calculator.displayValue).toBe('0')
      })
    })

    describe('Percent', () => {
      it('should calculate simple percent: 25% = 0.25', () => {
        inputDigit('2')
        inputDigit('5')
        handlePercent()
        expect(calculator.displayValue).toBe('0.25')
      })

      it('should calculate contextual percent: 200 + 10% = 220', () => {
        inputDigit('2')
        inputDigit('0')
        inputDigit('0')
        handleOperator('+')
        inputDigit('1')
        inputDigit('0')
        handlePercent()
        handleOperator('=')
        expect(calculator.displayValue).toBe('220')
      })

      it('should calculate contextual percent: 50 - 20% = 40', () => {
        inputDigit('5')
        inputDigit('0')
        handleOperator('-')
        inputDigit('2')
        inputDigit('0')
        handlePercent()
        handleOperator('=')
        expect(calculator.displayValue).toBe('40')
      })

      it('should calculate contextual percent: 100 × 5% = 500', () => {
        inputDigit('1')
        inputDigit('0')
        inputDigit('0')
        handleOperator('×')
        inputDigit('5')
        handlePercent()
        // Percent calculates (100 * 5) / 100 = 5, then 100 × 5 = 500
        handleOperator('=')
        expect(calculator.displayValue).toBe('500')
      })
    })
  })

  describe('Decimal Input', () => {
    it('should start decimal entry with 0.', () => {
      inputDecimal()
      inputDigit('5')
      expect(calculator.displayValue).toBe('0.5')
    })

    it('should append decimal point to existing number', () => {
      inputDigit('3')
      inputDecimal()
      inputDigit('1')
      inputDigit('4')
      expect(calculator.displayValue).toBe('3.14')
    })

    it('should start new decimal after operator', () => {
      inputDigit('5')
      handleOperator('+')
      inputDecimal()
      inputDigit('2')
      expect(calculator.displayValue).toBe('0.2')
    })
  })

  describe('Backspace Functionality', () => {
    it('should remove last digit from multi-digit number', () => {
      inputDigit('1')
      inputDigit('2')
      inputDigit('3')
      handleBackspace()
      expect(calculator.displayValue).toBe('12')
    })

    it('should remove decimal point', () => {
      inputDigit('5')
      inputDecimal()
      handleBackspace()
      expect(calculator.displayValue).toBe('5')
    })

    it('should handle backspace on decimal number', () => {
      inputDigit('3')
      inputDecimal()
      inputDigit('1')
      inputDigit('4')
      handleBackspace()
      handleBackspace()
      // After removing '4' and '1', we have '3.' (decimal point remains)
      expect(calculator.displayValue).toBe('3.')
    })

    it('should reset to 0 from negative single digit', () => {
      inputDigit('3')
      toggleSign()
      handleBackspace()
      expect(calculator.displayValue).toBe('0')
    })
  })

  describe('Reset Functionality', () => {
    it('should reset all calculator state', () => {
      inputDigit('5')
      handleOperator('+')
      inputDigit('3')
      resetCalculator()
      expect(calculator.displayValue).toBe('0')
      expect(calculator.firstOperand).toBe(null)
      expect(calculator.operator).toBe(null)
      expect(calculator.waitingForSecondOperand).toBe(false)
    })

    it('should allow calculation after reset', () => {
      inputDigit('5')
      handleOperator('+')
      resetCalculator()
      inputDigit('2')
      handleOperator('+')
      inputDigit('3')
      handleOperator('=')
      expect(calculator.displayValue).toBe('5')
    })
  })

  describe('Display Formatting', () => {
    it('should format normal numbers without scientific notation', () => {
      expect(formatForDisplay('123')).toBe('123')
      expect(formatForDisplay('0.5')).toBe('0.5')
    })

    it('should format Error as-is', () => {
      expect(formatForDisplay('Error')).toBe('Error')
    })

    it('should use scientific notation for numbers exceeding max digits', () => {
      const largeNumber = '12345678901' // 11 digits
      const result = formatForDisplay(largeNumber)
      expect(result).toContain('e+')
    })

    it('should handle decimal numbers within digit limit', () => {
      expect(formatForDisplay('123.456789')).toBe('123.456789')
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle complex calculation: 15 + 3 × 2 (step by step)', () => {
      // Note: This calculator evaluates left-to-right, not algebraically
      inputDigit('1')
      inputDigit('5')
      handleOperator('+')
      inputDigit('3')
      handleOperator('×')
      // At this point, 15 + 3 = 18 (intermediate)
      expect(calculator.displayValue).toBe('18')
      inputDigit('2')
      handleOperator('=')
      expect(calculator.displayValue).toBe('36') // 18 × 2
    })

    it('should recover from error state', () => {
      inputDigit('5')
      handleOperator('÷')
      inputDigit('0')
      handleOperator('=')
      expect(calculator.displayValue).toBe('Error')
      resetCalculator()
      inputDigit('2')
      handleOperator('+')
      inputDigit('3')
      handleOperator('=')
      expect(calculator.displayValue).toBe('5')
    })

    it('should handle repeated equals: 5 + 2 = = =', () => {
      inputDigit('5')
      handleOperator('+')
      inputDigit('2')
      handleOperator('=')
      expect(calculator.displayValue).toBe('7')
      // Subsequent = presses maintain the result (operator is already '=')
      handleOperator('=')
      expect(calculator.displayValue).toBe('7')
      handleOperator('=')
      expect(calculator.displayValue).toBe('7')
    })

    it('should start fresh number entry after equals', () => {
      inputDigit('5')
      handleOperator('+')
      inputDigit('3')
      handleOperator('=')
      expect(calculator.displayValue).toBe('8')
      inputDigit('2')
      expect(calculator.displayValue).toBe('2') // New number, not appending to result
    })
  })
})
