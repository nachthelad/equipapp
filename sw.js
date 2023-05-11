// Nombre de la cache
const cacheName = "equipapp-pwa";
const RUNTIME = "runtime";

// Archivos a cachear
const filesToCache = [
  "./",
  "./index.html",
  "./src/icon.svg",
  "./src/icon-android-192.png",
  "./src/icon-desktop-192.png",
  "./src/icon-desktop-512.png",
  "./src/logo.png",
  "./src/styles.css",
];

// Instalación del Service Worker
// Core assets
let coreAssets = [];

// On install, cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => cache.addAll(filesToCache))
      .then(self.skipWaiting())
      .catch((error) => {
        console.error("Error during caching files:", error);
      })
  );
});

self.addEventListener("activate", (event) => {
  const currentCaches = [cacheName, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Listen for request events
self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then((response) => {
            return caches.open(cacheName).then((cache) => {
              cache.put(event.request, response.clone());
              return response;
            });
          })
          .catch((error) => {
            console.error("Error during fetch:", error);
          });
      })
    );
  }
});

console.log("I am a Service Worker!");
