const CACHE_NAME = "shelfie-v2";
const CORE_ASSETS = ["/", "/summary", "/me", "/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.map((key) => (key === CACHE_NAME ? null : caches.delete(key))))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request));
    return;
  }

  if (url.pathname.startsWith("/_next/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((resp) => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return resp;
      }))
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((resp) => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return resp;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/offline.html")))
  );
});
