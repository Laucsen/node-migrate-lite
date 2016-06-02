import fsExtra from 'fs-extra';

import migrate from '../lib';

var ROOT_FILE = './.nmlite';
var SAMPLE_FILE = './test/fixtures/configfile/.configA';
var EMPTY_FILE = './test/fixtures/configfile/.configB';
var INEXISTENT_FILE = './test/fixtures/configfile/.inexistentConfigFileASDQWEZXC';
var CORRUPT_FILE = './test/fixtures/configfile/.configErrorA';
var NO_MIGRATION_FOLDER = './test/fixtures/configfile/.configErrorB';

describe('node-migration-lite', () => {
  describe('module initialization', () => {
    it('should be initialized with a custom file, on root folder of your project', () => {
      fsExtra.copySync(SAMPLE_FILE, ROOT_FILE);

      var m = migrate.init();

      expect(m.initialized).not.to.be.equal(false);
      fsExtra.unlink(ROOT_FILE);
    });

    it('should be initialized with a given custom file location', () => {
      var m = migrate.init({
        config: SAMPLE_FILE
      });
      expect(m.initialized).not.to.be.equal(false);
    });

    it('should fail when default config file is not found', () => {
      var m = migrate.init();
      expect(m.initialized).to.be.equal(false);
      expect(m.errorMessage).to.be.equal('Configuration file is not found: ' + ROOT_FILE);
    });

    it('should fail when configured file is not found', () => {
      var m = migrate.init({
        config: INEXISTENT_FILE
      });
      expect(m.initialized).to.be.equal(false);
      expect(m.errorMessage).to.be.equal('Configuration file is not found: ' + INEXISTENT_FILE);
    });

    it('should fail on configuration with invalid data', () => {
      var m = migrate.init({
        config: CORRUPT_FILE
      });
      expect(m.initialized).to.be.equal(false);
      expect(m.errorMessage).to.be.equal('Impossible to read file: ' + CORRUPT_FILE);
    });

    it('should fail on configuration without migration #repository', () => {
      var m = migrate.init({
        config: EMPTY_FILE
      });
      expect(m.initialized).to.be.equal(false);
      expect(m.errorMessage).to.be.equal('Configuration file has not a repository information.');
    });

    it('should check for mandatory existence migration folder, setted on config file', () => {
      var mc = migrate.init({
        config: NO_MIGRATION_FOLDER
      });
      expect(mc.errorMessage).to.be.equal('Configured repository is not a folder: test/fixtures/fakefolderasd');
      expect(mc.initialized).to.be.equal(false);
    });
  });
});
