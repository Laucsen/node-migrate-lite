'use strict';

var db = require('../db');

exports.up = function (next) {
  db.data('Document').change('name', {
    name: 'james.doc',
    owner: 'albert einstein'
  }, next);
};

exports.down = function (next) {
  db.data('Document').change('name', {
    name: 'james.doc',
    owner: 'james'
  }, next);
};
