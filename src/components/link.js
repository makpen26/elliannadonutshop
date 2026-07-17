import { h } from '../utils/dom.js';

/**
 * An in-app navigation link. The `data-link` attribute is what the
 * router listens for to intercept the click instead of letting the
 * browser do a full page load. `href` can include a path and/or a
 * fragment, e.g. "/about#team".
 */
export function Link({ href, label, className }) {
  return h('a', { href, className, 'data-link': true }, label);
}
