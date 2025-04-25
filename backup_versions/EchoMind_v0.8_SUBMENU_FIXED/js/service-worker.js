
const CACHE_NAME = "echomind-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/tricks/mind_reader_local_auto_restart.html"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
