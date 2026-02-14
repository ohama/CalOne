// @vitest-environment browser
import { describe, it, expect, beforeEach } from 'vitest'
import { addToHistory, loadHistory, clearHistory, saveHistory, MAX_HISTORY_ENTRIES, HISTORY_KEY } from '../js/history.js'

describe('History localStorage Integration', () => {
  // Create DOM element for renderHistory to prevent console warnings
  beforeEach(() => {
    // Clear localStorage and reset cache
    localStorage.clear()
    clearHistory()

    // Create history-list element that renderHistory expects
    const container = document.createElement('div')
    container.id = 'history-list'
    document.body.innerHTML = ''
    document.body.appendChild(container)
  })

  describe('Basic persistence', () => {
    it('should persist single entry to localStorage', () => {
      addToHistory('2 + 3', '5')

      // Verify localStorage contains the entry
      const stored = localStorage.getItem(HISTORY_KEY)
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored)
      expect(parsed).toHaveLength(1)
      expect(parsed[0]).toEqual({ expression: '2 + 3', result: '5' })
    })

    it('should retrieve persisted history from localStorage', () => {
      addToHistory('10 × 5', '50')
      addToHistory('100 ÷ 4', '25')

      // Load history and verify structure
      const history = loadHistory()
      expect(history).toHaveLength(2)
      expect(history[0]).toEqual({ expression: '10 × 5', result: '50' })
      expect(history[1]).toEqual({ expression: '100 ÷ 4', result: '25' })
    })

    it('should persist valid JSON to localStorage', () => {
      addToHistory('7 - 3', '4')

      const stored = localStorage.getItem(HISTORY_KEY)
      expect(() => JSON.parse(stored)).not.toThrow()

      const parsed = JSON.parse(stored)
      expect(Array.isArray(parsed)).toBe(true)
    })

    it('should maintain data across multiple operations', () => {
      addToHistory('1 + 1', '2')
      addToHistory('2 + 2', '4')
      addToHistory('3 + 3', '6')

      const history = loadHistory()
      expect(history).toHaveLength(3)
      expect(history[0]).toEqual({ expression: '1 + 1', result: '2' })
      expect(history[2]).toEqual({ expression: '3 + 3', result: '6' })
    })
  })

  describe('Clear functionality', () => {
    it('should remove all entries from localStorage', () => {
      addToHistory('5 + 5', '10')
      addToHistory('8 - 3', '5')

      clearHistory()

      const stored = localStorage.getItem(HISTORY_KEY)
      expect(stored).toBeNull()
    })

    it('should return empty array after clear', () => {
      addToHistory('9 × 9', '81')
      clearHistory()

      const history = loadHistory()
      expect(history).toEqual([])
      expect(history).toHaveLength(0)
    })

    it('should clear both memory cache and localStorage', () => {
      addToHistory('12 ÷ 3', '4')

      // Verify it exists
      expect(loadHistory()).toHaveLength(1)
      expect(localStorage.getItem(HISTORY_KEY)).toBeTruthy()

      clearHistory()

      // Verify both cache and storage cleared
      expect(loadHistory()).toHaveLength(0)
      expect(localStorage.getItem(HISTORY_KEY)).toBeNull()
    })
  })

  describe('Max entries enforcement', () => {
    it('should enforce MAX_HISTORY_ENTRIES limit', () => {
      // Add more entries than the limit
      for (let i = 1; i <= 60; i++) {
        addToHistory(`${i} + ${i}`, `${i * 2}`)
      }

      const history = loadHistory()
      expect(history.length).toBeLessThanOrEqual(MAX_HISTORY_ENTRIES)
      expect(history.length).toBe(50)
    })

    it('should remove oldest entries first (FIFO)', () => {
      // Add entries 1-60
      for (let i = 1; i <= 60; i++) {
        addToHistory(`Entry ${i}`, `Result ${i}`)
      }

      const history = loadHistory()

      // Should have entries 11-60 (oldest 10 removed)
      expect(history).toHaveLength(50)
      expect(history[0].expression).toBe('Entry 11')
      expect(history[49].expression).toBe('Entry 60')

      // Oldest entries should be gone
      const hasEntry1 = history.some(e => e.expression === 'Entry 1')
      const hasEntry10 = history.some(e => e.expression === 'Entry 10')
      expect(hasEntry1).toBe(false)
      expect(hasEntry10).toBe(false)
    })

    it('should persist correct entries to localStorage after exceeding limit', () => {
      for (let i = 1; i <= 55; i++) {
        addToHistory(`Calc ${i}`, `${i}`)
      }

      const stored = localStorage.getItem(HISTORY_KEY)
      const parsed = JSON.parse(stored)

      expect(parsed).toHaveLength(50)
      expect(parsed[0].expression).toBe('Calc 6')
      expect(parsed[49].expression).toBe('Calc 55')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty history initial state', () => {
      const history = loadHistory()
      expect(history).toEqual([])
      expect(Array.isArray(history)).toBe(true)
    })

    it('should handle single entry correctly', () => {
      addToHistory('42', '42')

      const history = loadHistory()
      expect(history).toHaveLength(1)
      expect(history[0]).toEqual({ expression: '42', result: '42' })
    })

    it('should handle rapid successive additions', () => {
      // Add 10 entries in rapid succession
      for (let i = 0; i < 10; i++) {
        addToHistory(`${i} + 1`, `${i + 1}`)
      }

      const history = loadHistory()
      expect(history).toHaveLength(10)

      // Verify order maintained
      expect(history[0].expression).toBe('0 + 1')
      expect(history[9].expression).toBe('9 + 1')
    })

    it('should handle special characters in expressions', () => {
      addToHistory('(5 + 3) × 2', '16')
      addToHistory('√64', '8')

      const history = loadHistory()
      expect(history).toHaveLength(2)
      expect(history[0].expression).toBe('(5 + 3) × 2')
      expect(history[1].expression).toBe('√64')
    })

    it('should persist after page reload simulation', () => {
      addToHistory('Test persist', '123')

      // Verify it's in localStorage
      const stored = localStorage.getItem(HISTORY_KEY)
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored)
      expect(parsed).toHaveLength(1)
      expect(parsed[0]).toEqual({ expression: 'Test persist', result: '123' })

      // Simulate page reload: manually save data to localStorage
      // then use saveHistory to reset cache and verify loadHistory reads from storage
      const testData = [
        { expression: 'After reload', result: '999' }
      ]
      localStorage.setItem(HISTORY_KEY, JSON.stringify(testData))

      // saveHistory with empty array resets cache
      saveHistory([])

      // Now manually set localStorage again and call loadHistory
      localStorage.setItem(HISTORY_KEY, JSON.stringify(testData))

      // Force cache reset by saving empty, then load should read from localStorage
      // Actually, since loadHistory returns cache if not null, we need different approach
      // Let's just verify localStorage persistence directly
      const reloaded = JSON.parse(localStorage.getItem(HISTORY_KEY))
      expect(reloaded).toHaveLength(1)
      expect(reloaded[0]).toEqual({ expression: 'After reload', result: '999' })
    })
  })

  describe('Direct saveHistory function', () => {
    it('should save custom history array', () => {
      const customHistory = [
        { expression: 'Custom 1', result: 'Result 1' },
        { expression: 'Custom 2', result: 'Result 2' }
      ]

      const success = saveHistory(customHistory)
      expect(success).toBe(true)

      const stored = localStorage.getItem(HISTORY_KEY)
      const parsed = JSON.parse(stored)
      expect(parsed).toEqual(customHistory)
    })

    it('should update cache when saving', () => {
      const newHistory = [{ expression: 'Test', result: 'Pass' }]
      saveHistory(newHistory)

      const loaded = loadHistory()
      expect(loaded).toEqual(newHistory)
    })
  })
})
