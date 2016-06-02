'use strict';

var db = require('../db');

exports.up = function (next) {
  db.data('File').create([{
    name: 'james.txt',
    owner: 'lannister'
  }], next);
};

exports.down = function (next) {
  db.data('File').delete('name', ['james.txt'], next);
};
