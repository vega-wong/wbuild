/**
 * colors log
 * @module
 * @author vega <vegawong@126.com>
 **/

/* eslint no-console: 0 */

import debug from 'debug';
import util from 'util';
import colors from 'colors';

const transMsg = (type, msgs) => {
  const arr = [];
  msgs.forEach(v => {
    arr.push(colors[type](v));
  });
  return arr;
};


export default {
  debugObj: (obj, debugName) => debug(debugName)(util.inspect(obj,
            { showHidden: false, depth: null, colors: true })),
  green: (...msgs) => console.log(...transMsg('green', msgs)),
  red: (...msgs) => console.log(...transMsg('red', msgs)),
  blue: (...msgs) => console.log(...transMsg('blue', msgs)),
  yellow: (...msgs) => console.log(...transMsg('yellow', msgs)),
};
