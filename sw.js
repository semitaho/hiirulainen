const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources).catch(_=>console.error(`can't load ${file} to cache`));
  };
  
  self.addEventListener("install", (event) => {
    console.log('installs', event);
    event.waitUntil(
      addResourcesToCache([
        "/index.html",
        "/audio/**",
        "/textures/**",
       
      ])
    );
  });