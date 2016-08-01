
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
 * @param targetMigration Migration to start downgrade operation.
 * @param callback Finish callback.
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
 * @param direction Current direction.
 * @param migration Successful executed migration.
 * @param state Current database state, based on all migrations done untill now.
 * @param callback
 * @private
 */
Operations.prototype._save = function (direction, migration, state, callback) {
  this.options.handler.save(migration, state, (direction === 'up') ? 'added' : 'removed', () => {
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
 * Update current migration data based on direction and return the new collection.
 * @param state Current state. All migrated migrations.
 * @param direction up or down.
 * @param migration Current working migration.
 * @returns New state.
 * @private
 */
Operations.prototype._update = function (state, direction, migration) {
  var result;
  if (direction === 'up') {
    state.push(migration.data());
    result = state;
  } else {
    result = state.filter(it => {
      return migration.timestamp !== it.timestamp || migration.migration !== it.migration;
    });
  }
  return result;
};

/**
 * Match migrations that ar note on this migration.
 * @param migrations
 * @param schemaState
 * @returns {*}
 * @private
 */
Operations.prototype._matchDifference = function (migrations, schemaState) {
  schemaState.forEach(it => {
    migrations = migrations.filter(at => {
      return at.timestamp !== it.timestamp;
    });
  });

  return migrations;
};

/**
 * Mach migrations the are on this migration.
 * @param migrations
 * @param schemaState
 * @private
 */
Operations.prototype._matchEquals = function (migrations, schemaState) {
  var result = [];
  migrations.forEach(mig => {
    var found = false;
    schemaState.forEach(it => {
      if (it.timestamp === mig.timestamp) {
        found = true;
      }
    });
    if (found === true) {
      result.push(mig);
    }
  });

  return result;
};

/**
 * Execute migration inver direction.
 * @param direction May be up or down.
 * @param schemaState Array of Schema State. This should be the same array given on save operation.
 * @param migrations All loaded migrations from repository.
 * @param callback Operation callback. Return to user with error or null.
 * @private
 */
Operations.prototype._migrate = function (direction, schemaState, migrations, callback) {
  function safeCallback(err) {
    try {
      callback(err);
    } catch (err) {
      console.log('Error control flow. There are some errors catch on your migration completion callback.');
      console.trace(err);
    }
  }

  var self = this;

  switch (direction) {
    case 'up':
      migrations = this._matchDifference(migrations, schemaState);
      break;
    case 'down':
      migrations = this._matchEquals(migrations, schemaState);
      migrations = migrations.reverse();
      break;

    // no default
  }

  var currentState = schemaState;
  var currentMigrations = [];

  function next(migration) {
    if (!migration) {
      return safeCallback(null);
    }

    currentMigrations.push(migration);

    try {
      migration[direction](err => {
        if (err) {
          if (direction === 'up') {
            currentState = self._update(currentState, direction, migration);
            // If applying migrations and find an error, apply down that migrations.
            self._migrate('down', schemaState, currentMigrations.reverse(), () => {
              safeCallback(err);
            });
          } else {
            safeCallback(err);
          }
        } else {
          currentState = self._update(currentState, direction, migration);
          self._save(direction, migration.data(), currentState, () => {
            next(migrations.shift());
          });
        }
      });
    } catch (err) {
      if (direction === 'up') {
        currentState = self._update(currentState, direction, migration);
        // If applying migrations and find an error, apply down that migrations.
        self._migrate('down', schemaState, currentMigrations.reverse(), () => {
          safeCallback(err);
        });
      } else {
        safeCallback(err);
      }
    }
  }

  next(migrations.shift());
};
