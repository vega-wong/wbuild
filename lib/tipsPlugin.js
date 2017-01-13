'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TipsPlugin = function () {
  function TipsPlugin() {
    _classCallCheck(this, TipsPlugin);
  }

  TipsPlugin.prototype.apply = function apply(compiler) {
    compiler.plugin('compile', function () {
      _log2.default.yellow('webpack:  building...');
    });
  };

  return TipsPlugin;
}();

exports.default = TipsPlugin;
module.exports = exports['default'];