'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * colors log
                                                                                                                                                                                                     * @module
                                                                                                                                                                                                     * @author vega <vegawong@126.com>
                                                                                                                                                                                                     **/

/* eslint no-console: 0 */

var transMsg = function transMsg(type, msgs) {
  var arr = [];
  msgs.forEach(function (v) {
    arr.push(_colors2.default[type](v));
  });
  return arr;
};

exports.default = {
  debugObj: function debugObj(obj, debugName) {
    return (0, _debug2.default)(debugName)(_util2.default.inspect(obj, { showHidden: false, depth: null, colors: true }));
  },
  green: function green() {
    var _console;

    for (var _len = arguments.length, msgs = Array(_len), _key = 0; _key < _len; _key++) {
      msgs[_key] = arguments[_key];
    }

    return (_console = console).log.apply(_console, _toConsumableArray(transMsg('green', msgs)));
  },
  red: function red() {
    var _console2;

    for (var _len2 = arguments.length, msgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      msgs[_key2] = arguments[_key2];
    }

    return (_console2 = console).log.apply(_console2, _toConsumableArray(transMsg('red', msgs)));
  },
  blue: function blue() {
    var _console3;

    for (var _len3 = arguments.length, msgs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      msgs[_key3] = arguments[_key3];
    }

    return (_console3 = console).log.apply(_console3, _toConsumableArray(transMsg('blue', msgs)));
  },
  yellow: function yellow() {
    var _console4;

    for (var _len4 = arguments.length, msgs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      msgs[_key4] = arguments[_key4];
    }

    return (_console4 = console).log.apply(_console4, _toConsumableArray(transMsg('yellow', msgs)));
  }
};
module.exports = exports['default'];