import migrate from '../lib';

import {configFiles} from './fixtures/fixtures';

import * as DB from './fixtures/db';

var migrations;
var saved;

describe('error control advanced', () => {
  describe('with informed errors', () => {
    describe('whitout data', () => {
      it('should return error when user callback with errors and downgrade all applied migrations', done => {
        saved = undefined;
        DB.clear();
        migrations = migrate.init({
          config: configFiles.SAMPLE_FILE_D,
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
        migrations.up(err => {
          counter++;

          expect(err).not.to.be.equal(null);
          expect(saved).to.have.lengthOf(0);
          expect(DB.DB.Document).to.have.lengthOf(0);
          expect(counter).to.be.equal(1);
          done();
        });
      });
    });

    describe('with data', () => {
      before(done => {
        DB.clear();
        DB.data('Document').create([{
          name: 'james.doc',
          owner: 'james'
        }, {
          name: 'ritalia.doc',
          owner: 'dr ray'
        }], done);
      });
      it('should return error when user callback with errors and downgrade all applied migrations', done => {
        saved = [{
          timestamp: '1000000000000',
          migration: 'Add-Document'
        }];

        migrations = migrate.init({
          config: configFiles.SAMPLE_FILE_D,
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
        migrations.up(err => {
          counter++;

          expect(err).not.to.be.equal(null);
          expect(saved).to.have.lengthOf(1);
          expect(DB.DB.Document).to.have.lengthOf(2);
          expect(counter).to.be.equal(1);
          done();
        });
      });

      it('should just ignore error on down when error is informed on down operation', done => {
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

        migrations = migrate.init({
          config: configFiles.SAMPLE_FILE_G,
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
        migrations.down(err => {
          counter++;

          expect(err).not.to.be.equal(null);
          expect(counter).to.be.equal(1);
          done();
        });
      });
    });
  });

  describe('with exceptions', () => {
    describe('whitout data', () => {
      it('should return error when user callback with errors and downgrade all applied migrations on throw', done => {
        saved = undefined;
        DB.clear();
        migrations = migrate.init({
          config: configFiles.SAMPLE_FILE_E,
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
        migrations.up(err => {
          counter++;

          expect(err).not.to.be.equal(null);
          expect(saved).to.have.lengthOf(0);
          expect(DB.DB.Document).to.have.lengthOf(0);
          expect(counter).to.be.equal(1);
          done();
        });
      });
    });

    describe('with data', () => {
      before(done => {
        saved = [{
          timestamp: '1000000000000',
          migration: 'Add-Document'
        }];
        DB.clear();
        DB.data('Document').create([{
          name: 'james.doc',
          owner: 'james'
        }, {
          name: 'ritalia.doc',
          owner: 'dr ray'
        }], done);
      });
      it('should return error when user callback with errors and downgrade all applied migrations  on throw', done => {
        migrations = migrate.init({
          config: configFiles.SAMPLE_FILE_E,
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
        migrations.up(err => {
          counter++;

          expect(err).not.to.be.equal(null);
          expect(saved).to.have.lengthOf(1);
          expect(DB.DB.Document).to.have.lengthOf(2);
          expect(counter).to.be.equal(1);
          done();
        });
      });
    });

    describe('without data on down', () => {
      it('should just ignore error on down when error iw thrown on down operation', done => {
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
        migrations.down(err => {
          counter++;

          expect(err).not.to.be.equal(null);
          expect(counter).to.be.equal(1);
          done();
        });
      });
    });
  });
});
