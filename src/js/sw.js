'use strict';

const CACHE_NAME = 'v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
  '/css/main.css',
  '/img/instructions.png',
  '/bower_components/material-design-icons/iconfont/material-icons.css',
  '/bower_components/materialize/dist/css/materialize.min.css',
  '/img/brand-logo.png',
  '/js/bundle.js',
  '/bower_components/jquery/dist/jquery.min.js',
  '/bower_components/materialize/dist/js/materialize.min.js',
  '/bower_components/material-design-icons/iconfont/MaterialIcons-Regular.ttf',
  '/bower_components/materialize/dist/fonts/roboto/Roboto-Regular.ttf',
  '/bower_components/materialize/dist/fonts/roboto/Roboto-Regular.woff',
  '/bower_components/material-design-icons/iconfont/MaterialIcons-Regular.woff',
  '/bower_components/materialize/dist/fonts/roboto/Roboto-Regular.woff2',
  '/bower_components/material-design-icons/iconfont/MaterialIcons-Regular.woff2'
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