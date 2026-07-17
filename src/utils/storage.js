/**
 * Thin wrapper around localStorage so the rest of the app never touches
 * window.localStorage (or its quirks/exceptions) directly.
 */
const PREFIX = 'wildflour:';

export function readLocal(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch (err) {
    console.warn(`[storage] failed to read "${key}"`, err);
    return fallback;
  }
}

export function writeLocal(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[storage] failed to write "${key}"`, err);
  }
}

/**
 * sessionStorage variant — used for the dashboard access gate, since that
 * state should reset when the browser tab/session ends.
 */
export function readSession(key, fallback) {
  try {
    const raw = window.sessionStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch (err) {
    console.warn(`[storage] failed to read session "${key}"`, err);
    return fallback;
  }
}

export function writeSession(key, value) {
  try {
    window.sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[storage] failed to write session "${key}"`, err);
  }
}

export function clearSession(key) {
  try {
    window.sessionStorage.removeItem(PREFIX + key);
  } catch (err) {
    console.warn(`[storage] failed to clear session "${key}"`, err);
  }
}
