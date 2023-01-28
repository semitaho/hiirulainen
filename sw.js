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

eval("const addResourcesToCache = async (resources) => {\n    const cache = await caches.open(\"v1\");\n    await cache.addAll(resources);\n  };\n  \n  self.addEventListener(\"install\", (event) => {\n    ('installs', event);\n    event.waitUntil(\n      addResourcesToCache([\n        \"./index.html\",\n        \"./audio/tunetank.mp3\",\n        \"./audio/Yksi.m4a\",\n        \"./audio/Kaksi.m4a\",\n        \"./audio/Kolme.m4a\",\n        \"./audio/Nelja.m4a\",\n        \"./audio/Viisi.m4a\",\n        \"./audio/Tullaan.m4a\",\n\n        \"./textures/flare_01.png\",\n        \"./textures/grasspt.PNG\",\n        \"./textures/kavelytie.jpeg\",\n        \"./textures/palmtree.png\",\n       \n      ])\n    );\n  });\n\n//# sourceURL=webpack://hiirulainen/./sw.js?");

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