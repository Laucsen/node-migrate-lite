import migrate from '../../lib';

import {configFiles, handlers} from '../fixtures/fixtures';

describe('node-migration-lite', () => {
  describe.only('command: create', () => {
    it('should create a file on repository location with given name and time stamp', () => {
      var m = migrate.init({
        config: configFiles.SAMPLE_FILE,
        handler: handlers.HANDLER_A
      });
      expect(m.initialized).not.to.be.equal(false);

      m.create('Add-Pets');
    });
  });
});
