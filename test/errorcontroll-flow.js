import migrate from '../lib';

import {configFiles} from './fixtures/fixtures';

import * as DB from './fixtures/db';

var migrations;
var saved;

describe('error flow control', () => {
  describe('with exceptions', () => {
    it('should just ignore error on down', done => {
      saved = [{
        timestamp: '1000000000000',
        migration: 'Add-Document'
      }, {
        timestamp: '1000000000005',
        migration: 'Add-Other-Document'
      }, {
        timestamp: '1000000000010',
        migration: 'Add-Files'
      }, {
        timestamp: '1000000000100',
        migration: 'Change-Document'
      }];
      DB.clear();
      migrations = migrate.init({
        config: configFiles.SAMPLE_FILE_F,
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
      expect(migrations.initialized).not.to.be.equal(false);

      var counter = 0;
      migrations.down(() => {
        counter++;

        if (counter === 1) {
          throw new Error('Some strange Error!');
        }
      });

      expect(counter).to.be.equal(1);
      done();
    });
  });
});
