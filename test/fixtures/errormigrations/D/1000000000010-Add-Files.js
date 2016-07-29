'use strict';

var db = require('../../db');

exports.up = function (next) {
  throw new Error('Impossible to do that! Error forced on second step.');
};

exports.down = function (next) {
  db.data('File').delete('name', ['james.txt'], next);
};
