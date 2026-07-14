const SHELL_CACHE = "78dlc-shell-v4";
const OFFLINE_CACHE = "78dlc-offline-v1";

const SHELL_URLS = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/manifest.webmanifest",
  "/assets/icon.svg",
  "/assets/red-dragon-loader.gif",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("78dlc-shell-") && key !== SHELL_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
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

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, "/index.html"));
    return;
  }

  if (url.pathname === "/api/state") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (url.pathname.startsWith("/api/media/") || url.pathname.startsWith("/api/ktv/")) {
    event.respondWith(mediaResponse(request));
    return;
  }

  if (url.pathname.startsWith("/covers/") || SHELL_URLS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirst(request, fallbackUrl = "") {
  const cache = await caches.open(OFFLINE_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (_error) {
    return (
      (await cache.match(request)) ||
      (fallbackUrl ? await caches.match(fallbackUrl) : null) ||
      new Response(JSON.stringify({ error: "Offline cache is not ready." }), {
        status: 503,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      })
    );
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(OFFLINE_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

async function mediaResponse(request) {
  const cache = await caches.open(OFFLINE_CACHE);
  const cached = await cache.match(request.url, { ignoreSearch: false });

  if (request.headers.has("range") && cached) {
    return partialResponse(request, cached);
  }

  try {
    const response = await fetch(request);
    if (response.ok && !request.headers.has("range")) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (_error) {
    if (cached) {
      return request.headers.has("range") ? partialResponse(request, cached) : cached;
    }
    return new Response("Offline media is not cached.", { status: 503 });
  }
}

async function partialResponse(request, cachedResponse) {
  const range = request.headers.get("range") || "";
  const match = range.match(/^bytes=(\d*)-(\d*)$/);
  if (!match) {
    return cachedResponse;
  }

  const blob = await cachedResponse.blob();
  const size = blob.size;
  let start = match[1] ? Number(match[1]) : 0;
  let end = match[2] ? Number(match[2]) : size - 1;

  if (!match[1] && match[2]) {
    const suffixLength = Number(match[2]);
    start = Math.max(0, size - suffixLength);
    end = size - 1;
  }

  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end >= size || start > end) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${size}` },
    });
  }

  const headers = new Headers(cachedResponse.headers);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Length", String(end - start + 1));
  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);

  return new Response(blob.slice(start, end + 1), {
    status: 206,
    statusText: "Partial Content",
    headers,
  });
}
