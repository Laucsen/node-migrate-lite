import migrate from '../lib';

import {configFiles} from './fixtures/fixtures';

import * as DB from './fixtures/db';

describe('execute migrations', () => {
  it('should handler load function to be called on up', done => {
    var saved;

    var m = migrate.init({
      config: configFiles.SAMPLE_FILE,
      handler: {
        save: (migration, state, next) => {
          saved = state;
          next();
        },
        load: next => {
          next(null);
        }
      }
    });

    expect(m.initialized).not.to.be.equal(false);

    m.up(err => {
      expect(err).to.be.equal(null);

      // EXPECT FAKE DB TO HAS MIGRATED DATA.
      expect(DB.DB.Document.length).to.be.equal(2);
      expect(DB.DB.File.length).to.be.equal(1);
      expect(DB.DB.Document[0].owner).to.be.equal('albert einstein');

      // EXPECT SAVE TO HAVE DB SCHEMA
      expect(saved).not.to.be.equal(undefined);
      expect(saved.length).to.be.equal(3);

      done();
    });
  });
});
