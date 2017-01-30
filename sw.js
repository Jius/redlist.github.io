(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

const CACHE_NAME = 'v1.0.0';
const urlsToCache = ['/', '/index.html', '/manifest.json', '/sw.js', '/css/main.css', '/img/instructions.png', '/bower_components/material-design-icons/iconfont/material-icons.css', '/bower_components/materialize/dist/css/materialize.min.css', '/img/brand-logo.png', '/js/bundle.js', '/bower_components/jquery/dist/jquery.min.js', '/bower_components/materialize/dist/js/materialize.min.js', '/bower_components/material-design-icons/iconfont/MaterialIcons-Regular.ttf', '/bower_components/materialize/dist/fonts/roboto/Roboto-Regular.ttf', '/bower_components/materialize/dist/fonts/roboto/Roboto-Regular.woff', '/bower_components/material-design-icons/iconfont/MaterialIcons-Regular.woff', '/bower_components/materialize/dist/fonts/roboto/Roboto-Regular.woff2', '/bower_components/material-design-icons/iconfont/MaterialIcons-Regular.woff2'];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(response => {
    // Cache hit - return response
    if (response) {
      return response;
    }
    return fetch(event.request);
  }));
});

},{}]},{},[1]);
