/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./sw.js":
/*!***************!*\
  !*** ./sw.js ***!
  \***************/
/***/ (() => {

eval("const CACHE_NAME = \"v1\";\nconst CACHED_RESOURCES = [\n  /*\n  \"./index.html\",\n  \"./index.js\",\n  */\n  \"audio/tunetank.mp3\",\n  \"audio/pickup.mp3\",\n\n  \n  \"audio/Yksi.m4a\",\n  \"audio/Kaksi.m4a\",\n  \"audio/Kolme.m4a\",\n  \"audio/Nelja.m4a\",\n  \"audio/Viisi.m4a\",\n  \"audio/loytyi.m4a\",\n  \"audio/Tullaan.m4a\",\n  \"textures/pear/food_pears_asian_01_diff_4k.jpg\",\n  \"textures/flare_01.png\",\n  \"textures/grasspt.PNG\",\n  \"textures/apple.jpeg\",\n  \"textures/trampoline.jpeg\",\n  \"textures/trampoline2.jpeg\",\n  \"textures/roadpt.jpeg\",  \n  \"textures/kavelytie.jpeg\",\n  \"textures/palmtree.png\",\n  \"assets/multa/soilMud.jpeg\",\n  \"textures/snow/snow_02_diff_4k.jpg\",\n  \"hiirulaisicon.png\",\n  \"https://assets.babylonjs.com/environments/cubehouse.png\",\n  \"https://assets.babylonjs.com/environments/car.png\",\n  \"https://assets.babylonjs.com/environments/wheel.png\",\n  \"https://assets.babylonjs.com/environments/roof.jpg\"\n\n];\nconst addResourcesToCache = async (resources) => {\n  const cache = await caches.open(CACHE_NAME);\n  await cache.addAll(resources);\n  ('done adding cache!');\n  self.skipWaiting();\n};\n\n\nfunction hasCacheableResource(event) {\n  return !!CACHED_RESOURCES\n  .find(cachedResource =>event.request.url.indexOf(cachedResource) > -1);\n\n}\n\nself.addEventListener('fetch', event => {\n  if (!hasCacheableResource(event)) {\n    console.warn('resource not cacheable' ,event.request.url);\n\n    return;\n  }\n\n  event.respondWith(\n    caches.match(event.request).then(cachedResponse => {\n      if (cachedResponse) {\n        return cachedResponse;\n      }\n\n      \n      return caches.open(RUNTIME).then(cache => {\n        return fetch(event.request).then(response => {\n          // Put a copy of the response in the runtime cache.\n          return cache.put(event.request, response.clone()).then(() => {\n            return response;\n          });\n        });\n      });\n\n    })\n  );\n\n});\n\nself.addEventListener('activate', function (event) {\n  const currentCaches = [CACHE_NAME];\n  event.waitUntil(\n    caches.keys().then(cacheNames => {\n      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));\n    }).then(cachesToDelete => {\n      return Promise.all(cachesToDelete.map(cacheToDelete => {\n        return caches.delete(cacheToDelete);\n      }));\n    }).then(() => self.clients.claim())\n  );\n});\n\nself.addEventListener(\"install\", (event) => {\n  ('installing service worker...');\n  event.waitUntil(\n    addResourcesToCache(CACHED_RESOURCES)\n  );\n});\n\n//# sourceURL=webpack://hiirulainen/./sw.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./sw.js"]();
/******/ 	
/******/ })()
;