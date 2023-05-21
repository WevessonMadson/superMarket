// 1- o nome do cache

const cacheName = 'v4';

// 2- os resources que serão salvos no cache;

const resourcesToPrecache = [
    "/",
    "index.html",
    "/assets/favicon.png",
    "/assets/github-icon.png",
    "/assets/linkedin-icon.png",
    "/assets/android/*",
    "/assets/windows11/*",
    "/assets/ios/*",
    "/css/index.css",
    "/js/index.js",
    "manifest.json",
];

self.addEventListener("install", (event) => {
    event.waitUtil(
        caches.open(cacheName)
            .then(cache => cache.addAll(resourcesToPrecache)),
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(cacheResponse => (cacheResponse || fetch(event.request))),
    );
});