
import fs from 'fs';

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

  this.handler = undefined;

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
      console.log(err);
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

export default Migrate;
