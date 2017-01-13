'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWebpackConfig = undefined;
exports.default = build;

var _path = require('path');

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _cleanWebpackPlugin = require('clean-webpack-plugin');

var _cleanWebpackPlugin2 = _interopRequireDefault(_cleanWebpackPlugin);

var _assetsWebpackPlugin = require('assets-webpack-plugin');

var _assetsWebpackPlugin2 = _interopRequireDefault(_assetsWebpackPlugin);

var _imgAssetsWebpackPlugin = require('img-assets-webpack-plugin');

var _imgAssetsWebpackPlugin2 = _interopRequireDefault(_imgAssetsWebpackPlugin);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

var _mergeCustomConfig = require('./mergeCustomConfig');

var _mergeCustomConfig2 = _interopRequireDefault(_mergeCustomConfig);

var _getWebpackCommonConfig = require('./getWebpackCommonConfig');

var _getWebpackCommonConfig2 = _interopRequireDefault(_getWebpackCommonConfig);

var _utils = require('./utils');

var _tipsPlugin = require('./tipsPlugin');

var _tipsPlugin2 = _interopRequireDefault(_tipsPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint no-console: 0 */

function getWebpackConfig(args) {
  var webpackConfig = (0, _getWebpackCommonConfig2.default)(args);
  //  合并自定义配置文件
  webpackConfig = (0, _mergeCustomConfig2.default)(webpackConfig, (0, _path.resolve)(args.cwd, args.config || 'webpack.config.js'));
  webpackConfig.plugins = webpackConfig.plugins || [];

  // Config outputPath.
  if (args.outDir) {
    if ((0, _path.isAbsolute)(args.outDir)) {
      webpackConfig.output.path = args.outDir;
    } else {
      webpackConfig.output.path = (0, _path.join)(process.cwd(), args.outDir);
    }
  }

  if (args.publicPath) {
    webpackConfig.output.publicPath = args.publicPath;
  }

  // Config if no --no-compress.
  if (args.compress) {
    webpackConfig.UglifyJsPluginConfig = {
      output: {
        ascii_only: true
      },
      compress: {
        warnings: false
      }
    };
    webpackConfig.plugins = [].concat(_toConsumableArray(webpackConfig.plugins), [new _webpack2.default.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    })]);
    webpackConfig.plugins = (0, _utils.addOrReplacePlugin)(webpackConfig.plugins, new _webpack2.default.optimize.UglifyJsPlugin(webpackConfig.UglifyJsPluginConfig));
  } else if (process.env.NODE_ENV) {
    webpackConfig.plugins = [].concat(_toConsumableArray(webpackConfig.plugins), [new _webpack2.default.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })]);
  }

  if (args.vendor) {
    var name = typeof args.vendor === 'string' ? args.vendor : 'common';
    var commonName = args.hash ? name + '-[chunkhash].js' : name + '.js';
    webpackConfig.plugins = (0, _utils.addOrReplacePlugin)(webpackConfig.plugins, new _webpack2.default.optimize.CommonsChunkPlugin('common', commonName));
  }

  webpackConfig.plugins = (0, _utils.addOrReplacePlugin)(webpackConfig.plugins, new _webpack2.default.optimize.DedupePlugin());
  webpackConfig.plugins = (0, _utils.addOrReplacePlugin)(webpackConfig.plugins, new _webpack2.default.NoErrorsPlugin());

  // json
  if (args.json) {
    if (typeof args.json === 'string') {
      webpackConfig.plugins = (0, _utils.addOrReplacePlugin)(webpackConfig.plugins, new _assetsWebpackPlugin2.default({
        filename: args.json,
        path: args.cwd,
        prettyPrint: true
      }));
      webpackConfig.plugins = (0, _utils.addOrReplacePlugin)(webpackConfig.plugins, new _imgAssetsWebpackPlugin2.default());
    } else {
      webpackConfig.plugins = (0, _utils.addOrReplacePlugin)(webpackConfig.plugins, new _assetsWebpackPlugin2.default({
        filename: 'staticAssets.' + args.env + '.json',
        path: (0, _path.join)(args.cwd, 'assetsJson'),
        prettyPrint: true
      }));
      webpackConfig.plugins = (0, _utils.addOrReplacePlugin)(webpackConfig.plugins, new _imgAssetsWebpackPlugin2.default());
    }
  }
  return webpackConfig;
}

exports.getWebpackConfig = getWebpackConfig;
function build(args, callback) {
  _log2.default.debugObj(args, 'args');
  // Get config.
  var webpackConfig = getWebpackConfig(args);

  // clean
  if (args.clean && webpackConfig.output.path) {
    webpackConfig.plugins = (0, _utils.addOrReplacePlugin)(webpackConfig.plugins, new _cleanWebpackPlugin2.default([webpackConfig.output.path], {
      root: process.cwd(),
      verbose: true,
      dry: false
    }));
  }

  webpackConfig = Array.isArray(webpackConfig) ? webpackConfig : [webpackConfig];

  webpackConfig.forEach(function (v) {
    if (v.entry === {} || !v.entry) {
      _log2.default.red('webpack config entry field must be setted');
      process.exit(0);
    }
    v.plugins = (0, _utils.addOrReplacePlugin)(v.plugins, new _tipsPlugin2.default());
  });

  function doneHandler(err, stats) {
    var _stats$toJson = stats.toJson(),
        errors = _stats$toJson.errors;

    if (errors && errors.length) {
      process.on('exit', function () {
        process.exit(1);
      });
    }
    // if watch enabled only stats.hasErrors would log info
    // otherwise  would always log info
    if (!args.watch || stats.hasErrors()) {
      var buildInfo = stats.toString({
        colors: true,
        children: true,
        chunks: !!args.verbose,
        modules: !!args.verbose,
        chunkModules: !!args.verbose,
        hash: !!args.verbose,
        version: !!args.verbose
      });
      if (stats.hasErrors()) {
        console.error(buildInfo);
      } else {
        console.log(buildInfo);
      }
    }

    if (args.watch) {
      var _buildInfo = stats.toString({
        colors: true,
        children: true,
        chunks: !!args.verbose,
        modules: !!args.verbose,
        chunkModules: !!args.verbose,
        hash: !!args.verbose,
        version: !!args.verbose
      });
      if (stats.hasErrors()) {
        console.error(_buildInfo);
      } else {
        console.log(_buildInfo);
        _log2.default.yellow('webpack: bundle is now VALID.');
      }
    }

    if (err) {
      process.on('exit', function () {
        process.exit(1);
      });
      console.error(err);
    }

    if (callback) {
      callback(err);
    }
  }

  // Run compiler.
  _log2.default.debugObj(webpackConfig, 'config');
  var compiler = (0, _webpack2.default)(webpackConfig);

  // Hack: remove extract-text-webpack-plugin log
  if (!args.verbose) {
    compiler.plugin('done', function (stats) {
      stats.stats.forEach(function (stat) {
        stat.compilation.children = stat.compilation.children.filter(function (child) {
          // eslint-disable-line
          return child.name !== 'extract-text-webpack-plugin';
        });
      });
    });
  }

  if (args.watch) {
    compiler.watch(args.watch || 200, doneHandler);
  } else {
    compiler.run(doneHandler);
  }
}