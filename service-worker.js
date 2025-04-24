
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("echomind-cache").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/assets/style.css"
      ]);
    })
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
