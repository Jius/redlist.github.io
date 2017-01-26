'use strict';

const Defaults = require('lodash.defaults');
const internals = {
  products: {}
};

Defaults(internals.products, require('./products/drink'));
Defaults(internals.products, require('./products/flour_patisserie'));
Defaults(internals.products, require('./products/household'));
Defaults(internals.products, require('./products/milk_product'));

module.exports = internals.products;
