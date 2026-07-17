import './styles/main.css';
import contentUrl from './data/content.json';

import { h } from './utils/dom.js';
import { createRouter } from './utils/router.js';
import { Header } from './components/header.js';
import { Footer } from './components/footer.js';
import { mountBannerBar } from './components/bannerBar.js';

import { HomePage } from './pages/home.js';
import { MenuPage } from './pages/menu.js';
import { AboutPage } from './pages/about.js';
import { ContactPage } from './pages/contact.js';
import { DashboardPage } from './pages/dashboard.js';

async function main() {
  const appRoot = document.getElementById('app');

  const bannerOutlet = h('div', { className: 'banner-outlet' });
  const routeOutlet = h('div', { className: 'route-outlet' });
  appRoot.replaceChildren(bannerOutlet, routeOutlet);

  mountBannerBar(bannerOutlet);

  let content;
  try {
    const response = await fetch(contentUrl);
    content = await response.json();
  } catch (err) {
    routeOutlet.replaceChildren(
      h('div', { className: 'load-error' }, 'Sorry — we could not load this page right now. Please refresh.')
    );
    console.error('Failed to load site content', err);
    return;
  }

  // Each route builds a full page (header + page body + footer) so the
  // header's "active" link stays correct after every navigation. Banners
  // live outside this outlet and are never re-created on navigation.
  function withChrome(path, pageNode) {
    return h('div', { className: 'app-shell' }, [
      Header(content.site.name, path),
      h('main', { id: 'main-content' }, pageNode),
      Footer(content.site),
    ]);
  }

  const routes = [
    { path: '/', render: () => withChrome('/', HomePage(content)) },
    { path: '/menu', render: () => withChrome('/menu', MenuPage(content)) },
    { path: '/about', render: () => withChrome('/about', AboutPage(content)) },
    { path: '/contact', render: () => withChrome('/contact', ContactPage(content)) },
    { path: '/dashboard', render: () => withChrome('/dashboard', DashboardPage(content)) },
  ];

  function notFoundRender() {
    return withChrome(
      window.location.pathname,
      h('div', { className: 'page page--not-found' }, [
        h('h1', {}, 'Page not found'),
        h('p', {}, 'The page you\u2019re looking for doesn\u2019t exist.'),
      ])
    );
  }

  createRouter({ routes, mountNode: routeOutlet, notFoundRender }).render();
}

main();
