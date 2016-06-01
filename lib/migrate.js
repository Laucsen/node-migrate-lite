
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
    options.config = './.nmLite';
  }

  this.initialized = false;
  this.errorMessage = undefined;

  // Open config file.
  if (!fs.existsSync(options.config)) {
    this.errorMessage = 'Configuration file is not found: ' + options.config;
    return;
  }
}

export default Migrate;
