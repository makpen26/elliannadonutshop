import { h } from '../utils/dom.js';
import { Link } from './link.js';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/dashboard', label: 'Dashboard' },
];

/**
 * @param {string} siteName
 * @param {string} currentPath - used to mark the active nav link
 */
export function Header(siteName, currentPath) {
  return h('header', { className: 'site-header' }, [
    h('div', { className: 'site-header__inner' }, [
      Link({ href: '/', label: siteName, className: 'site-header__brand' }),
      h(
        'nav',
        { className: 'site-header__nav', 'aria-label': 'Primary' },
        NAV_ITEMS.map((item) =>
          Link({
            href: item.href,
            label: item.label,
            className:
              'site-header__link' + (item.href === currentPath ? ' is-active' : ''),
          })
        )
      ),
    ]),
  ]);
}
