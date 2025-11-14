// public/service-worker.js
self.addEventListener('install', () => {
  console.log('Service worker installed.');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open('museum-cache').then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
