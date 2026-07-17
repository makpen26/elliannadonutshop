import { h } from '../utils/dom.js';
import { Link } from '../components/link.js';
import { Card, QuoteCard } from '../components/card.js';
import { siteState, isItemUnavailable } from '../state/siteState.js';

function findItemById(menuCategories, id) {
  for (const category of menuCategories) {
    const found = category.items.find((item) => item.id === id);
    if (found) return found;
  }
  return null;
}

export function HomePage(content) {
  const { home, menu } = content;

  const heroSection = h('section', { className: 'hero' }, [
    h('div', { className: 'hero__content' }, [
      h('h1', { className: 'hero__heading' }, home.hero.heading),
      h('p', { className: 'hero__subheading' }, home.hero.subheading),
      Link({ href: home.hero.ctaHref, label: home.hero.ctaLabel, className: 'btn btn--primary' }),
    ]),
  ]);

  // Best-sellers need to react live to a dashboard operator marking one
  // of them unavailable, so this section owns its own small subscription
  // and re-render — the individual Card components stay pure.
  const bestSellersOutlet = h('div', { className: 'best-sellers__grid' });

  function renderBestSellers() {
    const cards = home.bestSellers
      .map((id) => findItemById(menu.categories, id))
      .filter(Boolean)
      .filter((item) => !isItemUnavailable(item.id))
      .map((item) =>
        Card({
          title: item.name,
          body: item.description,
          footer: `$${item.price.toFixed(2)}`,
        })
      );

    bestSellersOutlet.replaceChildren(
      ...(cards.length ? cards : [h('p', { className: 'muted' }, 'Check back soon — today\u2019s favorites are being restocked.')])
    );
  }

  renderBestSellers();
  siteState.subscribe(renderBestSellers);

  const bestSellersSection = h('section', { className: 'best-sellers' }, [
    h('h2', {}, 'Best Sellers'),
    bestSellersOutlet,
  ]);

  const storefrontSection = h('section', { className: 'storefront' }, [
    h('div', { className: 'storefront__image', 'aria-hidden': 'true' }),
    h('p', { className: 'storefront__caption' }, home.storefront.caption),
  ]);

  const testimonialsSection = h('section', { className: 'testimonials' }, [
    h('h2', {}, 'What People Are Saying'),
    h(
      'div',
      { className: 'testimonials__grid' },
      home.testimonials.map((t) => QuoteCard({ quote: t.quote, author: t.author }))
    ),
  ]);

  return h('div', { className: 'page page--home' }, [
    heroSection,
    bestSellersSection,
    storefrontSection,
    testimonialsSection,
  ]);
}
