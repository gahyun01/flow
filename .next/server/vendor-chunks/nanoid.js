"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/nanoid";
exports.ids = ["vendor-chunks/nanoid"];
exports.modules = {

/***/ "(ssr)/./node_modules/nanoid/index.js":
/*!**************************************!*\
  !*** ./node_modules/nanoid/index.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   customAlphabet: () => (/* binding */ customAlphabet),\n/* harmony export */   customRandom: () => (/* binding */ customRandom),\n/* harmony export */   nanoid: () => (/* binding */ nanoid),\n/* harmony export */   random: () => (/* binding */ random),\n/* harmony export */   urlAlphabet: () => (/* reexport safe */ _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_1__.urlAlphabet)\n/* harmony export */ });\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./url-alphabet/index.js */ \"(ssr)/./node_modules/nanoid/url-alphabet/index.js\");\n\n\n\n\n// It is best to make fewer, larger requests to the crypto module to\n// avoid system call overhead. So, random numbers are generated in a\n// pool. The pool is a Buffer that is larger than the initial random\n// request size by this multiplier. The pool is enlarged if subsequent\n// requests exceed the maximum buffer size.\nconst POOL_SIZE_MULTIPLIER = 128\nlet pool, poolOffset\n\nlet fillPool = bytes => {\n  if (!pool || pool.length < bytes) {\n    pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER)\n    crypto__WEBPACK_IMPORTED_MODULE_0__.randomFillSync(pool)\n    poolOffset = 0\n  } else if (poolOffset + bytes > pool.length) {\n    crypto__WEBPACK_IMPORTED_MODULE_0__.randomFillSync(pool)\n    poolOffset = 0\n  }\n  poolOffset += bytes\n}\n\nlet random = bytes => {\n  // `|=` convert `bytes` to number to prevent `valueOf` abusing and pool pollution\n  fillPool((bytes |= 0))\n  return pool.subarray(poolOffset - bytes, poolOffset)\n}\n\nlet customRandom = (alphabet, defaultSize, getRandom) => {\n  // First, a bitmask is necessary to generate the ID. The bitmask makes bytes\n  // values closer to the alphabet size. The bitmask calculates the closest\n  // `2^31 - 1` number, which exceeds the alphabet size.\n  // For example, the bitmask for the alphabet size 30 is 31 (00011111).\n  let mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1\n  // Though, the bitmask solution is not perfect since the bytes exceeding\n  // the alphabet size are refused. Therefore, to reliably generate the ID,\n  // the random bytes redundancy has to be satisfied.\n\n  // Note: every hardware random generator call is performance expensive,\n  // because the system call for entropy collection takes a lot of time.\n  // So, to avoid additional system calls, extra bytes are requested in advance.\n\n  // Next, a step determines how many random bytes to generate.\n  // The number of random bytes gets decided upon the ID size, mask,\n  // alphabet size, and magic number 1.6 (using 1.6 peaks at performance\n  // according to benchmarks).\n  let step = Math.ceil((1.6 * mask * defaultSize) / alphabet.length)\n\n  return (size = defaultSize) => {\n    let id = ''\n    while (true) {\n      let bytes = getRandom(step)\n      // A compact alternative for `for (let i = 0; i < step; i++)`.\n      let i = step\n      while (i--) {\n        // Adding `|| ''` refuses a random byte that exceeds the alphabet size.\n        id += alphabet[bytes[i] & mask] || ''\n        if (id.length === size) return id\n      }\n    }\n  }\n}\n\nlet customAlphabet = (alphabet, size = 21) =>\n  customRandom(alphabet, size, random)\n\nlet nanoid = (size = 21) => {\n  // `|=` convert `size` to number to prevent `valueOf` abusing and pool pollution\n  fillPool((size |= 0))\n  let id = ''\n  // We are reading directly from the random pool to avoid creating new array\n  for (let i = poolOffset - size; i < poolOffset; i++) {\n    // It is incorrect to use bytes exceeding the alphabet size.\n    // The following mask reduces the random byte in the 0-255 value\n    // range to the 0-63 value range. Therefore, adding hacks, such\n    // as empty string fallback or magic numbers, is unneccessary because\n    // the bitmask trims bytes down to the alphabet size.\n    id += _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_1__.urlAlphabet[pool[i] & 63]\n  }\n  return id\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbmFub2lkL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBMkI7O0FBRTBCOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGtEQUFxQjtBQUN6QjtBQUNBLElBQUk7QUFDSixJQUFJLGtEQUFxQjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCxVQUFVO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsZ0JBQWdCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLCtEQUFXO0FBQ3JCO0FBQ0E7QUFDQTs7QUFFb0UiLCJzb3VyY2VzIjpbIkM6XFxmbG93XFxub2RlX21vZHVsZXNcXG5hbm9pZFxcaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nXG5cbmltcG9ydCB7IHVybEFscGhhYmV0IH0gZnJvbSAnLi91cmwtYWxwaGFiZXQvaW5kZXguanMnXG5cbi8vIEl0IGlzIGJlc3QgdG8gbWFrZSBmZXdlciwgbGFyZ2VyIHJlcXVlc3RzIHRvIHRoZSBjcnlwdG8gbW9kdWxlIHRvXG4vLyBhdm9pZCBzeXN0ZW0gY2FsbCBvdmVyaGVhZC4gU28sIHJhbmRvbSBudW1iZXJzIGFyZSBnZW5lcmF0ZWQgaW4gYVxuLy8gcG9vbC4gVGhlIHBvb2wgaXMgYSBCdWZmZXIgdGhhdCBpcyBsYXJnZXIgdGhhbiB0aGUgaW5pdGlhbCByYW5kb21cbi8vIHJlcXVlc3Qgc2l6ZSBieSB0aGlzIG11bHRpcGxpZXIuIFRoZSBwb29sIGlzIGVubGFyZ2VkIGlmIHN1YnNlcXVlbnRcbi8vIHJlcXVlc3RzIGV4Y2VlZCB0aGUgbWF4aW11bSBidWZmZXIgc2l6ZS5cbmNvbnN0IFBPT0xfU0laRV9NVUxUSVBMSUVSID0gMTI4XG5sZXQgcG9vbCwgcG9vbE9mZnNldFxuXG5sZXQgZmlsbFBvb2wgPSBieXRlcyA9PiB7XG4gIGlmICghcG9vbCB8fCBwb29sLmxlbmd0aCA8IGJ5dGVzKSB7XG4gICAgcG9vbCA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShieXRlcyAqIFBPT0xfU0laRV9NVUxUSVBMSUVSKVxuICAgIGNyeXB0by5yYW5kb21GaWxsU3luYyhwb29sKVxuICAgIHBvb2xPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAocG9vbE9mZnNldCArIGJ5dGVzID4gcG9vbC5sZW5ndGgpIHtcbiAgICBjcnlwdG8ucmFuZG9tRmlsbFN5bmMocG9vbClcbiAgICBwb29sT2Zmc2V0ID0gMFxuICB9XG4gIHBvb2xPZmZzZXQgKz0gYnl0ZXNcbn1cblxubGV0IHJhbmRvbSA9IGJ5dGVzID0+IHtcbiAgLy8gYHw9YCBjb252ZXJ0IGBieXRlc2AgdG8gbnVtYmVyIHRvIHByZXZlbnQgYHZhbHVlT2ZgIGFidXNpbmcgYW5kIHBvb2wgcG9sbHV0aW9uXG4gIGZpbGxQb29sKChieXRlcyB8PSAwKSlcbiAgcmV0dXJuIHBvb2wuc3ViYXJyYXkocG9vbE9mZnNldCAtIGJ5dGVzLCBwb29sT2Zmc2V0KVxufVxuXG5sZXQgY3VzdG9tUmFuZG9tID0gKGFscGhhYmV0LCBkZWZhdWx0U2l6ZSwgZ2V0UmFuZG9tKSA9PiB7XG4gIC8vIEZpcnN0LCBhIGJpdG1hc2sgaXMgbmVjZXNzYXJ5IHRvIGdlbmVyYXRlIHRoZSBJRC4gVGhlIGJpdG1hc2sgbWFrZXMgYnl0ZXNcbiAgLy8gdmFsdWVzIGNsb3NlciB0byB0aGUgYWxwaGFiZXQgc2l6ZS4gVGhlIGJpdG1hc2sgY2FsY3VsYXRlcyB0aGUgY2xvc2VzdFxuICAvLyBgMl4zMSAtIDFgIG51bWJlciwgd2hpY2ggZXhjZWVkcyB0aGUgYWxwaGFiZXQgc2l6ZS5cbiAgLy8gRm9yIGV4YW1wbGUsIHRoZSBiaXRtYXNrIGZvciB0aGUgYWxwaGFiZXQgc2l6ZSAzMCBpcyAzMSAoMDAwMTExMTEpLlxuICBsZXQgbWFzayA9ICgyIDw8ICgzMSAtIE1hdGguY2x6MzIoKGFscGhhYmV0Lmxlbmd0aCAtIDEpIHwgMSkpKSAtIDFcbiAgLy8gVGhvdWdoLCB0aGUgYml0bWFzayBzb2x1dGlvbiBpcyBub3QgcGVyZmVjdCBzaW5jZSB0aGUgYnl0ZXMgZXhjZWVkaW5nXG4gIC8vIHRoZSBhbHBoYWJldCBzaXplIGFyZSByZWZ1c2VkLiBUaGVyZWZvcmUsIHRvIHJlbGlhYmx5IGdlbmVyYXRlIHRoZSBJRCxcbiAgLy8gdGhlIHJhbmRvbSBieXRlcyByZWR1bmRhbmN5IGhhcyB0byBiZSBzYXRpc2ZpZWQuXG5cbiAgLy8gTm90ZTogZXZlcnkgaGFyZHdhcmUgcmFuZG9tIGdlbmVyYXRvciBjYWxsIGlzIHBlcmZvcm1hbmNlIGV4cGVuc2l2ZSxcbiAgLy8gYmVjYXVzZSB0aGUgc3lzdGVtIGNhbGwgZm9yIGVudHJvcHkgY29sbGVjdGlvbiB0YWtlcyBhIGxvdCBvZiB0aW1lLlxuICAvLyBTbywgdG8gYXZvaWQgYWRkaXRpb25hbCBzeXN0ZW0gY2FsbHMsIGV4dHJhIGJ5dGVzIGFyZSByZXF1ZXN0ZWQgaW4gYWR2YW5jZS5cblxuICAvLyBOZXh0LCBhIHN0ZXAgZGV0ZXJtaW5lcyBob3cgbWFueSByYW5kb20gYnl0ZXMgdG8gZ2VuZXJhdGUuXG4gIC8vIFRoZSBudW1iZXIgb2YgcmFuZG9tIGJ5dGVzIGdldHMgZGVjaWRlZCB1cG9uIHRoZSBJRCBzaXplLCBtYXNrLFxuICAvLyBhbHBoYWJldCBzaXplLCBhbmQgbWFnaWMgbnVtYmVyIDEuNiAodXNpbmcgMS42IHBlYWtzIGF0IHBlcmZvcm1hbmNlXG4gIC8vIGFjY29yZGluZyB0byBiZW5jaG1hcmtzKS5cbiAgbGV0IHN0ZXAgPSBNYXRoLmNlaWwoKDEuNiAqIG1hc2sgKiBkZWZhdWx0U2l6ZSkgLyBhbHBoYWJldC5sZW5ndGgpXG5cbiAgcmV0dXJuIChzaXplID0gZGVmYXVsdFNpemUpID0+IHtcbiAgICBsZXQgaWQgPSAnJ1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgYnl0ZXMgPSBnZXRSYW5kb20oc3RlcClcbiAgICAgIC8vIEEgY29tcGFjdCBhbHRlcm5hdGl2ZSBmb3IgYGZvciAobGV0IGkgPSAwOyBpIDwgc3RlcDsgaSsrKWAuXG4gICAgICBsZXQgaSA9IHN0ZXBcbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgLy8gQWRkaW5nIGB8fCAnJ2AgcmVmdXNlcyBhIHJhbmRvbSBieXRlIHRoYXQgZXhjZWVkcyB0aGUgYWxwaGFiZXQgc2l6ZS5cbiAgICAgICAgaWQgKz0gYWxwaGFiZXRbYnl0ZXNbaV0gJiBtYXNrXSB8fCAnJ1xuICAgICAgICBpZiAoaWQubGVuZ3RoID09PSBzaXplKSByZXR1cm4gaWRcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubGV0IGN1c3RvbUFscGhhYmV0ID0gKGFscGhhYmV0LCBzaXplID0gMjEpID0+XG4gIGN1c3RvbVJhbmRvbShhbHBoYWJldCwgc2l6ZSwgcmFuZG9tKVxuXG5sZXQgbmFub2lkID0gKHNpemUgPSAyMSkgPT4ge1xuICAvLyBgfD1gIGNvbnZlcnQgYHNpemVgIHRvIG51bWJlciB0byBwcmV2ZW50IGB2YWx1ZU9mYCBhYnVzaW5nIGFuZCBwb29sIHBvbGx1dGlvblxuICBmaWxsUG9vbCgoc2l6ZSB8PSAwKSlcbiAgbGV0IGlkID0gJydcbiAgLy8gV2UgYXJlIHJlYWRpbmcgZGlyZWN0bHkgZnJvbSB0aGUgcmFuZG9tIHBvb2wgdG8gYXZvaWQgY3JlYXRpbmcgbmV3IGFycmF5XG4gIGZvciAobGV0IGkgPSBwb29sT2Zmc2V0IC0gc2l6ZTsgaSA8IHBvb2xPZmZzZXQ7IGkrKykge1xuICAgIC8vIEl0IGlzIGluY29ycmVjdCB0byB1c2UgYnl0ZXMgZXhjZWVkaW5nIHRoZSBhbHBoYWJldCBzaXplLlxuICAgIC8vIFRoZSBmb2xsb3dpbmcgbWFzayByZWR1Y2VzIHRoZSByYW5kb20gYnl0ZSBpbiB0aGUgMC0yNTUgdmFsdWVcbiAgICAvLyByYW5nZSB0byB0aGUgMC02MyB2YWx1ZSByYW5nZS4gVGhlcmVmb3JlLCBhZGRpbmcgaGFja3MsIHN1Y2hcbiAgICAvLyBhcyBlbXB0eSBzdHJpbmcgZmFsbGJhY2sgb3IgbWFnaWMgbnVtYmVycywgaXMgdW5uZWNjZXNzYXJ5IGJlY2F1c2VcbiAgICAvLyB0aGUgYml0bWFzayB0cmltcyBieXRlcyBkb3duIHRvIHRoZSBhbHBoYWJldCBzaXplLlxuICAgIGlkICs9IHVybEFscGhhYmV0W3Bvb2xbaV0gJiA2M11cbiAgfVxuICByZXR1cm4gaWRcbn1cblxuZXhwb3J0IHsgbmFub2lkLCBjdXN0b21BbHBoYWJldCwgY3VzdG9tUmFuZG9tLCB1cmxBbHBoYWJldCwgcmFuZG9tIH1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/nanoid/index.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/nanoid/url-alphabet/index.js":
