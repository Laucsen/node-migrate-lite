import migrate from '../lib';

import {configFiles} from './fixtures/fixtures';

describe('error controll', () => {
  it('should return error when user callback with errors (a)', done => {
    var m = migrate.init({
      config: configFiles.SAMPLE_FILE_B,
      handler: {
        save: (migration, state, action, next) => {
          next();
        },
        load: next => {
          next(null);
        }
      }
    });

    expect(m.initialized).not.to.be.equal(false);

    m.up(err => {
      expect(err).not.to.be.equal(null);
      done();
    });
  });
  it('should return error when user callback with errors  (b)', done => {
    var m = migrate.init({
      config: configFiles.SAMPLE_FILE_C,
      handler: {
        save: (migration, state, action, next) => {
          next();
        },
        load: next => {
          next(null);
        }
      }
    });

    expect(m.initialized).not.to.be.equal(false);

    m.up(err => {
      expect(err).not.to.be.equal(null);
      done();
    });
  });
});
