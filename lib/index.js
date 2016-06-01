/**
 * Node Migrate Lite
 */

import Migrate from './migrate';

/**
 * Initialize Node Migrate Lite Library.
 */
function init(options) {
  return new Migrate(options);
}

export default {init};
