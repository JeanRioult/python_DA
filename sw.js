// Python DA — Service Worker
// Strategy:
//   - Core shell (HTML, CSS, JS, vendor libs, icons): cache-first, precached on install.
//   - Content (.md lessons, flashcards, meta, index.json): network-first with cache fallback,
//     so learners see updates when online but the app still works offline.
//   - Version bumps invalidate old caches on activate.

const VERSION = "v8-2026-04-26-oeuvres";
const CORE_CACHE = `pyda-core-${VERSION}`;
const RUNTIME_CACHE = `pyda-runtime-${VERSION}`;

const CORE_ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "assets/css/base.css",
  "assets/css/cards.css",
  "assets/css/game.css",
  "assets/css/quest-map.css",
  "assets/css/oeuvres.css",
  "assets/css/dark.css",
  "assets/css/dyslexia.css",
  "assets/css/low-stim.css",
  "assets/data/compagnonnage.json",
  "assets/data/oeuvres.json",
  "assets/js/app.js",
  "assets/js/cards.js",
  "assets/js/game.js",
  "assets/js/quest-map.js",
  "assets/js/oeuvres.js",
  "assets/js/i18n.js",
  "assets/js/progress.js",
  "assets/js/sw-register.js",
  "assets/js/vendor/marked.min.js",
  "assets/js/vendor/katex/katex.min.js",
  "assets/js/vendor/katex/auto-render.min.js",
  "assets/js/vendor/katex/katex.min.css",
  "assets/img/icon.svg",
  "assets/img/icon-192.png",
  "assets/img/icon-512.png",
  "assets/img/apple-touch-icon.png",
  "assets/img/favicon.png",
  "tools/index.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CORE_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("pyda-") && !k.endsWith(VERSION))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Only handle same-origin requests; let external requests pass through.
  if (url.origin !== self.location.origin) return;

  const isContent =
    url.pathname.includes("/content/") ||
    url.pathname.endsWith("/index.json") ||
    url.pathname.endsWith("/search-index.json") ||
    url.pathname.endsWith("/_meta.json") ||
    url.pathname.endsWith("/flashcards.json");

  if (isContent) {
    event.respondWith(networkFirst(req));
  } else {
    event.respondWith(cacheFirst(req));
  }
});

// Accept a message from the page to force an immediate update.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const resp = await fetch(req);
    if (resp && resp.ok && resp.type === "basic") {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(req, resp.clone());
    }
    return resp;
  } catch (e) {
    return new Response("Offline and not cached", {
      status: 503,
      statusText: "Offline",
    });
  }
}

async function networkFirst(req) {
  try {
    const resp = await fetch(req);
    if (resp && resp.ok && resp.type === "basic") {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(req, resp.clone());
    }
    return resp;
  } catch (e) {
    const cached = await caches.match(req);
    if (cached) return cached;
    return new Response("Offline and not cached", {
      status: 503,
      statusText: "Offline",
    });
  }
}
