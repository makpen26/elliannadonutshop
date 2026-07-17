import { h } from '../utils/dom.js';
import { Banner } from './banner.js';
import {
  siteState,
  getBanners,
  isBannerDismissed,
  setBannerDismissed,
} from '../state/siteState.js';

/**
 * Mounts the banner bar into `container` and keeps it in sync with the
 * shared store: any dashboard edit (text change, activate/deactivate) or
 * a visitor dismissing a banner re-renders this bar immediately, with no
 * page refresh. This lives at the app-shell level (above individual
 * pages) since banners sit in normal document flow above every page,
 * not owned by any one of them.
 */
export function mountBannerBar(container) {
  function renderBanners() {
    const visible = getBanners().filter((b) => b.active && !isBannerDismissed(b.id));

    container.replaceChildren(
      h(
        'div',
        { className: 'banner-bar' },
        visible.map((banner) =>
          Banner({
            id: banner.id,
            text: banner.text,
            onDismiss: () => setBannerDismissed(banner.id, true),
          })
        )
      )
    );
  }

  renderBanners();
  siteState.subscribe(renderBanners);
}
