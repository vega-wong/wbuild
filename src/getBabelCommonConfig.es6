/**
 * babel默认配置
 * @module
 * @author vega <vegawong@126.com>
 **/
import { tmpdir } from 'os';

export default function babel() {
  return {
    cacheDirectory: tmpdir(),
    presets: [
      require.resolve('babel-preset-es2015-ie'),
      require.resolve('babel-preset-react'),
      require.resolve('babel-preset-stage-0'),
    ],
    plugins: [
      require.resolve('babel-plugin-add-module-exports'),
      require.resolve('babel-plugin-transform-decorators-legacy'),
      require.resolve('babel-plugin-transform-runtime')
    ],
  };
}
