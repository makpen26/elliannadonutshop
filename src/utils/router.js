/**
 * Minimal History-API router.
 *
 * Routes are registered as { path, render(content) } where `render`
 * receives the site content object and returns a DOM node for the page.
 * Navigation happens via pushState — no full page reloads — and a URL
 * fragment (e.g. /about#team) is scrolled into view after the new page
 * has been mounted, so deep links to a specific section work.
 */
export function createRouter({ routes, mountNode, notFoundRender }) {
  function matchRoute(pathname) {
    return routes.find((route) => route.path === pathname) || null;
  }

  function render() {
    const { pathname, hash } = window.location;
    const route = matchRoute(pathname) || { render: notFoundRender };
    const node = route.render();
    mountNode.replaceChildren(node);

    if (hash) {
      // Defer to the next frame so the new page's nodes exist in the DOM
      // before we try to scroll to one of them.
      requestAnimationFrame(() => {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    } else {
      window.scrollTo({ top: 0 });
    }
  }

  function navigate(path) {
    const url = new URL(path, window.location.origin);
    const isSamePlace =
      url.pathname === window.location.pathname && url.hash === window.location.hash;

    if (url.pathname !== window.location.pathname) {
      window.history.pushState({}, '', url);
      render();
    } else if (url.hash !== window.location.hash) {
      window.history.pushState({}, '', url);
      render();
    } else if (!isSamePlace) {
      window.history.pushState({}, '', url);
      render();
    }
  }

  // Intercept clicks on any in-app link (data-link) so navigation stays
  // client-side instead of doing a full page load.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-link]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http')) return;
    event.preventDefault();
    navigate(href);
  });

  window.addEventListener('popstate', render);

  return { render, navigate };
}
