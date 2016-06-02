
import fs from 'fs';
import {join} from 'path';

import Operations from './operations';
import * as Util from './util';
import {template} from './templates';

/**
 * Node Migreate Lite Controller.
 *
 * @param options.config Location of a configuration file.
 *   This configuration file must be a JSON style with folowing attributes:
 *     "repository"  -> Path to a folder where migrations files can be found.
 *     "handler"     -> Path to a JavaScript file with handler implementation: By requiring this file, it must expose "load" and "save" functions.
 */
function Migrate(options) {
  options = (typeof options === 'undefined') ? {} : options;
  if (options.config === undefined) {
    options.config = './.nmlite';
  }
  this.options = options;

  this.initialized = false;
  this.errorMessage = undefined;

  this.config = undefined;

  // Check and load config file.
  var loadResult = this._loadConfig();
  if (loadResult !== null) {
    this.errorMessage = loadResult;
    return;
  }

  // Check configuration file data
  var checkResult = this._checkConfig();
  if (checkResult !== null) {
    this.errorMessage = checkResult;
    return;
  }

  // Check handler implementation
  var handlerResult = this._checkHandler();
  if (handlerResult !== null) {
    this.errorMessage = handlerResult;
    return;
  }

  this.operations = new Operations(this.options, this.config);
  this.initialized = true;
}

/**
 * Load config file and return null if config file was successful reade or a error message on String format.
 * @private
 */
Migrate.prototype._loadConfig = function () {
  var result = null;
  if (fs.existsSync(this.options.config) === false) {
    result = 'Configuration file is not found: ' + this.options.config;
  } else {
    try {
      var file = fs.readFileSync(this.options.config, 'utf8');
      this.config = JSON.parse(file);
    } catch (err) {
      result = 'Impossible to read file: ' + this.options.config;
    }
  }

  return result;
};

/**
 * Check if configuration file has all needed data. It will return null when config is successful read, or a error message on String format.
 * @private
 */
Migrate.prototype._checkConfig = function () {
  if (this.config.repository === undefined) {
    return 'Configuration file has not a repository information.';
  }

  var repDirMessage = 'Configured repository is not a folder: ' + this.config.repository;
  try {
    var stat = fs.statSync(this.config.repository);
    if (stat.isDirectory() === false) {
      return repDirMessage;
    }
  } catch (err) {
    return repDirMessage;
  }

  return null;
};

/**
 * Check if schema state handle is present and with minimal functions (save / load).
 * @private
 */
Migrate.prototype._checkHandler = function () {
  if (this.options.handler === undefined) {
    return 'Missing Handler configuration.';
  }

  if (Util.isPresent(this.options.handler.save, this.options.handler.load) === false ||
      Util.isFunction(this.options.handler.save, this.options.handler.load) === false) {
    return 'Missing save or load handler implementation.';
  }

  return null;
};

/**
 * Create a new migration file at repository location with current time stamp.
 * @param migrationName Name of migration to be created.
 * @returns {string} Created file path.
 */
Migrate.prototype.create = function (migrationName) {
  var curr = Date.now();
  var name = Util.slugify(migrationName);

  var title = curr + '-' + name;
  var path = join(this.config.repository, title + '.js');

  fs.writeFileSync(path, template);

  return path;
};

/**
 * Apply migration up on every migration found on repository. Migrations found on loaded schema state will be ignored.
 */
Migrate.prototype.up = function (callback) {
  this.operations.up(callback);
};

/**
 * Apply migration down on every migration found on repository. Migrations not found on loaded schema state will be ignored.
 */
Migrate.prototype.down = function (callback) {
  this.operations.down(callback);
};

export default Migrate;
