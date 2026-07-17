import { h } from '../utils/dom.js';

/**
 * A single dismissible announcement banner. Purely presentational: it
 * receives the banner's text and an onDismiss callback, and has no idea
 * where that data came from or where the dismissal goes.
 */
export function Banner({ id, text, onDismiss }) {
  return h('div', { className: 'banner', role: 'status', dataset: { bannerId: id } }, [
    h('p', { className: 'banner__text' }, text),
    h(
      'button',
      {
        className: 'banner__dismiss',
        'aria-label': 'Dismiss announcement',
        onClick: onDismiss,
      },
      '✕'
    ),
  ]);
}
