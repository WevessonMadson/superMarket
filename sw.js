// 1- o nome do cache

const cacheName = 'v11';

// 2- os resources que serão salvos no cache;

const resourcesToPrecache = [
    "https://wevessonmadson.github.io/superMarket/",
    "https://wevessonmadson.github.io/superMarket/index.html",
    "https://wevessonmadson.github.io/superMarketassets/favicon.png",
    "https://wevessonmadson.github.io/superMarketassets/github-icon.png",
    "https://wevessonmadson.github.io/superMarketassets/linkedin-icon.png",
    "https://wevessonmadson.github.io/superMarketassets/android/android-launchericon-48-48.png",
    "https://wevessonmadson.github.io/superMarketassets/android/android-launchericon-72-72.png",
    "https://wevessonmadson.github.io/superMarketassets/android/android-launchericon-96-96.png",
    "https://wevessonmadson.github.io/superMarketassets/android/android-launchericon-192-192.png",
    "https://wevessonmadson.github.io/superMarketassets/android/android-launchericon-512-512.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/16.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/20.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/29.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/32.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/40.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/50.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/57.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/58.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/60.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/64.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/72.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/76.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/80.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/87.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/100.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/114.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/120.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/128.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/152.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/167.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/180.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/192.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/256.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/512.png",
    "https://wevessonmadson.github.io/superMarketassets/ios/1024.png",
    "https://wevessonmadson.github.io/superMarketcss/index.css",
    "https://wevessonmadson.github.io/superMarketjs/index.js",
    "https://wevessonmadson.github.io/superMarketmanifest.json",
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
