import { h } from '../utils/dom.js';
import { Button } from '../components/button.js';
import {
  siteState,
  isItemUnavailable,
  setItemAvailability,
  getBanners,
  setBannerText,
  setBannerActive,
} from '../state/siteState.js';
import {
  getIdentity,
  isLoggedIn,
  getUser,
  openLogin,
  logout,
  onLogin,
  onLogout,
} from '../utils/auth.js';

function buildAvailabilitySection(menu) {
  const outlet = h('div', { className: 'dashboard-availability__list' });

  function render() {
    outlet.replaceChildren(
      ...menu.categories.flatMap((category) =>
        category.items.map((item) => {
          const checkbox = h('input', {
            type: 'checkbox',
            id: `avail-${item.id}`,
            checked: isItemUnavailable(item.id),
            onChange: (event) => setItemAvailability(item.id, event.target.checked),
          });
          return h('label', { className: 'dashboard-availability__row', for: `avail-${item.id}` }, [
            checkbox,
            h('span', {}, `${item.name} (${category.name})`),
          ]);
        })
      )
    );
  }

  render();
  siteState.subscribe(render);

  return h('section', { className: 'dashboard-section' }, [
    h('h2', {}, 'Item Availability'),
    h('p', { className: 'muted' }, 'Check an item to mark it unavailable across the site.'),
    outlet,
  ]);
}

function buildBannerSection() {
  const outlet = h('div', { className: 'dashboard-banners__list' });

  function render() {
    outlet.replaceChildren(
      ...getBanners().map((banner) => {
        const activeToggle = h('input', {
          type: 'checkbox',
          id: `banner-active-${banner.id}`,
          checked: banner.active,
          onChange: (event) => setBannerActive(banner.id, event.target.checked),
        });

        const textInput = h('input', {
          type: 'text',
          value: banner.text,
          className: 'dashboard-banners__text-input',
          onChange: (event) => setBannerText(banner.id, event.target.value),
        });

        return h('div', { className: 'dashboard-banners__row' }, [
          h('label', { for: `banner-active-${banner.id}`, className: 'dashboard-banners__toggle' }, [
            activeToggle,
            h('span', {}, banner.id),
          ]),
          textInput,
        ]);
      })
    );
  }

  render();
  siteState.subscribe(render);

  return h('section', { className: 'dashboard-section' }, [
    h('h2', {}, 'Announcement Banners'),
    h('p', { className: 'muted' }, 'Toggle a banner on/off and edit its text. Changes appear site-wide immediately.'),
    outlet,
  ]);
}

function buildAdviceSection(tips) {
  return h('section', { className: 'dashboard-section' }, [
    h('h2', {}, 'Quick Reminders'),
    h(
      'ul',
      { className: 'dashboard-advice__list' },
      tips.map((tip) => h('li', {}, tip))
    ),
  ]);
}

function buildDashboardContent(content) {
  return h('div', { className: 'dashboard-content' }, [
    h('p', { className: 'dashboard-info' }, [
      'Signed in as ',
      h('strong', {}, getUser()?.user_metadata?.full_name || getUser()?.email || 'Staff'),
      ' \u2014 ',
      h(
        'a',
        { href: '/admin/', className: 'dashboard-admin-link' },
        'Open Content Manager \u2192'
      ),
    ]),
    buildAvailabilitySection(content.menu),
    buildBannerSection(),
    buildAdviceSection(content.dashboard.businessAdviceFiller),
  ]);
}

function buildAuthGate(content) {
  const container = h('div', { className: 'auth-gate' });

  function showContent() {
    const logoutBtn = Button({
      label: 'Sign Out',
      variant: 'ghost',
      onClick: () => {
        logout();
      },
    });

    container.replaceChildren(
      h('div', { className: 'auth-gate__toolbar' }, [logoutBtn]),
      buildDashboardContent(content)
    );
  }

  function showPrompt() {
    container.replaceChildren(
      h('div', { className: 'auth-gate__prompt' }, [
        h('h2', {}, 'Staff Dashboard'),
        h('p', {}, 'Sign in to manage menu availability and announcement banners.'),
        Button({
          label: 'Sign in with Netlify Identity',
          onClick: () => openLogin(),
        }),
        h('p', { className: 'muted' }, 'Only authorized staff members can access this page.'),
        h('p', { className: 'auth-gate__setup' }, [
          'First time? ',
          h('a', { href: '/admin/', target: '_blank' }, 'Open the Content Manager'),
          ' to configure staff accounts.',
        ]),
      ])
    );
  }

  getIdentity().then((id) => {
    if (id && isLoggedIn()) {
      showContent();
      onLogout(() => {
        container.replaceChildren(
          h('div', { className: 'auth-gate__prompt' }, [
            h('h2', {}, 'Signed Out'),
            h('p', {}, 'You have been signed out.'),
            Button({ label: 'Sign In Again', onClick: () => openLogin() }),
          ])
        );
      });
    } else {
      if (id) {
        showPrompt();
        onLogin(showContent);
      } else {
        container.replaceChildren(
          h('div', { className: 'auth-gate__prompt' }, [
            h('h2', {}, 'Staff Dashboard'),
            h('p', {}, 'Netlify Identity is not configured for this environment.'),
            h('p', { className: 'muted' }, [
              'To enable dashboard access, deploy to Netlify and enable Netlify Identity. ',
              'See the README for setup instructions.',
            ]),
          ])
        );
      }
    }
  });

  return container;
}

export function DashboardPage(content) {
  return h('div', { className: 'page page--dashboard' }, [
    h('header', { className: 'page-header' }, [h('h1', {}, 'Staff Dashboard')]),
    buildAuthGate(content),
  ]);
}
