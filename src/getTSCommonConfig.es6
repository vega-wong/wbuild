/**
 * typescript 编译默认配置
 * @module
 * @author vega <vegawong@126.com>
 **/

// typescript compile config
export default function ts() {
  return {
    target: 'es5',
    jsx: 'preserve',
    moduleResolution: 'node',
    declaration: false,
    sourceMap: true,
  };
}
