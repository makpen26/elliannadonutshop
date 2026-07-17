# Wildflour Bakery — Zero-Framework SPA

A five-page bakery website built with vanilla JavaScript DOM construction
(no React/Vue/Angular, no templating engine), bundled with Webpack.

## Run it

```
npm install
npm run build     # production build -> dist/
npm run dev       # dev server with client-side routing fallback, http://localhost:8080
```

## How it's put together

- **`src/utils/dom.js`** — `h(tag, props, children)`, the one function every
  UI piece uses to build real DOM nodes. No virtual DOM, no diffing.
- **`src/utils/router.js`** — client-side routing via `history.pushState`.
  Intercepts clicks on `[data-link]` elements, and after mounting a page it
  scrolls a URL fragment (e.g. `/about#team`) into view, so deep links work.
- **`src/data/content.json`** — the single source of truth for all copy,
  prices, hours, and team info. Fetched once at startup in `src/index.js`
  and passed down as a plain object; nothing else fetches or imports it.
- **`src/components/`** — small, single-responsibility UI units. Each one
  takes plain data/callbacks as arguments and returns a DOM node. They
  don't import each other or reach into global state — that wiring happens
  one level up, in `src/pages/*.js` (per-page data) or `src/index.js`
  (site-wide chrome: header, footer, banners).
- **`src/state/siteState.js`** + **`src/utils/store.js`** — a tiny pub/sub
  store persisted to `localStorage`. Marking a menu item unavailable, or
  editing/toggling an announcement banner from the dashboard, updates this
  store; every subscribed part of the UI (Menu page, Home best-sellers,
  banner bar) re-renders itself automatically, on any open tab, with no
  manual refresh.
- **`src/components/passwordGate.js`** — the dashboard's access gate. It
  checks a password client-side and remembers "unlocked" for the browser
  session only (`sessionStorage`). This is explicitly **not security** —
  see the comment at the top of that file — it's a UX/privacy convenience
  to keep casual visitors off operator-only content. Anyone with devtools
  can bypass it, so nothing sensitive should ever depend on it.
- **`src/styles/tokens.css`** — a `:root` block of CSS custom properties
  (color, type, spacing, radius, shadow) that every other stylesheet reads
  from, instead of hardcoded values.
- **`public/index.html`** — the HTML shell: just a `#app` mount point, plus
  a hidden static `<form>` so a build-time form-detection service (e.g.
  Netlify Forms) can discover the contact form's fields from static markup;
  the real form users interact with is built dynamically in JS.

## Pages

- **Home** (`/`) — hero + CTA, best-sellers (live-reactive to availability),
  storefront visual, testimonials.
- **Menu** (`/menu`) — items grouped by category; unavailable items are
  dimmed, non-interactive, and badged, live-updating from the dashboard.
- **About** (`/about`) — brand story (`#story`) and team grid (`#team`),
  each independently deep-linkable.
- **Contact** (`/contact`) — business info (`#hours`) and an async contact
  form (`#form`) with inline success/error feedback, no page navigation.
- **Dashboard** (`/dashboard`, gated) — toggle item availability, edit/toggle
  announcement banners, plus static business-advice filler content.
  Staff password: `wildflour-team` (see the "not security" note above).

Footer links route to specific sections on other pages (e.g. "Meet the
Team" → `/about#team`), not just page roots.
