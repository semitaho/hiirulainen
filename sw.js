const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
  };
  
  self.addEventListener("install", (event) => {
    console.log('installs', event);
    event.waitUntil(
      addResourcesToCache([
        "./index.html",
        "./audio/tunetank.mp3",
        "./audio/Yksi.m4a",
        "./audio/Kaksi.m4a",
        "./audio/Kolme.m4a",
        "./audio/Nelja.m4a",
        "./audio/Viisi.m4a",
        "./audio/Tullaan.m4a",

        "./textures/flare_01.png",
        "./textures/grasspt.PNG",
        "./textures/kavelytie.jpeg",
        "./textures/palmtree.png",
       
      ])
    );
  });