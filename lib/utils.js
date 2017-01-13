"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint no-proto: 0 */
/* eslint no-param-reassign: 0 */

var hasPlugin = exports.hasPlugin = function hasPlugin(plugins, PluginClass) {
  var has = false;
  plugins.forEach(function (v) {
    if (v instanceof PluginClass) {
      has = true;
    }
  });
  return has;
};

var addOrReplacePlugin = exports.addOrReplacePlugin = function addOrReplacePlugin(plugins, item) {
  var replace = false;
  plugins.forEach(function (v) {
    if (v.__proto__ === item.__proto__) {
      v = item;
      replace = true;
    }
  });
  if (!replace) {
    plugins.push(item);
  }
  return plugins;
};