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

```js
Usage: migrate [command]

Commands:

  --create [name]       create a new migration file with given [name]
```

Note: All command that load and create migrations will use configured `repository` folder.

Created files are created with a time stamp, used to determine which time it was created.

## Programmatic usage

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
