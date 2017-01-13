'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ts;
/**
 * typescript 编译默认配置
 * @module
 * @author vega <vegawong@126.com>
 **/

// typescript compile config
function ts() {
  return {
    target: 'es5',
    jsx: 'preserve',
    moduleResolution: 'node',
    declaration: false,
    sourceMap: true
  };
}
module.exports = exports['default'];