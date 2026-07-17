import { h } from '../utils/dom.js';

/**
 * A plain button. `variant` toggles a CSS class ('primary' | 'secondary' | 'ghost').
 */
export function Button({ label, onClick, variant = 'primary', type = 'button', disabled = false }) {
  return h(
    'button',
    {
      type,
      className: `btn btn--${variant}`,
      onClick,
      disabled,
    },
    label
  );
}
