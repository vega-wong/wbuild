/**
 * webpack 默认配置
 * @module
 * @author vega <vegawong@126.com>
 **/

import webpack from 'webpack';
import {
  existsSync
} from 'fs';
import {
  join
} from 'path';
import rucksack from 'rucksack-css';
import autoprefixer from 'autoprefixer';

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import getBabelCommonConfig from './getBabelCommonConfig';
import getTSCommonConfig from './getTSCommonConfig';


export default function getWebpackCommonConfig(args) {
  const pkgPath = join(args.cwd, 'package.json');
  const pkg = existsSync(pkgPath) ? require(pkgPath) : {};

  const jsFileName = args.hash ? '[name]-[chunkhash].js' : '[name].js';
  const cssFileName = args.hash ? '[name]-[chunkhash].css' : '[name].css';

  // babel配置
  const babelQuery = getBabelCommonConfig();
  // typescript配置
  const tsQuery = getTSCommonConfig();
  tsQuery.declaration = false;


  const emptyBuildins = [
    'child_process',
    'cluster',
    'dgram',
    'dns',
    'fs',
    'module',
    'net',
    'readline',
    'repl',
    'tls',
  ];

  const browser = pkg.browser || {};

  const node = emptyBuildins.reduce((obj, name) => {
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
      compilerOptions: tsQuery,
    },

    output: {
      path: join(process.cwd(), './dist/'),
      filename: jsFileName,
      chunkFilename: jsFileName,
      library: pkg.name,
      libraryTarget: pkg['output.libraryTarget'] || 'var'
    },

    devtool: args.devtool,

    resolve: {
      modulesDirectories: [join(process.cwd(), 'node_modules'), join(__dirname, '../node_modules')],
      extensions: ['', '.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.es6', '.js', '.jsx', '.json', '.coffee'],
    },

    resolveLoader: {
      // 优先在项目中寻找loader, 方便实时用上最新的loader
      modulesDirectories: [join(process.cwd(), 'node_modules'), join(__dirname, '../node_modules')],
      // modulesDirectories: ['node_modules', join(__dirname, '../../node_modules')],
    },

    entry: pkg.entry,

    node,

    module: {
      noParse: [/moment.js/],
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: babelQuery,
      }, {
        test: /\.es6$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: babelQuery,
      }, {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: babelQuery,
      }, {
        test: /\.tsx?$/,
        loaders: ['ts-loader'],
      }, {
        test: /\.coffee$/,
        loader: 'coffee-loader'
      }, {
        test(filePath) {
          return /\.css$/.test(filePath) && !/\.module\.css$/.test(filePath);
        },
        loader: ExtractTextPlugin.extract(
          'css-loader?sourceMap&-restructuring!' +
          'postcss-loader'
        ),
      }, {
        test: /\.module\.css$/,
        loader: ExtractTextPlugin.extract(
          'css-loader?sourceMap&-restructuring&modules&localIdentName=[local]___[hash:base64:5]!' +
          'postcss-loader'
        ),
      }, {
        test(filePath) {
          return /\.less$/.test(filePath) && !/\.module\.less$/.test(filePath);
        },
        loader: ExtractTextPlugin.extract(
          'css-loader?sourceMap!' +
          'postcss-loader!' +
          'less-loader?{"sourceMap":true}'
        ),
      }, {
        test: /\.module\.less$/,
        loader: ExtractTextPlugin.extract(
          'css-loader?sourceMap&modules&localIdentName=[local]___[hash:base64:5]!!' +
          'postcss-loader!' +
          'less-loader?{"sourceMap":true}'
        ),
      }, {
        test(filePath) {
          return /\.scss$/.test(filePath) && !/\.module\.scss$/.test(filePath);
        },
        loader: ExtractTextPlugin.extract(
          'css-loader?sourceMap!' +
          'postcss-loader!' +
          'sass-loader?sourceMap'
        ),
      }, {
        test: /\.module\.scss$/,
        loader: ExtractTextPlugin.extract(
          'css-loader?sourceMap&modules&localIdentName=[local]___[hash:base64:5]!!' +
          'postcss-loader!' +
          'sass-loader?sourceMap'
        ),
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
        test(filePath) {
          return /\.html$/.test(filePath) && !/\/tpl\/.*\.html$/.test(filePath);
        },
        loader: 'file?name=[name].[ext]',
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
      }
      ],
    },

    postcss: [
      rucksack(),
      autoprefixer({
        browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      }),
    ],

    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /ydj-f-lib$/),
      new ExtractTextPlugin(cssFileName, {
        disable: false,
        allChunks: true,
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
    ],
  };
}
