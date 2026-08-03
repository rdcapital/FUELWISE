/**
 * formatters.js
 * Pure helper functions for formatting numbers, currency, and dates that are
 * used consistently across the entire application.
 */

/**
 * Format a number as currency (₵ Ghana Cedi by default).
 * Change the `currency` / `locale` params to localise for other regions.
 */
export function formatCurrency(value, currency = 'GHS', locale = 'en-GH') {
  if (value === null || value === undefined || isNaN(value)) return '₵0.00';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(value));
}

/**
 * Format a number with a fixed number of decimal places plus an optional unit.
 * e.g. formatNumber(23.456, 2, ' km/L') → "23.46 km/L"
 */
export function formatNumber(value, decimals = 2, unit = '') {
  if (value === null || value === undefined || isNaN(value)) return `0${unit}`;
  return `${Number(value).toFixed(decimals)}${unit}`;
}

/**
 * Format a Date or ISO string to a human-readable short date.
 * e.g. "Jul 28, 2026"
 */
export function formatDate(dateInput) {
  if (!dateInput) return '—';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date)) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Return "YYYY-MM" from a Date or ISO string.
 * Used as a grouping key for monthly chart aggregations.
 */
export function toMonthKey(dateInput) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date)) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

/**
 * Format a "YYYY-MM" key into a readable month label.
 * e.g. "2026-07" → "Jul 2026"
 */
export function formatMonthLabel(monthKey) {
  if (!monthKey) return '';
  const [year, month] = monthKey.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/** Pad a number to always have at least two digits. */
export function pad2(n) {
  return String(n).padStart(2, '0');
}
