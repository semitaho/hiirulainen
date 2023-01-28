const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};

self.addEventListener('fetch', function (event) {
    console.log('fetching:' + event);
});

self.addEventListener("install", (event) => {
    console.log('installs', event);
    event.waitUntil(
        addResourcesToCache([
            "./index.html",
            "./index.js",
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
            "./textures/soilMud.jpeg",
            "./textures/snow/snow_02_diff_4k.jpg",

        ])
    );
});