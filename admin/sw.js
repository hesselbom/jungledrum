/* eslint-env serviceworker */

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('jungledrum-sw-v0.8.0').then(function (cache) {
      return cache.addAll([
        './',
        'admin.css',
        'admin.js',
        'https://cdn.polyfill.io/v2/polyfill.min.js',
        'fonts/fontawesome-webfont.woff2?v=4.7.0',
        'fonts/fontawesome-webfont.woff?v=4.7.0',
        'fonts/fontawesome-webfont.ttf?v=4.7.0',
        'static/logo.png',
        'static/logo.svg',
        'static/logo-white.svg'
      ])
    })
  )
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request)
    })
  )
})
