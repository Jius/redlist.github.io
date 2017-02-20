'use strict';

const i18n = require('./i18n');
const data = require('./data');
const Invert = require('lodash.invert');
const Storage = require('./storage');
const Mate = require('./mate');
let inverted = Invert(i18n.fr_FR.products);
let empty = true;

const el = {
  product: $('#addForm #product'), //For the moment, keep jQuery to continue with autocomplete.
  quantity: document.querySelector('#addForm #quantity'),
  unit: document.querySelector('#addForm #unit'),
  list: document.querySelector('#list'),
  btn: document.querySelector('#addProduct'),
  count: document.querySelector('#global-count')
};

const resetForm = () => {
  el.product.val('');
  el.quantity.value = '';
  el.unit.value = '';
}

const addProduct = new Hammer(el.btn);
addProduct.on('tap', () => {
  const values = {
    product: el.product.val(),
    quantity: el.quantity.value,
    unit: el.unit.value
  }
  
  addLine(values);
  Storage.set(values);
  resetForm();
});

const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
                     .toString(16)
                     .substring(1);

const guid = () =>  s4() + s4() + s4();

const addLineToSection = (line, section) => {
  const $section = el.list.querySelector(`#${section}`);
  if ($section === null) {
    const tpl = `<li id="${section}" class="active">
      <div class="collapsible-header active">${i18n.fr_FR.sections[section]}</div>
      <div class="collapsible-body" style="display: block;"><ul class="collection section-list"></ul></div>
    </li>`;

    el.list.insertAdjacentHTML('afterbegin', tpl);
  }
  el.list.querySelector(`#${section} .section-list`).insertAdjacentHTML('afterbegin', line);
};

const updateAutocomplete = (product) => {
  delete inverted[product];
  Mate.each('.autocomplete-content', (target) => {target.remove();});
  el.product.autocomplete({
    data: inverted
  });
};

const onClickOnProduct = (event) => {
  let self =event.target;
  if (!self.classList.contains('product')) self = self.querySelector('.product');
  self.classList.toggle('checked');
  updateHeader();
}

const updateHeader = () => {
  const items = $('.collection-item .product-row');
  const accomplish = $('span.product.checked').length;
  const count = items.length;
  Hammer.each(items, (item, index, src) => {
    const mc = new Hammer(item);
    mc.on('tap', (ev) => {
      mc.off('tap');
      onClickOnProduct(ev);
    });
  });
  
  el.count.textContent = `${accomplish}/${count}`;
}

const addLine = values => {
  if (empty === true) {
    document.querySelector('#instructions').remove();
    empty = false;
  }
  const section = data.sections[data.products[inverted[values.product]]];
  const line = `<li class="collection-item">
    <div class="product-row">
      <span class="over">
        <span class="product">${values.product}</span>
        <span class="badge" data-badge-caption="${values.unit}">${values.quantity}</span>
      </span>
      <span class="actions row">
        <span class="col s6 amber action"><i class="material-icons white-text">edit</i></span>
        <span class="col s6 red action"><i class="material-icons white-text">delete</i></span>
      </span>
    </div>
  </li>`;
  addLineToSection(line, section);
  updateAutocomplete(values.product);
  updateHeader();
}

const modal = Mate.modal('#modal1').register(
  (id, modal) => {
    const   mc = new Hammer(document.querySelector(id));
    mc.on('tap', () => {modal.open()});
  }, 
  
  (id, modal) => {
    const   mc = new Hammer(document.querySelector(id));
    mc.on('tap', () => {modal.close()});
  }
);


$(document).ready(() => {
  $('select').material_select();
  $('.collapsible').collapsible();
  $('input#product').autocomplete({
    data: inverted
  });
  
  Mate.each('.unity', (target) => {
    const mc = new Hammer(target);
    mc.on('tap', () => {
      Mate.each('.unity', (target) => {target.classList.remove('selected')});
      el.unit.value = target.dataset.unit;
      target.classList.toggle('selected');
    });
  });

  Storage.get().forEach(addLine);
})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}