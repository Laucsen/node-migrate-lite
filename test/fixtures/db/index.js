
export var DB = {};

export function clear() {
  DB = {};
}

export function data(database) {
  if (DB[database] === undefined) {
    DB[database] = [];
  }
  return {
    db: database,
    create: function (array, next) {
      var self = this;
      array.forEach(it => {
        DB[self.db].push(it);
      });
      next();
    },
    change: function (id, item, next) {
      var self = this;
      for (var i = 0; i < DB[self.db].length; i++) {
        if (DB[self.db][i][id] === item[id]) {
          DB[self.db][i] = item;
        }
      }
      next();
    },
    delete: function (id, items, next) {
      var self = this;
      for (var j = 0; j < items.length; j++) {
        for (var i = 0; i < DB[self.db].length; i++) {
          if (DB[self.db][i][id] === items[j]) {
            DB[self.db].splice(i, 1);
            i--;
          }
        }
      }
      next();
    }
  };
}
