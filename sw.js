const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
  };
  
  self.addEventListener("install", (event) => {
    console.log('installs', event);
    event.waitUntil(
      addResourcesToCache([
        "./index.html",
        "./audio/**",
        "./textures/**",
       
      ])
    );
  });