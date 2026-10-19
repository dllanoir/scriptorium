const CACHE_NAME = 'scriptorium-v5';
const SUPABASE_CACHE = 'scriptorium-supabase-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './src/app.js',
  './src/core/tailwind-config.js',
  './src/core/dom.js',
  './src/core/state.js',
  './src/core/controllers.js',
  './src/core/settings.js',
  './src/api/index.js',
  './src/api/supabase.js',
  './src/components/index.js',
  './src/components/collection-item.js',
  './src/components/text-item.js',
  './src/components/reading-pane.js',
  './src/components/layout/ContentShell.js',
  './src/components/layout/LandingPage.js',
  './src/components/layout/Modals.js',
  './src/components/layout/Navbar.js',
  './src/components/layout/Sidebar.js',
  './src/components/layout/modals/CollectionModal.js',
  './src/components/layout/modals/DeleteCollectionModal.js',
  './src/components/layout/modals/DeleteTextModal.js',
  './src/components/layout/modals/HelpModal.js',
  './src/components/layout/modals/SettingsModal.js',
  './src/components/layout/modals/TextModal.js',
  './src/utils/index.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== SUPABASE_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Supabase REST API (Network First, fallback to Cache - only caches if response.ok)
  if (url.origin.includes('supabase.co') && url.pathname.startsWith('/rest/v1/') && event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const resClone = response.clone();
            caches.open(SUPABASE_CACHE).then((cache) => {
              cache.put(event.request, resClone);
            });
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 2. CDNs (Cache First, fallback to Network)
  if (url.hostname === 'cdn.tailwindcss.com' || url.hostname === 'cdn.jsdelivr.net' || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, resClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // 3. Local App Shell (Network First with Cache fallback for guaranteed freshness)
  if (url.origin === location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, resClone);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
});
