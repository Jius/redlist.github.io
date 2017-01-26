'use strict';

const i18n = require('./i18n');
const data = require('./data');
const Invert = require('lodash.invert');
const Storage = require('./storage');
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

const updateHeader = () => {
  const items = $('.collection-item label');
  const accomplish = $('label.checked').length;
  const count = items.length;
  items.off('click').on('click', event => {
    const self = $(event.target);
    if (self.hasClass('checked')) {
      self.removeClass('checked')
    } else {
      self.addClass('checked')
    }
    updateHeader()
  });
  el.count.text(`${accomplish}/${count}`);
}

const addLine = values => {
  if (empty === true) {
    $('#instructions').remove();
    empty = false;
  }
  const section = data.sections[data.products[inverted[values.product]]];
  const uuid = guid();
  const line = `<li class="collection-item">
    <input type="checkbox" id="${uuid}" name="${uuid}" />
    <label for="${uuid}">${values.product}</label>
    <span class="badge" data-badge-caption="${values.unit}">${values.quantity}</span>    
  </li>`;
  addLineToSection(line, section);
  updateAutocomplete(values.product);
  updateHeader();
}

$(document).ready(() => {
  $('.modal').modal();
  $('select').material_select();
  $('.collapsible').collapsible();
  $('input#product').autocomplete({
    data: inverted
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