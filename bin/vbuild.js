#!/usr/bin/env node

var yargs = require('yargs');
var build = require('../lib/');

const argv = yargs
  .usage('Usage: vbuild [options]')
  .option('watch', {
    alias: 'w',
    describe: 'watch the source file changed \n USAGE: --watch [true/false]',
    type: 'boolen',
    default: false
  })
  .option('hash', {
    describe: 'rename the bundle file with hash \n USAGE: --hash [true/false]',
    default: false
  })
  .option('outDir', {
    alias: 'o',
    type: 'string',
    describe: 'set the path that the bundle file build into, default as the webpack config file setting filed \"output.path\" \n USAGE: --outDir <path>',
  })
  .option('publicPath', {
    alias: 'P',
    describe: 'set the webpack\'s publicPath field default as the webpack config setting \n USAGE: --publicPath <path>',
    type: 'string'
  })
  .option('devtool', {
    alias: 'd',
    describe: 'set the source-map type for webpack \n USAGE: --devtool <source-map-type>',
    type: 'string'
  })
  .option('config', {
    alias: 'c',
    describe: 'spec the config file path \n USAGE: --config <configPath>',
    type: 'string'
  })
  .option('json', {
    describe: 'generate the bundle stats to a json file \n USAGE: --json [true/fileName]>',
    default: false
  })
  .option('verbose', {
    describe: 'run with more build result message. \n USAGE: --verbose [true/false]',
    default: false,
    type: 'boolen'
  })
  .option('clean', {
    describe: 'clean the outputPath before build \n USAGE: --clean [true/false]',
    default: false,
    type: 'boolen'
  })
  .option('compress', {
    describe: 'optimize the bundle file \n USAGE: --compress [true/fase]',
    default: false,
    type: 'boolen'
  })
  .option('vendor', {
    describe: 'set the common chunks name \n USAGE: --vendor [true/commonName]',
    default: false
  })
  .version(function() {
    return 'v1.1.1'
  })
  .alias('version', 'v')
  .help()
  .alias('help', 'h')
  .argv;

// console.log(argv);
argv.cwd = process.cwd();
build.default(argv);
