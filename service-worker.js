const CACHE_NAME = 'echomind-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles/navigation.css',
  '/manifest.json',
  '/tricks/gizmo/gizmo.js',
  '/tricks/gizmo/coin_flip.html',
  '/tricks/gizmo/randomizer.html',
  '/tricks/mentalism/mind_reader.html',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png',
  '/assets/sounds/coin.mp3',
  '/assets/sounds/success.mp3',
  '/assets/sounds/error.mp3'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-GET requests or if response is not ok
            if (!response || response.status !== 200 || response.type !== 'basic' || event.request.method !== 'GET') {
              return response;
            }

            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return a custom offline page or fallback content
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            return new Response('Offline content not available.');
          });
      })
  );
});

// Handle background sync for offline functionality
self.addEventListener('sync', event => {
  if (event.tag === 'sync-gizmo-data') {
    event.waitUntil(syncGizmoData());
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/assets/images/icon-192.png',
    badge: '/assets/images/badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('EchoMind Update', options)
  );
});

// Background sync function
async function syncGizmoData() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    const gizmoRequests = requests.filter(request => 
      request.url.includes('/gizmo/')
    );

    await Promise.all(
      gizmoRequests.map(async request => {
        try {
          const response = await fetch(request);
          await cache.put(request, response);
        } catch (error) {
          console.error('Sync failed for:', request.url);
        }
      })
    );
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Notification configuration
const notificationConfig = {
    icon: '/assets/images/icon-192.png',
    badge: '/assets/images/badge.png'
};
