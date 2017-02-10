'use strict';

const i18n = require('./i18n');
const data = require('./data');
const Invert = require('lodash.invert');
const Storage = require('./storage');
const Mate = require('./mate');
let inverted = Invert(i18n.fr_FR.products);
let empty = true;

const el = {
  product: $('#addForm #product'),
  quantity: $('#addForm #quantity'),
  unit: $('#addForm #unit'),
  list: $('#list'),
  btn: $('#addProduct'),
  count: $('#global-count')
};

const resetForm = () => {
  el.product.val('');
  el.quantity.val('');
  el.unit.val('');
}

el.btn.click(() => {
  const values = {
    product: el.product.val(),
    quantity: el.quantity.val(),
    unit: el.unit.val()
  }
  
  addLine(values);
  Storage.set(values);
  resetForm();
  console.log(localStorage);
});

const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
                     .toString(16)
                     .substring(1);

const guid = () =>  s4() + s4() + s4();

const addLineToSection = (line, section) => {
  const $section = el.list.find(`#${section}`);
  if ($section.length === 0) {
    const tpl = `<li id="${section}" class="active">
      <div class="collapsible-header active">${i18n.fr_FR.sections[section]}</div>
      <div class="collapsible-body" style="display: block;"><ul class="collection section-list"></ul></div>
    </li>`;

    el.list.prepend(tpl);
  }
  el.list.find(`#${section} .section-list`).prepend(line);
};

const updateAutocomplete = (product) => {
  delete inverted[product];
  $('.autocomplete-content').remove();
  el.product.autocomplete({
    data: inverted
  });
};

const onClickOnProduct = event => {
  let self = $(event.target);
  console.log(self.hasClass('product'));
  if (!self.hasClass('product')) self = self.find('.product');

  if (self.hasClass('checked')) {
    self.removeClass('checked')
  } else {
    self.addClass('checked')
  }
  updateHeader()
}

const updateHeader = () => {
  const items = $('.collection-item .product-row');
  const accomplish = $('span.product.checked').length;
  const count = items.length;
  items.off('click').on('click', onClickOnProduct);
  el.count.text(`${accomplish}/${count}`);
}

const addLine = values => {
  if (empty === true) {
    $('#instructions').remove();
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

  $('.unity').click( event => {
    const self = $(event.target)
    el.unit.val('');

    if (!self.hasClass('selected')) {
      el.unit.val(self.data('unit'));
    } else {
      $('.unity.selected');
    }
    self.toggleClass('selected');
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