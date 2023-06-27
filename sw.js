async function addResourcesToCache (resources) {
    const cache = await caches.open("v1.0.0b1.1.2");
    await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache([
            "./",
            "./index.html",
            "./style.css",
            "./app.js",
            "./red-cross.svg"
        ])
    );
});

async function putInCache (request, response) {
    const cache = await caches.open("v1");
    await cache.put(request, response);
};

async function cacheFirst (request) {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
};

self.addEventListener("fetch", (event) => {
    event.respondWith(cacheFirst(event.request));
});
