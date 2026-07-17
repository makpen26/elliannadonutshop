import { readLocal, writeLocal } from './storage.js';

/**
 * createStore — a tiny pub/sub wrapper around a plain object.
 *
 * Any UI piece can call `subscribe` to be notified when state changes,
 * and `setState` to change it (partial updates are merged shallowly).
 * If `persistKey` is given, state is written to localStorage on every
 * change and rehydrated from it on creation, so it survives reloads.
 *
 * This is intentionally minimal — no middleware, no reducers — just
 * enough to let independent UI pieces stay in sync without a manual
 * page refresh.
 */
export function createStore(initialState, persistKey) {
  let state = persistKey
    ? { ...initialState, ...readLocal(persistKey, {}) }
    : { ...initialState };

  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(partial) {
    const update = typeof partial === 'function' ? partial(state) : partial;
    state = { ...state, ...update };
    if (persistKey) writeLocal(persistKey, state);
    listeners.forEach((listener) => listener(state));
  }

  /** @returns {Function} unsubscribe */
  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, setState, subscribe };
}
