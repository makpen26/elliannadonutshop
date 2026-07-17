import { h } from '../utils/dom.js';

/**
 * A single menu item. Purely presentational — the caller decides whether
 * it's unavailable and passes that in as `unavailable`; this component
 * never checks any shared state itself.
 */
export function MenuItem({ name, description, price, unavailable = false }) {
  return h(
    'div',
    {
      className: 'menu-item' + (unavailable ? ' menu-item--unavailable' : ''),
      'aria-disabled': unavailable,
    },
    [
      h('div', { className: 'menu-item__thumb', 'aria-hidden': 'true' }),
      h('div', { className: 'menu-item__info' }, [
        h('div', { className: 'menu-item__heading' }, [
          h('h4', { className: 'menu-item__name' }, name),
          unavailable ? h('span', { className: 'badge badge--unavailable' }, 'Sold out') : null,
        ]),
        h('p', { className: 'menu-item__description' }, description),
      ]),
      h('div', { className: 'menu-item__price' }, `$${price.toFixed(2)}`),
    ]
  );
}
