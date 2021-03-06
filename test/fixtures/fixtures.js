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
  SAMPLE_FILE_D: './test/fixtures/configfile/.configE',
  SAMPLE_FILE_E: './test/fixtures/configfile/.configF',
  SAMPLE_FILE_F: './test/fixtures/configfile/.configG',
  SAMPLE_FILE_G: './test/fixtures/configfile/.configH',
  INEXISTENT_FILE: './test/fixtures/configfile/.inexistentConfigFileASDQWEZXC',
  CORRUPT_FILE: './test/fixtures/configfile/.configErrorA',
  NO_MIGRATION_FOLDER: './test/fixtures/configfile/.configErrorB',
  REPOSITORY_AS_FILE: './test/fixtures/configfile/.configErrorC'
};

export {handlers};
