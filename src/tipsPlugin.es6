import log from './log';


export default class TipsPlugin {
  apply(compiler) {
    compiler.plugin('compile', () => {
      log.yellow('webpack:  building...');
    });
  }
}
