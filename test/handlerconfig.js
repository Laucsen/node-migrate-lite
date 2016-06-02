import migrate from '../lib';

import {configFiles, handlers} from './fixtures/fixtures';

describe('state handler file', () => {
  it('should check for handler object and load/save function', () => {
    var m = migrate.init({
      config: configFiles.SAMPLE_FILE,
      handler: handlers.HANDLER_A
    });

    expect(m.initialized).not.to.be.equal(false);
  });

  it('should return error on missing handler', () => {
    var m = migrate.init({
      config: configFiles.SAMPLE_FILE
    });

    expect(m.errorMessage).to.be.equal('Missing Handler configuration.');
    expect(m.initialized).to.be.equal(false);
  });

  it('should return error handler without load/save function', () => {
    var m = migrate.init({
      config: configFiles.SAMPLE_FILE,
      handler: handlers.UNIMPLEMENTED_HANDLER
    });

    expect(m.errorMessage).to.be.equal('Missing save or load handler implementation.');
    expect(m.initialized).to.be.equal(false);
  });

  it('should return error handler functions are not a function', () => {
    var m = migrate.init({
      config: configFiles.SAMPLE_FILE,
      handler: handlers.HANDLER_AS_OBJECT
    });

    expect(m.errorMessage).to.be.equal('Missing save or load handler implementation.');
    expect(m.initialized).to.be.equal(false);
  });
});
