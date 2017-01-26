'use strict';

const CACHE_NAME = 'v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/materialize.min.css',
  '/img/brand-logo.png',
  '/js/bundle.js',
  '/js/jquery.min.js',
  '/js/materialize.min.js'
];

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});