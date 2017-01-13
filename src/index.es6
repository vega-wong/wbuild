/* eslint no-console: 0 */

import {
  join,
  resolve,
  isAbsolute
} from 'path';
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import ImgAssetsPlugin from 'img-assets-webpack-plugin';
import log from './log';
import mergeCustomConfig from './mergeCustomConfig';
import getWebpackCommonConfig from './getWebpackCommonConfig';
import { addOrReplacePlugin } from './utils';
import TipsPlugin from './tipsPlugin';


function getWebpackConfig(args) {
  let webpackConfig = getWebpackCommonConfig(args);
  //  合并自定义配置文件
  webpackConfig = mergeCustomConfig(webpackConfig, resolve(args.cwd, args.config || 'webpack.config.js'));
  webpackConfig.plugins = webpackConfig.plugins || [];

  // Config outputPath.
  if (args.outDir) {
    if (isAbsolute(args.outDir)) {
      webpackConfig.output.path = args.outDir;
    } else {
      webpackConfig.output.path = join(process.cwd(), args.outDir);
    }
  }

  if (args.publicPath) {
    webpackConfig.output.publicPath = args.publicPath;
  }

  // Config if no --no-compress.
  if (args.compress) {
    webpackConfig.UglifyJsPluginConfig = {
      output: {
        ascii_only: true,
      },
      compress: {
        warnings: false,
      },
    };
    webpackConfig.plugins = [...webpackConfig.plugins,
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      }),
    ];
    webpackConfig.plugins = addOrReplacePlugin(webpackConfig.plugins,
      new webpack.optimize.UglifyJsPlugin(webpackConfig.UglifyJsPluginConfig));
  } else if (process.env.NODE_ENV) {
    webpackConfig.plugins = [...webpackConfig.plugins,
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
    ];
  }

  if (args.vendor) {
    const name = typeof args.vendor === 'string' ? args.vendor : 'common';
    const commonName = args.hash ? `${name}-[chunkhash].js` : `${name}.js`;
    webpackConfig.plugins = addOrReplacePlugin(webpackConfig.plugins,
    new webpack.optimize.CommonsChunkPlugin('common', commonName));
  }

  webpackConfig.plugins = addOrReplacePlugin(webpackConfig.plugins,
    new webpack.optimize.DedupePlugin());
  webpackConfig.plugins = addOrReplacePlugin(webpackConfig.plugins, new webpack.NoErrorsPlugin());

  // json
  if (args.json) {
    if (typeof args.json === 'string') {
      webpackConfig.plugins = addOrReplacePlugin(webpackConfig.plugins, new AssetsPlugin({
        filename: args.json,
        path: args.cwd,
        prettyPrint: true
      }));
      webpackConfig.plugins = addOrReplacePlugin(webpackConfig.plugins, new ImgAssetsPlugin());
    } else {
      webpackConfig.plugins = addOrReplacePlugin(webpackConfig.plugins, new AssetsPlugin({
        filename: `staticAssets.${args.env}.json`,
        path: join(args.cwd, 'assetsJson'),
        prettyPrint: true
      }));
      webpackConfig.plugins = addOrReplacePlugin(webpackConfig.plugins, new ImgAssetsPlugin());
    }
  }
  return webpackConfig;
}

export {
  getWebpackConfig
};


export default function build(args, callback) {
  log.debugObj(args, 'args');
  // Get config.
  let webpackConfig = getWebpackConfig(args);

   // clean
  if (args.clean && webpackConfig.output.path) {
    webpackConfig.plugins = addOrReplacePlugin(webpackConfig.plugins,
      new CleanWebpackPlugin([webpackConfig.output.path], {
        root: process.cwd(),
        verbose: true,
        dry: false,
      }));
  }


  webpackConfig = Array.isArray(webpackConfig) ? webpackConfig : [webpackConfig];

  webpackConfig.forEach(v => {
    if (v.entry === {} || !v.entry) {
      log.red('webpack config entry field must be setted');
      process.exit(0);
    }
    v.plugins = addOrReplacePlugin(v.plugins, new TipsPlugin());
  });

  function doneHandler(err, stats) {
    const {
      errors
    } = stats.toJson();
    if (errors && errors.length) {
      process.on('exit', () => {
        process.exit(1);
      });
    }
    // if watch enabled only stats.hasErrors would log info
    // otherwise  would always log info
    if (!args.watch || stats.hasErrors()) {
      const buildInfo = stats.toString({
        colors: true,
        children: true,
        chunks: !!args.verbose,
        modules: !!args.verbose,
        chunkModules: !!args.verbose,
        hash: !!args.verbose,
        version: !!args.verbose,
      });
      if (stats.hasErrors()) {
        console.error(buildInfo);
      } else {
        console.log(buildInfo);
      }
    }

    if (args.watch) {
      const buildInfo = stats.toString({
        colors: true,
        children: true,
        chunks: !!args.verbose,
        modules: !!args.verbose,
        chunkModules: !!args.verbose,
        hash: !!args.verbose,
        version: !!args.verbose,
      });
      if (stats.hasErrors()) {
        console.error(buildInfo);
      } else {
        console.log(buildInfo);
        log.yellow('webpack: bundle is now VALID.');
      }
    }

    if (err) {
      process.on('exit', () => {
        process.exit(1);
      });
      console.error(err);
    }

    if (callback) {
      callback(err);
    }
  }


  // Run compiler.
  log.debugObj(webpackConfig, 'config');
  const compiler = webpack(webpackConfig);

  // Hack: remove extract-text-webpack-plugin log
  if (!args.verbose) {
    compiler.plugin('done', stats => {
      stats.stats.forEach(stat => {
        stat.compilation.children =
        stat.compilation.children.filter((child) => { // eslint-disable-line
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

