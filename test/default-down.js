import migrate from '../lib';

import {configFiles} from './fixtures/fixtures';

import * as DB from './fixtures/db';

var saved;

describe('execute migrations - down', () => {
  beforeEach(done => {
    DB.clear();
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
    m.up(() => {
      done();
    });
  });

  it('should down all migrations', done => {
    var m = migrate.init({
      config: configFiles.SAMPLE_FILE,
      handler: {
        save: (migration, state, action, next) => {
          saved = state;
          next();
        },
        load: next => {
          next(saved);
        }
      }
    });

    expect(m.initialized).not.to.be.equal(false);

    m.down(err => {
      expect(err).to.be.equal(null);

      // EXPECT FAKE DB TO HAS MIGRATED DATA.
      expect(DB.DB.Document.length).to.be.equal(0);
      expect(DB.DB.File.length).to.be.equal(0);

      // EXPECT SAVE TO HAVE DB SCHEMA
      expect(saved).not.to.be.equal(undefined);
      expect(saved.length).to.be.equal(0);

      done();
    });
  });

  it('should call down only saved migrations', done => {
    saved.splice(0, 2);

    var m = migrate.init({
      config: configFiles.SAMPLE_FILE,
      handler: {
        save: (migration, state, action, next) => {
          saved = state;
          next();
        },
        load: next => {
          next(saved);
        }
      }
    });

    expect(m.initialized).not.to.be.equal(false);

    m.down(err => {
      expect(err).to.be.equal(null);

      expect(DB.DB.Document[0].owner).to.be.equal('james');

      // EXPECT FAKE DB TO HAS MIGRATED DATA.
      expect(DB.DB.Document.length).to.be.equal(2);
      expect(DB.DB.File.length).to.be.equal(1);

      // EXPECT SAVE TO HAVE DB SCHEMA
      expect(saved).not.to.be.equal(undefined);
      expect(saved.length).to.be.equal(0);

      done();
    });
  });
});
