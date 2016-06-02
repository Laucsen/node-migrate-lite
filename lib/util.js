
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
