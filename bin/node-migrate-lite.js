
var migrate = require('../dist').default;

/**
 * Arguments.
 */

var args = process.argv.slice(2);

/**
 * Option defaults.
 */

var options = {args: []};

/**
 * Usage information.
 */

var usage = [
  '',
  '  Usage: migrate [options] [command]',
  '',
  '  Commands:',
  '',
  '     create [title]   create a new migration file with given [title]',
  ''
].join('\n');

// abort with a message

function abort(msg) {
  console.error('  %s', msg);
  process.exit(1);
}

// parse arguments

var arg;
while (args.length) {
  arg = args.shift();
  switch (arg) {
    case '-h':
    case '--help':
    case 'help':
      console.log(usage);
      process.exit();
      break;
    default:
      if (options.command) {
        options.args.push(arg);
      } else {
        options.command = arg;
      }
  }
}

var commandCtrl = {
  '--create': {
    args: 1,
    execute: function (mig, args) {
      mig.create(args[0]);
    }
  }
};

if (commandCtrl[options.command].args !== options.args.length) {
  abort('Command ' + options.command + ' require ' + commandCtrl[options.command].args + ' but got ' + options.args.length + ': ' + options.args);
}

var mig = migrate.init({
  config: 'test/fixtures/configfile/.configA',
  handler: {
    load: function () {},
    save: function () {}
  }
});

if (mig.initialized === false) {
  abort(mig.errorMessage);
}

// Execute.
commandCtrl[options.command].execute(mig, options.args);
