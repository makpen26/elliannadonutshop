import { h } from '../utils/dom.js';
import { Link } from './link.js';

/**
 * Footer navigation. Some of these links point at a fragment on another
 * page (e.g. "/about#team") so the router can deep-link straight to that
 * section after the page renders, rather than just landing at the top.
 */
export function Footer(site) {
  const year = new Date().getFullYear();

  return h('footer', { className: 'site-footer' }, [
    h('div', { className: 'site-footer__inner' }, [
      h('div', { className: 'site-footer__col' }, [
        h('p', { className: 'site-footer__brand' }, site.name),
        h('p', {}, site.address),
        h('p', {}, site.phone),
      ]),
      h('div', { className: 'site-footer__col' }, [
        h('p', { className: 'site-footer__heading' }, 'Explore'),
        Link({ href: '/menu', label: 'Full Menu' }),
        Link({ href: '/about#story', label: 'Our Story' }),
        Link({ href: '/about#team', label: 'Meet the Team' }),
      ]),
      h('div', { className: 'site-footer__col' }, [
        h('p', { className: 'site-footer__heading' }, 'Visit'),
        Link({ href: '/contact#hours', label: 'Hours' }),
        Link({ href: '/contact#form', label: 'Send a Message' }),
        h(
          'div',
          { className: 'site-footer__social' },
          site.social.map((s) => h('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.label))
        ),
      ]),
    ]),
    h('div', { className: 'site-footer__bottom' }, `© ${year} ${site.name}. All rights reserved.`),
  ]);
}
