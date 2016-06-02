
export var DB = {};

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
    }
  };
}
