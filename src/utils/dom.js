/**
 * h(tag, props, children) — the one function every UI piece in this app
 * uses to build DOM. It never touches global state; it just turns a
 * description into a real node and hands it back.
 *
 * @param {string} tag - element tag name, e.g. 'div', 'button'
 * @param {Object} [props] - attributes, event handlers (onClick, onInput, ...),
 *                            `className`, `dataset`, and `style` (object) are
 *                            handled specially. Everything else is set via
 *                            setAttribute.
 * @param {Array|Node|string} [children] - a node, string, or array of
 *                            nodes/strings (falsy entries are skipped, so
 *                            conditional children can be written inline).
 * @returns {HTMLElement}
 */
export function h(tag, props = {}, children = []) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(props || {})) {
    if (value == null || value === false) continue;

    if (key === 'className') {
      el.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else if (key === 'dataset' && typeof value === 'object') {
      Object.assign(el.dataset, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'html') {
      // Explicit escape hatch, used only for the rare case of injecting
      // pre-sanitized markup. Not used for anything derived from user input.
      el.innerHTML = value;
    } else if (typeof value === 'boolean') {
      if (value) el.setAttribute(key, '');
    } else {
      el.setAttribute(key, value);
    }
  }

  append(el, children);
  return el;
}

function append(el, children) {
  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    if (child == null || child === false) continue;
    if (Array.isArray(child)) {
      append(el, child);
    } else if (child instanceof Node) {
      el.appendChild(child);
    } else {
      el.appendChild(document.createTextNode(String(child)));
    }
  }
}

/** Convenience: replace all of a container's children with a new node. */
export function mount(container, node) {
  container.replaceChildren(node);
}

/** Convenience for plain text nodes in a children array. */
export function text(value) {
  return document.createTextNode(String(value));
}
