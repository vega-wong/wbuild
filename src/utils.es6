/* eslint no-proto: 0 */
/* eslint no-param-reassign: 0 */


export const hasPlugin = (plugins, PluginClass) => {
  let has = false;
  plugins.forEach(v => {
    if (v instanceof PluginClass) {
      has = true;
    }
  });
  return has;
};

export const addOrReplacePlugin = (plugins, item) => {
  let replace = false;
  plugins.forEach(v => {
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
