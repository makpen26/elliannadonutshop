import { h } from '../utils/dom.js';

/** A simple titled card with a body — used for best-sellers, etc. */
export function Card({ title, body, footer }) {
  return h('div', { className: 'card' }, [
    title ? h('h3', { className: 'card__title' }, title) : null,
    h('p', { className: 'card__body' }, body),
    footer ? h('div', { className: 'card__footer' }, footer) : null,
  ]);
}

/** A pull-quote style card used for social-proof / testimonials. */
export function QuoteCard({ quote, author }) {
  return h('figure', { className: 'quote-card' }, [
    h('blockquote', { className: 'quote-card__quote' }, `“${quote}”`),
    h('figcaption', { className: 'quote-card__author' }, `— ${author}`),
  ]);
}
