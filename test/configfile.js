import fsExtra from 'fs-extra';

import migrate from '../lib';

import {configFiles, handlers} from './fixtures/fixtures';

describe('module initialization', () => {
  it('should be initialized with a custom file, on root folder of your project', () => {
    fsExtra.copySync(configFiles.SAMPLE_FILE, configFiles.ROOT_FILE);

    var m = migrate.init({
      handler: handlers.HANDLER_A
    });

    expect(m.initialized).not.to.be.equal(false);
    fsExtra.unlink(configFiles.ROOT_FILE);
  });

  it('should be initialized with a given custom file location', () => {
    var m = migrate.init({
      config: configFiles.SAMPLE_FILE,
      handler: handlers.HANDLER_A
    });
    expect(m.initialized).not.to.be.equal(false);
  });

  it('should fail when default config file is not found', () => {
    var m = migrate.init();
    expect(m.initialized).to.be.equal(false);
    expect(m.errorMessage).to.be.equal('Configuration file is not found: ' + configFiles.ROOT_FILE);
  });

  it('should fail when configured file is not found', () => {
    var m = migrate.init({
      config: configFiles.INEXISTENT_FILE
    });
    expect(m.initialized).to.be.equal(false);
    expect(m.errorMessage).to.be.equal('Configuration file is not found: ' + configFiles.INEXISTENT_FILE);
  });

  it('should fail on configuration with invalid data', () => {
    var m = migrate.init({
      config: configFiles.CORRUPT_FILE
    });
    expect(m.initialized).to.be.equal(false);
    expect(m.errorMessage).to.be.equal('Impossible to read file: ' + configFiles.CORRUPT_FILE);
  });

  it('should fail on configuration without migration #repository', () => {
    var m = migrate.init({
      config: configFiles.EMPTY_FILE
    });
    expect(m.initialized).to.be.equal(false);
    expect(m.errorMessage).to.be.equal('Configuration file has not a repository information.');
  });

  it('should check for mandatory existence migration folder, setted on config file', () => {
    var mc = migrate.init({
      config: configFiles.NO_MIGRATION_FOLDER
    });
    expect(mc.errorMessage).to.be.equal('Configured repository is not a folder: test/fixtures/fakefolderasd');
    expect(mc.initialized).to.be.equal(false);
  });

  it('should repository not to be a file', () => {
    var mc = migrate.init({
      config: configFiles.REPOSITORY_AS_FILE
    });
    expect(mc.errorMessage).to.be.equal('Configured repository is not a folder: test/fixtures/configfile/.configA');
    expect(mc.initialized).to.be.equal(false);
  });
});
