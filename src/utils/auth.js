let identity = null;
let loadPromise = null;

function loadIdentity() {
  return new Promise((resolve) => {
    if (window.netlifyIdentity) {
      identity = window.netlifyIdentity;
      resolve(identity);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
    script.async = true;
    script.onload = () => {
      identity = window.netlifyIdentity;
      identity.init();
      resolve(identity);
    };
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
}

export function getIdentity() {
  if (!loadPromise) {
    loadPromise = loadIdentity();
  }
  return loadPromise;
}

export function isLoggedIn() {
  return !!(identity && identity.currentUser());
}

export function getUser() {
  return identity ? identity.currentUser() : null;
}

export function openLogin() {
  if (identity) identity.open();
}

export function logout() {
  if (identity) identity.logout();
}

export function onLogin(callback) {
  getIdentity().then((id) => {
    if (id) id.on('login', callback);
  });
}

export function onLogout(callback) {
  getIdentity().then((id) => {
    if (id) id.on('logout', callback);
  });
}
