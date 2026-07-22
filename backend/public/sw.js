const CACHE_NAME = 'church-erp-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through fetch for basic PWA validation
  event.respondWith(fetch(event.request).catch(() => {
    // Offline fallback if needed
  }));
});
