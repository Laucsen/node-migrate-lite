# node-migrate-lite [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Migrating your node application&#39;s database with simplicity.

This lib achieve to be simple. No fancy features, no complexity.

## Installation

Install globally to generate migrations wiht command line. 

```sh
$ npm install node-migrate-lite -g
```

And on your `package.json` to migrate your database programmatically.

```sh
$ npm install node-migrate-lite --save
```

## Configuration

Node Migrate Lite uses a config file on your root folder with data about where you want to store your migrations. 

Create a `.nmlite` file on your root folder with:

```
{
  "repository": "path/to/yout/migration/directory"
}
```

Note that all your migration will be created there and will be loaded from there.

## Usage

First of all, you have to start to create migrations. By installing this library globally, you can do it with following commands:

```js
Usage: migrate-lite [command]

Commands:

  --create [name]       create a new migration file with given [name]
```

> All command that load and create migrations will use configured `repository` folder.

> Created files are created with a time stamp, used to determine which time it was created.

## Programmatic usage

Now it is time to include this library to your code and start to migrating dta into your database. Do it following this snippet:

```
import nodeMigrate from 'node-migrate-lite';

var m = migrate.v({
  // You must configure a handler object. Save and Load function are used by node-migrate-lite to tell you data that must be saved and loaded. This will give to you autonomy to save this where you want, file or datavase.
  handler: {
    save: (migration, state, action, next) => {
      // migration - Data about current migration file.
      // state - Data about current database state.
      // aciond - added to up operation and removed to down.
      next();
    },
    load: next => {
      var yourData = [...];
      // yourData - An array of saved migrations, like state on save handler.
      // The first time, you can pass an empty array. Later, you can get this array from save operation and save somewhere.
      // Next time, you will get this saved array and pass on next() as paramether to node-migration-library.
      next(yourData);
    }
  }
});
```


### Handlers

To achieve simplicity and to be agnostic to database types and libraries, this library initialization demand an implementation for two handlers: one to load Schema State about your database and other to save.

The main idea of this approach, is to left to library user the control of database schema state, so you can save it anywhere: File, NoSql Database, Sql Database, Redis...

#### Save

This handler is called by node-migrate-te engine every time he execute a migration with success. Your handler function can use three set of data, lie this:

```
save: (migration, state, action, next) => {
  next();
},
```

This this case, you can use `migration`, `state` and `action` to choose how to store current migration data and `next` to tell node-migrate-lite engine to continue its work.

* **migration** - Current executed migration.
* **state** - Current state. It is an Array with all migrations that have been executed (up) on your database. Ot means that removed (down) migrations will not be on this array.
* **action** - Tells if current `migration` was `added` or `removed`.
* **next** - Callback to return to node-migrate-lite process.

#### Load

This handler is called by node-migrate-engine on the beginning of the process asking by the current schema state. Your handler function must return an array of data, the same as passed on save handler on a latter time.
    
## Migration File

Every time you call `migrate-lite --create something` to create a migration, a default file will be create on your repository folder like this:

```
'use strict';

exports.up = function (next) {
  next();
};

exports.down = function (next) {
  next();
};

```

On this file, to each data you want to migrate, you must insert the commands (based on your database type) to add data on `up` and commands to remove this same data on `down`. 

> The net function is important if you want to use asynchronous events on migration. You do your job, then call next.

For example, if you want to create a migration to add persons to your database:

``` sh
$ migrate-lite create add-person
```

Then, go to created 1414323423423-add-person.js and do:

```
var db = require('./db');

exports.up = function(next){
  db.add('person', 'tobi');
  db.add('person', 'loki');
  db.add('person', 'jane');
  next();
};

exports.down = function(next){
  db.remove('person', 'tobi');
  db.remove('person', 'loki');
  db.remove('person', 'jane');
  next();
};
```

### Errors

You can return an error thought next function to tell node-migrate-lite engine that an error has occurred and the migration proccess must stop.

```
exports.up = function (next) {
  next(new Error('Some important Error!'));
};
```

### Error control and Rollback

Every time you send an error or and error is thrown on `up` process, node-migrate-lite library will try to rollback every migration on last operation, by calling `down` of each one.

For example, if you have 10 migration and will ad more 8, and something happen on forth, all this 4 migration swill be rollback'ed, left only initial 10 migrations active.

This is useful to keep your database on same state if something going wrong.

## API

### migrate.init(options)

Configure and return a `Migrate` object.

`options.handler` - Required object with implementation of `save` and `load` handlers.

### Migrate.up(callback)

Migrate up all not migrated `migrations`. Function `callback` is called at the end of process with a possible error.

### Migrate.down(callback)

Migrate down all already migrated `migrations`. Function `callback` is called at the end of process with a possible error.

## Changelog

#### 0.1.0
- Default tasks: `up` and `down`.
- Command line to create new migrations on your configured repository.

#### 0.2.0
- Roll back capability. Call `down` of migrations on error.

## License

MIT © [Diego Laucsen](www.laucsen.com)


[npm-image]: https://badge.fury.io/js/node-migrate-lite.svg
[npm-url]: https://npmjs.org/package/node-migrate-lite
[travis-image]: https://travis-ci.org/Laucsen/node-migrate-lite.svg?branch=master
[travis-url]: https://travis-ci.org/Laucsen/node-migrate-lite
[daviddm-image]: https://david-dm.org/Laucsen/node-migrate-lite.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Laucsen/node-migrate-lite
[coveralls-image]: https://coveralls.io/repos/Laucsen/node-migrate-lite/badge.svg
[coveralls-url]: https://coveralls.io/r/Laucsen/node-migrate-lite
