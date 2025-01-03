// 1- o nome do cache

const cacheName = "v2.0.2.4";

// 2- os resources que serão salvos no cache;

const resourcesToPrecache = [
  "/superMarket/",
  "/superMarket/index.html",
  "/superMarket/about.html",
  "/superMarket/lists.html",
  "/superMarket/settings.html",
  "/superMarket/share.html",
  "/superMarket/manifest.json",
  "/superMarket/sw.js",
  "/superMarket/css/global.css",
  "/superMarket/css/index.css",
  "/superMarket/css/lists.css",
  "/superMarket/css/settings.css",
  "/superMarket/css/about.css",
  "/superMarket/css/share.css",
  "/superMarket/js/global.js",
  "/superMarket/js/index.js",
  "/superMarket/js/setting.js",
  "/superMarket/js/share.js",
  "/superMarket/assets/favicon.png",
  "/superMarket/assets/github-icon.png",
  "/superMarket/assets/linkedin-icon.png",
  "/superMarket/assets/check_box.svg",
  "/superMarket/assets/delete.svg",
  "/superMarket/assets/qr-code.svg",
  "/superMarket/assets/android/android-launchericon-48-48.png",
  "/superMarket/assets/android/android-launchericon-72-72.png",
  "/superMarket/assets/android/android-launchericon-96-96.png",
  "/superMarket/assets/android/android-launchericon-192-192.png",
  "/superMarket/assets/android/android-launchericon-512-512.png",
  "/superMarket/assets/ios/16.png",
  "/superMarket/assets/ios/20.png",
  "/superMarket/assets/ios/29.png",
  "/superMarket/assets/ios/32.png",
  "/superMarket/assets/ios/40.png",
  "/superMarket/assets/ios/50.png",
  "/superMarket/assets/ios/57.png",
  "/superMarket/assets/ios/58.png",
  "/superMarket/assets/ios/60.png",
  "/superMarket/assets/ios/64.png",
  "/superMarket/assets/ios/72.png",
  "/superMarket/assets/ios/76.png",
  "/superMarket/assets/ios/80.png",
  "/superMarket/assets/ios/87.png",
  "/superMarket/assets/ios/100.png",
  "/superMarket/assets/ios/114.png",
  "/superMarket/assets/ios/120.png",
  "/superMarket/assets/ios/128.png",
  "/superMarket/assets/ios/152.png",
  "/superMarket/assets/ios/167.png",
  "/superMarket/assets/ios/180.png",
  "/superMarket/assets/ios/192.png",
  "/superMarket/assets/ios/256.png",
  "/superMarket/assets/ios/512.png",
  "/superMarket/assets/ios/1024.png",
  "/superMarket/assets/screenshot/screen.png",
  "https://fonts.googleapis.com/css2?family=Roboto+Flex:wght@100;200;300;400;500;600;700;800;1000&display=swap",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
];

self.addEventListener("install", (event) => {
  event.waitUtil(
    caches.open(cacheName).then((cache) => cache.addAll(resourcesToPrecache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== "basic"
        ) {
          return networkResponse;
        }
        
        const responseToCache = networkResponse.clone();

        caches.open(cacheName).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      })
      .catch(async () => {
        return caches
          .open(cacheName)
          .then((cache) => cache.match(event.request))
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            throw new Error("No cache entry available");
          });
      })
  );
});
