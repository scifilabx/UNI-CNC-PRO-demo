/* SLAD — service worker: aplikacja działa offline po pierwszym otwarciu. */
const CACHE = 'slad-v5';
const PLIKI = [
  './index.html',
  './slad_core.js',
  './i18n.js',
  './i18n_pack2.js',
  './drzewo.js',
  './vendor/noble-ed25519.js',
  './manifest.webmanifest',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PLIKI)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit =>
      hit ||
      fetch(e.request)
        .then(res => {
          const kop = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, kop)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('./index.html'))
    )
  );
});
