'use strict';

var db = require('../../db');

exports.up = function (next) {
  db.data('Document').create([{
    name: 'di.doc',
    owner: 'di'
  }], next);
};

exports.down = function (next) {
  db.data('Document').delete('name', [
    'di.doc'], next);
};
