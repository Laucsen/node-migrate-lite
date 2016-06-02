import migrate from '../lib';

import {configFiles} from './fixtures/fixtures';

import * as DB from './fixtures/db';

describe('execute migrations', () => {
  beforeEach(() => {
    DB.clear();
  });

  it('should migrate all migrations', done => {
    var saved;

    var m = migrate.init({
      config: configFiles.SAMPLE_FILE,
      handler: {
        save: (migration, state, action, next) => {
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

  it('should call only not saved migrations', done => {
    var saved;

    var m = migrate.init({
      config: configFiles.SAMPLE_FILE,
      handler: {
        save: (migration, state, action, next) => {
          saved = state;
          next();
        },
        load: next => {
          next([{
            timestamp: '1000000000010',
            migration: 'Add-Files'
          }]);
        }
      }
    });

    expect(m.initialized).not.to.be.equal(false);

    m.up(err => {
      expect(err).to.be.equal(null);

      // EXPECT FAKE DB TO HAS MIGRATED DATA.
      expect(DB.DB.Document.length).to.be.equal(2);
      expect(DB.DB.File).to.be.equal(undefined);
      expect(DB.DB.Document[0].owner).to.be.equal('albert einstein');

      // EXPECT SAVE TO HAVE DB SCHEMA
      expect(saved).not.to.be.equal(undefined);
      expect(saved.length).to.be.equal(3);

      done();
    });
  });
});
