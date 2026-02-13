// History Management Module
// Handles calculation history persistence using localStorage

const HISTORY_KEY = 'calc_history_v1';
const MAX_HISTORY_ENTRIES = 50;

// Cache to avoid repeated localStorage reads
let historyCache = null;

/**
 * Check if error is a quota exceeded error
 * Handles cross-browser error codes and names
 */
function isQuotaExceededError(err) {
  return (
    err instanceof DOMException &&
    (err.code === 22 ||
     err.code === 1014 ||
     err.name === 'QuotaExceededError' ||
     err.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  );
}

/**
 * Test if localStorage is supported and working
 * Handles private browsing mode and security exceptions
 */
function isStorageSupported() {
  let storage;
  try {
    storage = window.localStorage;
    if (!storage) return false;

    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (err) {
    // In some cases (private browsing), storage exists but throws on use
    const isValidQuotaExceededError =
      isQuotaExceededError(err) && storage && storage.length > 0;
    return isValidQuotaExceededError;
  }
}

/**
 * Load history from localStorage
 * Returns empty array on error or if storage unavailable
 */
function loadHistory() {
  // Return cached value if available
  if (historyCache !== null) return historyCache;

  // Check storage support
  if (!isStorageSupported()) {
    console.warn('localStorage not available, using in-memory history');
    historyCache = [];
    return historyCache;
  }

  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    historyCache = stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.warn('Failed to load history, using empty array', err);
    historyCache = [];
  }

  return historyCache;
}

/**
 * Save history to localStorage
 * Handles quota exceeded by trimming to half capacity
 * Returns boolean indicating success
 */
function saveHistory(history) {
  // Update cache
  historyCache = history;

  // Check storage support
  if (!isStorageSupported()) {
    console.warn('Storage not supported, history not persisted');
    return false;
  }

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (err) {
    if (isQuotaExceededError(err)) {
      console.warn('Storage quota exceeded, trimming history to half capacity');
      // Trim to half capacity and retry
      const trimmed = history.slice(-Math.floor(MAX_HISTORY_ENTRIES / 2));
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
        historyCache = trimmed;
        return true;
      } catch (retryErr) {
        console.error('Failed to save trimmed history', retryErr);
        return false;
      }
    }
    console.error('Failed to save history', err);
    return false;
  }
}

/**
 * Add new calculation to history
 * Enforces max entries with FIFO (oldest removed first)
 * Automatically renders updated history
 */
function addToHistory(expression, result) {
  const history = loadHistory();

  // Add new entry
  history.push({ expression, result });

  // Enforce max entries (FIFO - remove oldest)
  if (history.length > MAX_HISTORY_ENTRIES) {
    history.shift();
  }

  saveHistory(history);
  renderHistory();
}

/**
 * Clear all history
 * Removes from localStorage and resets cache
 * Automatically renders empty state
 */
function clearHistory() {
  historyCache = [];

  if (isStorageSupported()) {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (err) {
      console.warn('Failed to clear history from storage', err);
    }
  }

  renderHistory();
}

/**
 * Escape HTML to prevent XSS attacks
 * Uses textContent technique for safe HTML escaping
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Render history to DOM
 * Shows "No calculations yet" for empty state
 * Uses escapeHtml for XSS safety
 */
function renderHistory() {
  const history = loadHistory();
  const container = document.getElementById('history-list');

  if (!container) {
    console.warn('History list container not found');
    return;
  }

  if (history.length === 0) {
    container.innerHTML = '<p class="history-empty">No calculations yet</p>';
    return;
  }

  container.innerHTML = history
    .map(entry => `
      <div class="history-entry">
        <div class="history-expression">${escapeHtml(entry.expression)}</div>
        <div class="history-result">${escapeHtml(entry.result)}</div>
      </div>
    `)
    .join('');
}
