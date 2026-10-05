/* Service worker Life Calculator — aplikasi tetap bisa dibuka tanpa internet.
 * Strategi: jaringan dulu (selalu versi terbaru saat online), cadangan dari cache saat offline.
 * Ganti VERSION setiap rilis; daftar CORE dicek oleh test/pwa.test.js agar sama dengan index.html. */
const VERSION = 'lc-1.0.0';
const CORE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'js/data/tarif.js',
  'js/data/upah-minimum.js',
  'js/engine/karier.js',
  'js/engine/fire.js',
  'js/engine/pesangon.js',
  'js/engine/tabungan.js',
  'js/engine/pendidikan.js',
  'js/engine/darurat.js',
  'js/engine/cicilan.js',
  'js/engine/inflasi.js',
  'js/engine/zakat.js',
  'js/engine/minggu.js',
  'js/app.js',
  'js/calc/karier.js',
  'js/calc/pesangon.js',
  'js/calc/fire.js',
  'js/calc/tabungan.js',
  'js/calc/pendidikan.js',
  'js/calc/darurat.js',
  'js/calc/cicilan.js',
  'js/calc/inflasi.js',
  'js/calc/zakat.js',
  'js/calc/minggu.js',
  'js/pages.js',
  'assets/icons/favicon.svg',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  const font = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!same && !font) return;
  e.respondWith(fetch(req).then((res) => {
    if (res && (res.ok || res.type === 'opaque')) {
      const copy = res.clone();
      caches.open(VERSION).then((c) => c.put(req, copy));
    }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined))));
});
