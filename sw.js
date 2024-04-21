const CACHE_NAME = "v1";
const CACHED_RESOURCES = [
  /*
  "./index.html",
  "./index.js",
  */
  "audio/tunetank.mp3",
  "audio/pickup.mp3",
  "assets/rabbit/0.jpg",
  "assets/talo/cubehouse.png",  
  "assets/talo/roof.jpg",  
  "assets/tree/tree.babylon",  
  "assets/joki/waterbump.png",  
  "assets/auto/car.png",  
  "assets/auto/wheel.png",  
  "audio/Yksi.m4a",
  "audio/Kaksi.m4a",
  "audio/Kolme.m4a",
  "audio/Nelja.m4a",
  "audio/Viisi.m4a",
  "audio/loytyi.m4a",
  "audio/Tullaan.m4a",
  "textures/pear/food_pears_asian_01_diff_4k.jpg",
  "textures/flare_01.png",
  "textures/grasspt.PNG",
  "textures/apple.jpeg",
  "textures/trampoline.jpeg",
  "textures/trampoline2.jpeg",
  "textures/roadpt.jpeg",  
  "textures/kavelytie.jpeg",
  "textures/palmtree.png",
  "assets/multa/soilMud.jpeg",
  "textures/snow/snow_02_diff_4k.jpg",
  "hiirulaisicon.png",
  "https://assets.babylonjs.com/environments/cubehouse.png",
  "https://assets.babylonjs.com/environments/car.png",
  "https://assets.babylonjs.com/environments/wheel.png",
  "https://assets.babylonjs.com/environments/roof.jpg"

];
const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(resources);
  console.log('done adding cache!');
  self.skipWaiting();
};


function hasCacheableResource(event) {
  return !!CACHED_RESOURCES
  .find(cachedResource =>event.request.url.indexOf(cachedResource) > -1);

}

self.addEventListener('fetch', event => {
  if (!hasCacheableResource(event)) {
    console.warn('resource not cacheable' ,event.request.url);

    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      
      return caches.open(CACHE_NAME).then(cache => {
        return fetch(event.request).then(response => {
          // Put a copy of the response in the runtime cache.
          return cache.put(event.request, response.clone()).then(() => {
            return response;
          });
        });
      });

    })
  );

});

self.addEventListener('activate', function (event) {
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("install", (event) => {
  console.log('installing service worker...');
  event.waitUntil(
    addResourcesToCache(CACHED_RESOURCES)
  );
});