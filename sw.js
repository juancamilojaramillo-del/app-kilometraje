const CACHE = "motokm-v2";
const ARCHIVOS = [".", "./index.html", "./manifest.json"];

// Instalación: guardar archivos en caché
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

// Activación: limpiar cachés viejas
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: responder desde caché, si no desde red
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// Mantener el SW activo en segundo plano
self.addEventListener("message", e => {
  if (e.data === "keepalive") {
    e.ports[0].postMessage("alive");
  }
});
