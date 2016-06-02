
import fs from 'fs';
import * as path from 'path';

import * as Util from './util';
import MigrationFile from './migrationfile';

/**
 * Node migration class to control operations.
 * @param options Current options.
 * @param config Current configuration.
 * @constructor
 */
export default function Operations(options, config) {
  this.options = options;
  this.config = config;
}

/**
 * Apply up operation on not loaded migrations.
 */
Operations.prototype.up = function (callback) {
  var self = this;
  this._load((data, migration) => {
    self._migrate('up', data, migration, callback);
  });
};

/**
 * Apply down operation on loaded migrations.
 */
Operations.prototype.down = function (callback) {
  var self = this;
  this._load((data, migration) => {
    self._migrate('down', data, migration, callback);
  });
};

/**
 * Call handler load and wait for an Array of schema state.
 * @param callback
 * @private
 */
Operations.prototype._load = function (callback) {
  var self = this;
  this.options.handler.load(data => {
    var vdata = data;
    if (Util.isPresent(data) === false || Array.isArray(data) === false) {
      vdata = [];
    }

    // On success of loading schema data, we will load all migrations from repository.
    var migs = self._loadMigrations();
    callback(vdata, migs);
  });
};

/**
 * Save current state by calling save handler.
 * @param migration Successful executed migration.
 * @param state Current database state, based on all migrations done untill now.
 * @param callback
 * @private
 */
Operations.prototype._save = function (migration, state, callback) {
  this.options.handler.save(migration, state, () => {
    callback();
  });
};

/**
 * Load all migrations from repository and send it thought callback.
 * @private
 */
Operations.prototype._loadMigrations = function () {
  var dir = path.resolve(this.config.repository);

  var result = [];

  fs.readdirSync(dir).filter(file => {
    return file.match(/^\d+.*\.js$/);
  }).sort().forEach(file => {
    var mod = require(path.join(dir, file));
    result.push(new MigrationFile(file, mod.up, mod.down));
  });

  return result;
};

/**
 * Execute migration in a giver direction.
 * @param direction May be up or down.
 * @param schemaState Array of Schema State. This should be the same array given on save operation.
 * @param migrations All loaded migrations from repository.
 * @param callback Operation callback. Return to user with error or null.
 * @private
 */
Operations.prototype._migrate = function (direction, schemaState, migrations, callback) {
  var self = this;

  switch (direction) {
    // case 'up':
    case 'down':
      migrations = migrations.reverse();
      break;
    default:
  }

  var migratedOnes = [];

  function next(migration) {
    if (!migration) {
      return callback(null);
    }

    migration[direction](err => {
      if (err) {
        return callback(err);
      }
      migratedOnes.push(migration);

      self._save(migration, migratedOnes, () => {
        next(migrations.shift());
      });
    });
  }

  next(migrations.shift());
};
