const should = require('should');
const getBabelCommonConfig = require('../src/getBabelCommonConfig.es6');
const os = require('os');


describe('getBabelCommonConfig test cases', () => {
  it('exports should be a function', function() {
    getBabelCommonConfig.should.type('function');
  });

  it('getBabelCommonConfig()', () => {
    getBabelCommonConfig().should.eql({
      cacheDirectory: os.tmpdir(),
      presets: [
        require.resolve('babel-preset-es2015-ie'),
        require.resolve('babel-preset-react'),
        require.resolve('babel-preset-stage-0'),
      ],
      plugins: [
        require.resolve('babel-plugin-add-module-exports'),
        require.resolve('babel-plugin-transform-decorators-legacy'),
        require.resolve('babel-plugin-transform-runtime')
      ]
    });
  });
});
