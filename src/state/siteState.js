import { createStore } from '../utils/store.js';
import { readLocal, writeLocal } from '../utils/storage.js';

/**
 * Site-wide, non-sensitive state that needs to (a) persist across reloads
 * and (b) propagate live to every part of the UI that cares about it —
 * e.g. marking a menu item unavailable on the dashboard should immediately
 * dim it on the Menu page and drop it from the Home page best-sellers,
 * without a manual refresh.
 */
const DEFAULT_BANNERS = [
  { id: 'sellout', text: 'Sourdough loaves are sold out for today — see you tomorrow!', active: false },
  { id: 'promo', text: 'Buy a dozen cardamom buns, get one free — this week only.', active: false },
  { id: 'general', text: 'Welcome to our refreshed online menu!', active: true },
];

const store = createStore(
  {
    unavailableItemIds: [],
    banners: DEFAULT_BANNERS,
  },
  'site-state'
);

export const siteState = store;

// --- Menu item availability -------------------------------------------------

export function isItemUnavailable(itemId) {
  return store.getState().unavailableItemIds.includes(itemId);
}

export function setItemAvailability(itemId, unavailable) {
  const current = store.getState().unavailableItemIds;
  const next = unavailable
    ? [...new Set([...current, itemId])]
    : current.filter((id) => id !== itemId);
  store.setState({ unavailableItemIds: next });
}

// --- Announcement banners ---------------------------------------------------

export function getBanners() {
  return store.getState().banners;
}

export function setBannerText(bannerId, text) {
  const next = store.getState().banners.map((b) =>
    b.id === bannerId ? { ...b, text } : b
  );
  store.setState({ banners: next });
}

export function setBannerActive(bannerId, active) {
  const next = store.getState().banners.map((b) =>
    b.id === bannerId ? { ...b, active } : b
  );
  store.setState({ banners: next });
  if (active) {
    // Re-activating a banner un-dismisses it so it's visible again.
    setBannerDismissed(bannerId, false);
  }
}

// Dismissal is per-browser but intentionally kept separate from the
// `banners` slice above, since "an operator turned this banner off" and
// "a visitor dismissed it" are different facts with different lifetimes.
const DISMISSED_KEY = 'dismissed-banners';

export function isBannerDismissed(bannerId) {
  return readLocal(DISMISSED_KEY, []).includes(bannerId);
}

export function setBannerDismissed(bannerId, dismissed) {
  const current = readLocal(DISMISSED_KEY, []);
  const next = dismissed
    ? [...new Set([...current, bannerId])]
    : current.filter((id) => id !== bannerId);
  writeLocal(DISMISSED_KEY, next);
  // Dismissal doesn't live in the pub/sub store's persisted slice, so we
  // notify listeners manually by re-emitting the current state.
  store.setState({});
}
