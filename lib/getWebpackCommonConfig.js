'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getWebpackCommonConfig;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _fs = require('fs');

var _path = require('path');

var _rucksackCss = require('rucksack-css');

var _rucksackCss2 = _interopRequireDefault(_rucksackCss);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _getBabelCommonConfig = require('./getBabelCommonConfig');

var _getBabelCommonConfig2 = _interopRequireDefault(_getBabelCommonConfig);

var _getTSCommonConfig = require('./getTSCommonConfig');

var _getTSCommonConfig2 = _interopRequireDefault(_getTSCommonConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * webpack 默认配置
 * @module
 * @author vega <vegawong@126.com>
 **/

function getWebpackCommonConfig(args) {
  var pkgPath = (0, _path.join)(args.cwd, 'package.json');
  var pkg = (0, _fs.existsSync)(pkgPath) ? require(pkgPath) : {};

  var jsFileName = args.hash ? '[name]-[chunkhash].js' : '[name].js';
  var cssFileName = args.hash ? '[name]-[chunkhash].css' : '[name].css';

  // babel配置
  var babelQuery = (0, _getBabelCommonConfig2.default)();
  // typescript配置
  var tsQuery = (0, _getTSCommonConfig2.default)();
  tsQuery.declaration = false;

  var emptyBuildins = ['child_process', 'cluster', 'dgram', 'dns', 'fs', 'module', 'net', 'readline', 'repl', 'tls'];

  var browser = pkg.browser || {};

  var node = emptyBuildins.reduce(function (obj, name) {
    if (!(name in browser)) {
      obj[name] = 'empty';
      return obj;
    }
    return obj;
  }, {});

  return {

    babel: babelQuery,
    ts: {
      transpileOnly: true,
      compilerOptions: tsQuery
    },

    output: {
      path: (0, _path.join)(process.cwd(), './dist/'),
      filename: jsFileName,
      chunkFilename: jsFileName
    },

    devtool: args.devtool,

    resolve: {
      modulesDirectories: [(0, _path.join)(process.cwd(), 'node_modules'), (0, _path.join)(__dirname, '../node_modules')],
      extensions: ['', '.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.es6', '.js', '.jsx', '.json', '.coffee']
    },

    resolveLoader: {
      // 优先在项目中寻找loader, 方便实时用上最新的loader
      modulesDirectories: [(0, _path.join)(process.cwd(), 'node_modules'), (0, _path.join)(__dirname, '../node_modules')]
    },

    entry: pkg.entry,

    node: node,

    module: {
      noParse: [/moment.js/],
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: babelQuery
      }, {
        test: /\.es6$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: babelQuery
      }, {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: babelQuery
      }, {
        test: /\.tsx?$/,
        loaders: ['ts-loader']
      }, {
        test: /\.coffee$/,
        loader: 'coffee-loader'
      }, {
        test: function test(filePath) {
          return (/\.css$/.test(filePath) && !/\.module\.css$/.test(filePath)
          );
        },

        loader: _extractTextWebpackPlugin2.default.extract('css-loader?sourceMap&-restructuring!' + 'postcss-loader')
      }, {
        test: /\.module\.css$/,
        loader: _extractTextWebpackPlugin2.default.extract('css-loader?sourceMap&-restructuring&modules&localIdentName=[local]___[hash:base64:5]!' + 'postcss-loader')
      }, {
        test: function test(filePath) {
          return (/\.less$/.test(filePath) && !/\.module\.less$/.test(filePath)
          );
        },

        loader: _extractTextWebpackPlugin2.default.extract('css-loader?sourceMap!' + 'postcss-loader!' + 'less-loader?{"sourceMap":true}')
      }, {
        test: /\.module\.less$/,
        loader: _extractTextWebpackPlugin2.default.extract('css-loader?sourceMap&modules&localIdentName=[local]___[hash:base64:5]!!' + 'postcss-loader!' + 'less-loader?{"sourceMap":true}')
      }, {
        test: function test(filePath) {
          return (/\.scss$/.test(filePath) && !/\.module\.scss$/.test(filePath)
          );
        },

        loader: _extractTextWebpackPlugin2.default.extract('css-loader?sourceMap!' + 'postcss-loader!' + 'sass-loader?sourceMap')
      }, {
        test: /\.module\.scss$/,
        loader: _extractTextWebpackPlugin2.default.extract('css-loader?sourceMap&modules&localIdentName=[local]___[hash:base64:5]!!' + 'postcss-loader!' + 'sass-loader?sourceMap')
      }, {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/octet-stream'
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=image/svg+xml'
      }, {
        test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
        loader: 'url-loader?limit=10000'
      }, {
        test: /\.json$/,
        loader: 'json'
      }, {
        test: function test(filePath) {
          return (/\.html$/.test(filePath) && !/\/tpl\/.*\.html$/.test(filePath)
          );
        },

        loader: 'file?name=[name].[ext]'
      }, {
        test: /\/tpl\/.*\.html$/,
        loader: 'mcore3/dist/h2svd-loader',
        query: {
          moduleName: 'mcore'
        }
      }, {
        test: /\.tpl$/,
        // loader: join(__dirname, '../../node_modules/mcore3/dist/h2svd-loader.js'),
        loader: 'mcore3/dist/h2svd-loader',
        query: {
          moduleName: 'mcore'
        }
      }]
    },

    postcss: [(0, _rucksackCss2.default)(), (0, _autoprefixer2.default)({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
    })],

    plugins: [new _webpack2.default.IgnorePlugin(/^\.\/locale$/, /ydj-f-lib$/), new _extractTextWebpackPlugin2.default(cssFileName, {
      disable: false,
      allChunks: true
    }), new _webpack2.default.optimize.OccurenceOrderPlugin()]
  };
}
module.exports = exports['default'];