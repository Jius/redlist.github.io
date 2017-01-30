'use strict';

const internals = {};
const KEY = 'products';

internals.storage = window.localStorage;

internals.products = internals.storage.getItem(KEY) || '[]';
internals.products = JSON.parse(internals.products);

module.exports.set = (value) => {
  internals.products.push(value);
  internals.storage.setItem(KEY, JSON.stringify(internals.products));
};

module.exports.get = () => {
  return internals.products;
}