/**
 * storage.js
 * Thin wrappers around localStorage so that all reads/writes go through one
 * place.  This makes it trivial to swap in IndexedDB or an API later.
 */

/**
 * Read a JSON value from localStorage.
 * Returns `defaultValue` when the key is missing or the stored value is
 * corrupt / un-parseable.
 */
export function getItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

/**
 * Serialise `value` to JSON and write it to localStorage.
 * Silently swallows errors (e.g. private-mode quota exceeded).
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage quota exceeded or browser security policy
  }
}

/** Remove a single key from localStorage. */
export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
