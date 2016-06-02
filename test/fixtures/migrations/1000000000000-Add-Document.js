'use strict';

var db = require('../db');

exports.up = function (next) {
  db.data('Document').create([{
    name: 'james.doc',
    owner: 'james'
  }, {
    name: 'ritalia.doc',
    owner: 'dr ray'
  }], next);
};

exports.down = function (next) {
  next();
};
