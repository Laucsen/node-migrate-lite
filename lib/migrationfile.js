
export default function MigrationFile(file, upFn, downFn) {
  var metaFile = file.split('-');

  this.timestamp = metaFile.shift();
  this.migration = file.substring(this.timestamp.length + 1, file.length - 3);
  this.up = upFn;
  this.down = downFn;
}

/**
 * Get only relevant data abour a file.
 */
MigrationFile.prototype.data = function () {
  return {
    timestamp: this.timestamp,
    migration: this.migration
  };
};
