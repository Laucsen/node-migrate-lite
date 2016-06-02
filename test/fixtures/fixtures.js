/**
 * Fixture files.
 */

import * as handlers from './handlers';

export var configFiles = {
  ROOT_FILE: './.nmlite',
  SAMPLE_FILE: './test/fixtures/configfile/.configA',
  EMPTY_FILE: './test/fixtures/configfile/.configB',
  SAMPLE_FILE_B: './test/fixtures/configfile/.configC',
  SAMPLE_FILE_C: './test/fixtures/configfile/.configD',
  INEXISTENT_FILE: './test/fixtures/configfile/.inexistentConfigFileASDQWEZXC',
  CORRUPT_FILE: './test/fixtures/configfile/.configErrorA',
  NO_MIGRATION_FOLDER: './test/fixtures/configfile/.configErrorB',
  REPOSITORY_AS_FILE: './test/fixtures/configfile/.configErrorC'
};

export {handlers};
