'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = start;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpackDashboard = require('webpack-dashboard');

var _webpackDashboard2 = _interopRequireDefault(_webpackDashboard);

var _plugin = require('webpack-dashboard/plugin');

var _plugin2 = _interopRequireDefault(_plugin);

var _openBrowserWebpackPlugin = require('open-browser-webpack-plugin');

var _openBrowserWebpackPlugin2 = _interopRequireDefault(_openBrowserWebpackPlugin);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _index = require('./index');

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

var _utils = require('./utils');

var _tipsPlugin = require('./tipsPlugin');

var _tipsPlugin2 = _interopRequireDefault(_tipsPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint no-underscore-dangle: 0 */


// import {exec} from 'child_process'

function start(args) {
  var port = args.port;
  args.compress = false; // 写死了不压缩 方便调试
  _log2.default.debugObj(args, 'args');
  var config = (0, _index.getWebpackConfig)(args);
  config = Array.isArray(config) ? config[0] : config;
  if (config.entry === {} || !config.entry) {
    _log2.default.red('webpack config entry field must be setted');
    process.exit(0);
  }
  Object.keys(config.entry).forEach(function (v) {
    if (typeof config.entry[v] === 'string') {
      config.entry[v] = [_path2.default.join(_path2.default.dirname(require.resolve('webpack-dev-server')), '..') + '/client?http://localhost:' + port, _path2.default.dirname(require.resolve('build-html-webpack-plugin')) + '/client?http://localhost:' + port, _path2.default.join(_path2.default.dirname(require.resolve('webpack')), '..') + '/hot/dev-server', config.entry[v]];
    } else {
      config.entry[v] = [_path2.default.join(_path2.default.dirname(require.resolve('webpack-dev-server')), '..') + '/client?http://localhost:' + port, _path2.default.dirname(require.resolve('build-html-webpack-plugin')) + '/client?http://localhost:' + port, _path2.default.join(_path2.default.dirname(require.resolve('webpack')), '..') + '/hot/dev-server'].concat(_toConsumableArray(config.entry[v]));
    }
  });

  config.plugins = (0, _utils.addOrReplacePlugin)(config.plugins, new _webpack.HotModuleReplacementPlugin());

  if (args.autoOpen) {
    config.plugins = (0, _utils.addOrReplacePlugin)(config.plugins, new _openBrowserWebpackPlugin2.default({
      url: 'http://localhost:' + port
    }));
  }

  _log2.default.debugObj(config, 'config');
  var compiler = (0, _webpack2.default)(config);

  var wdsOptions = {
    // webpack-dev-server options

    contentBase: process.cwd(),
    // Can also be an array, or: contentBase: "http://localhost/",

    hot: true,
    // Enable special support for Hot Module Replacement
    // Page is no longer updated, but a "webpackHotUpdate" message is sent to the content
    // Use "webpack/hot/dev-server" as additional module in your entry point
    // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

    historyApiFallback: false,
    // Set this as true if you want to access dev server from arbitrary url.
    // This is handy if you are using a html5 router.

    // compress: true,
    // Set this if you want to enable gzip compression for assets

    // proxy: {
    //   "**": "http://localhost:9090"
    // },
    // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
    // Use "**" to proxy all paths to the specified server.
    // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
    // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).

    // setup: function (app) {
    // Here you can access the Express app object and add your own custom middleware to it.
    // For example, to define custom handlers for some paths:
    // app.get('/some/path', function(req, res) {
    //   res.json({ custom: 'response' });
    // });
    // },

    // pass [static options](http://expressjs.com/en/4x/api.html#express.static) to inner express server
    staticOptions: {},

    clientLogLevel: 'info',
    // Control the console log messages shown in the browser when using inline mode.
    // Can be `error`, `warning`, `info` or `none`.
    // webpack-dev-middleware options
    quiet: true,
    noInfo: true,
    lazy: false,
    // filename: "bundle.js",
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    // It's a required option.
    publicPath: config.output.publicPath,
    headers: { 'X-Custom-Header': 'yes' },
    stats: { colors: true }
  };

  // no-dashboard
  if (args.noDash) {
    // wdsOptions.quiet = false;
    // wdsOptions.noInfo = true;
    wdsOptions.reporter = function (reporterOptions) {
      var state = reporterOptions.state;
      var stats = reporterOptions.stats;
      var options = reporterOptions.options;
      if (state) {
        if (stats.hasErrors() || stats.hasWarnings()) {
          options.log(stats.toString(options.stats));
        }
        options.log(_colors2.default.yellow('webpack: bundle is now VALID.  + ' + (stats.endTime - stats.startTime) + 'ms'));
      } else {
        options.log(_colors2.default.yellow('webpack: bundle is now INVALID.'));
      }
    };
    compiler.apply(new _tipsPlugin2.default());
  } else {
    var dashboard = new _webpackDashboard2.default();
    compiler.apply(new _plugin2.default(dashboard.setData));
  }

  var server = new _webpackDevServer2.default(compiler, wdsOptions);

  compiler._server = server;

  server.listen(port);
}
module.exports = exports['default'];