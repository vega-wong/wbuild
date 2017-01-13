
var should = require('should');
var getTSCommonConfig = require('../src/getTSCommonConfig.es6');

describe('getTSCommonConfig test cases', function () {
  it('exports should be a function', function () {
    getTSCommonConfig.should.type('function');
  });

  it('exports as function() should return object like that', function () {
    getTSCommonConfig().should.eql({
      target: 'es5',
      jsx: 'preserve',
      moduleResolution: 'node',
      declaration: false,
      sourceMap: true,
    });
  });
});
