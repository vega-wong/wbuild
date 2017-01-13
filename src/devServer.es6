/* eslint no-underscore-dangle: 0 */
import webpack, {
  HotModuleReplacementPlugin
} from 'webpack';
import path from 'path';
import Dashbord from 'webpack-dashboard';
import DashbordPlugin from 'webpack-dashboard/plugin';
import OpenBrowserPlugin from 'open-browser-webpack-plugin';
import WDS from 'webpack-dev-server';
import colors from 'colors';


// import {exec} from 'child_process'

import {
  getWebpackConfig
} from './index';
import log from './log';
import { addOrReplacePlugin } from './utils';
import TipsPlugin from './tipsPlugin';


export default function start(args) {
  const port = args.port;
  args.compress = false; // 写死了不压缩 方便调试
  log.debugObj(args, 'args');
  let config = getWebpackConfig(args);
  config = Array.isArray(config) ? config[0] : config;
  if (config.entry === {} || !config.entry) {
    log.red('webpack config entry field must be setted');
    process.exit(0);
  }
  Object.keys(config.entry).forEach(v => {
    if (typeof config.entry[v] === 'string') {
      config.entry[v] = [`${path.join(path.dirname(require.resolve('webpack-dev-server')), '..')}/client?http://localhost:${port}`,
        `${path.dirname(require.resolve('build-html-webpack-plugin'))}/client?http://localhost:${port}`,
        `${path.join(path.dirname(require.resolve('webpack')), '..')}/hot/dev-server`, config.entry[v]];
    } else {
      config.entry[v] = [`${path.join(path.dirname(require.resolve('webpack-dev-server')), '..')}/client?http://localhost:${port}`,
        `${path.dirname(require.resolve('build-html-webpack-plugin'))}/client?http://localhost:${port}`,
        `${path.join(path.dirname(require.resolve('webpack')), '..')}/hot/dev-server`, ...config.entry[v]];
    }
  });


  config.plugins = addOrReplacePlugin(config.plugins, new HotModuleReplacementPlugin());

  if (args.autoOpen) {
    config.plugins = addOrReplacePlugin(config.plugins,
    new OpenBrowserPlugin({
      url: `http://localhost:${port}`
    }));
  }

  log.debugObj(config, 'config');
  const compiler = webpack(config);

  const wdsOptions = {
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
    staticOptions: {
    },

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
      const state = reporterOptions.state;
      const stats = reporterOptions.stats;
      const options = reporterOptions.options;
      if (state) {
        if (stats.hasErrors() || stats.hasWarnings()) {
          options.log(stats.toString(options.stats));
        }
        options.log(colors.yellow(`webpack: bundle is now VALID.  + ${stats.endTime - stats.startTime}ms`));
      } else {
        options.log(colors.yellow('webpack: bundle is now INVALID.'));
      }
    };
    compiler.apply(new TipsPlugin());
  } else {
    const dashboard = new Dashbord();
    compiler.apply(new DashbordPlugin(dashboard.setData));
  }

  const server = new WDS(compiler, wdsOptions);


  compiler._server = server;

  server.listen(port);
}
