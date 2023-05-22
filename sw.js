// 1- o nome do cache

const cacheName = 'v9';

// 2- os resources que serão salvos no cache;

const resourcesToPrecache = [
    "/",
    "/index.html",
    "/assets/favicon.png",
    "/assets/github-icon.png",
    "/assets/linkedin-icon.png",
    "/assets/android/android-launchericon-48-48.png",
    "/assets/android/android-launchericon-72-72.png",
    "/assets/android/android-launchericon-96-96.png",
    "/assets/android/android-launchericon-144-144.png",
    "/assets/android/android-launchericon-192-192.png",
    "/assets/android/android-launchericon-512-512.png",
    "/assets/ios/16.png",
    "/assets/ios/20.png",
    "/assets/ios/29.png",
    "/assets/ios/32.png",
    "/assets/ios/40.png",
    "/assets/ios/50.png",
    "/assets/ios/57.png",
    "/assets/ios/58.png",
    "/assets/ios/60.png",
    "/assets/ios/64.png",
    "/assets/ios/72.png",
    "/assets/ios/76.png",
    "/assets/ios/80.png",
    "/assets/ios/87.png",
    "/assets/ios/100.png",
    "/assets/ios/114.png",
    "/assets/ios/120.png",
    "/assets/ios/128.png",
    "/assets/ios/152.png",
    "/assets/ios/167.png",
    "/assets/ios/180.png",
    "/assets/ios/192.png",
    "/assets/ios/256.png",
    "/assets/ios/512.png",
    "/assets/ios/1024.png",
    "/css/index.css",
    "/js/index.js",
    "/manifest.json",
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
