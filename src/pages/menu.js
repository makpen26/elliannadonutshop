import { h } from '../utils/dom.js';
import { MenuItem } from '../components/menuItem.js';
import { siteState, isItemUnavailable } from '../state/siteState.js';

export function MenuPage(content) {
  const { categories } = content.menu;
  const outlet = h('div', { className: 'menu-categories' });

  function renderCategories() {
    outlet.replaceChildren(
      ...categories.map((category) =>
        h('section', { className: 'menu-category', id: category.id }, [
          h('h2', { className: 'menu-category__heading' }, category.name),
          h(
            'div',
            { className: 'menu-category__items' },
            category.items.map((item) =>
              MenuItem({
                name: item.name,
                description: item.description,
                price: item.price,
                unavailable: isItemUnavailable(item.id),
              })
            )
          ),
        ])
      )
    );
  }

  renderCategories();
  // Live-updates when the dashboard toggles an item's availability while
  // this page is open.
  siteState.subscribe(renderCategories);

  return h('div', { className: 'page page--menu' }, [
    h('header', { className: 'page-header' }, [
      h('h1', {}, 'Menu'),
      h('p', {}, 'Baked fresh daily. Availability changes throughout the day.'),
    ]),
    outlet,
  ]);
}
