import assert from 'assert';
import migrate from '../lib';

describe('node-migration-lite', () => {
  describe('module initialization', () => {
    it('should be initialized with a custom file, on root folder of yout project', () => {
      var m = migrate.init();
      assert(m.initialized !== false, 'we expected migration to be initialized with default data.');
    });

    it('should be initialized with a given custom file location', () => {
      var m = migrate.init({
        config: './test/fixtures/configfile/.configA'
      });
      assert(m.initialized !== false, 'we expected migration to be initialized with custom data.');
    });

    it('should fail when default config file is not found', () => {
      var m = migrate.init();
      expect(m.initialized).to.be.equal(false);
      expect(m.errorMessage).to.be.equal('Configuration file is not found: ./.nmLite');
    });

    it('should fail when configured file is not found', () => {
      var m = migrate.init({
        config: './test/fixtures/configfile/.inexistentConfigFileASDQWEZXC'
      });
      assert(m.initialized === false, 'we expected error on inexistent configuration file.');
      assert(m.errorMessage === 'Impossible to read file: ./test/fixtures/configfile/.configErrorA', 'we expected a message about current error.');
    });

    it('should fail on configuration with invalid data', () => {
      var m = migrate.init({
        config: './test/fixtures/configfile/.configErrorA'
      });
      assert(m.initialized === false, 'we expected error on invalid files.');
      assert(m.errorMessage === 'Impossible to read file: ./test/fixtures/configfile/.configErrorA', 'we expected a message about current error.');
    });

    it('should fail on configuration without migration #repository', () => {
      var m = migrate.init({
        config: './test/fixtures/configfile/.configErrorB'
      });
      assert(m.initialized === false, 'we expected error config files without a repository information.');
      assert(m.errorMessage === 'Configuration file has not a repository information.', 'we expected a message about current error.');
    });

    it('should fail on configuration without migration: #handler', () => {
      var m = migrate.init({
        config: './test/fixtures/configfile/.configErrorC'
      });
      assert(m.initialized === false, 'we expected error config files without a handler information.');
      assert(m.errorMessage === 'Configuration file has not a handler information.', 'we expected a message about current error.');
    });
  });

  describe('config file validation', () => {
    it('should check for mandatory existence migration folder, setted on config file', () => {
      var mc = migrate.init({
        config: './test/fixtures/configfile/.configErrorD'
      });
      assert(mc.initialized === false, 'we expected error config files with repository folder not found.');
      assert(mc.errorMessage === 'Configured repository is not a folder: ???.', 'we expected a message about current error.');
    });

    it('should check for existence of mandatory #handler implementation', () => {
      var mc = migrate.init({
        config: './test/fixtures/configfile/.configErrorE'
      });
      assert(mc.initialized === false, 'we expected error config files with handler not found.');
      assert(mc.errorMessage === 'Configured handler is not found: ???.', 'we expected a message about current error.');
    });

    it('should check for save and load function on #handler implementation', () => {
      var mc = migrate.init({
        config: './test/fixtures/configfile/.configErrorF'
      });
      assert(mc.initialized === false, 'we expected error config files unimplemented handler.');
      assert(mc.errorMessage === 'Configured handler is not implemented: ???.', 'we expected a message about current error.');
    });
  });
});
