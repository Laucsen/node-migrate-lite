
/**
 * Check if arguments are nor null and neither undefined.
 */
export function isPresent() {
  var args = Array.prototype.slice.call(arguments);
  for (var i = 0; i < args.length; i++) {
    var it = args[i];
    if (it === null || it === undefined) {
      return false;
    }
  }
  return true;
}

/**
 * Check if arguments are functions.
 * @returns {boolean}
 */
export function isFunction() {
  var args = Array.prototype.slice.call(arguments);
  for (var i = 0; i < args.length; i++) {
    var it = args[i];
    var getType = {};
    if (it === undefined || getType.toString.call(it) !== '[object Function]') {
      return false;
    }
  }
  return true;
}

/**
 * Slugify a strign.
 * @param str
 * @returns {void|XML|string|*}
 */
export function slugify(str) {
  return str.replace(/\s+/g, '-');
}

/**
 * Check if an operation is up operation.
 * @param direction
 * @returns {boolean}
 */
export function isUp(direction) {
  return direction === 'up';
}