/*!***************************************************!*\
  !*** ./node_modules/nanoid/url-alphabet/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   urlAlphabet: () => (/* binding */ urlAlphabet)\n/* harmony export */ });\n// This alphabet uses `A-Za-z0-9_-` symbols.\n// The order of characters is optimized for better gzip and brotli compression.\n// Same as in non-secure/index.js\nlet urlAlphabet =\n  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbmFub2lkL3VybC1hbHBoYWJldC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFc0IiLCJzb3VyY2VzIjpbIkM6XFxmbG93XFxub2RlX21vZHVsZXNcXG5hbm9pZFxcdXJsLWFscGhhYmV0XFxpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGFscGhhYmV0IHVzZXMgYEEtWmEtejAtOV8tYCBzeW1ib2xzLlxuLy8gVGhlIG9yZGVyIG9mIGNoYXJhY3RlcnMgaXMgb3B0aW1pemVkIGZvciBiZXR0ZXIgZ3ppcCBhbmQgYnJvdGxpIGNvbXByZXNzaW9uLlxuLy8gU2FtZSBhcyBpbiBub24tc2VjdXJlL2luZGV4LmpzXG5sZXQgdXJsQWxwaGFiZXQgPVxuICAndXNlYW5kb20tMjZUMTk4MzQwUFg3NXB4SkFDS1ZFUllNSU5EQlVTSFdPTEZfR1FaYmZnaGprbHF2d3l6cmljdCdcblxuZXhwb3J0IHsgdXJsQWxwaGFiZXQgfVxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/nanoid/url-alphabet/index.js\n");

/***/ })

};
;