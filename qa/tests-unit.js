var fortune = require('../lib/fortune');
var except = require('chai').except;

suite('Fortune cookie tests', function(){
    test('getFortune() shuld return a fortune', function(){
        expcet(typeof fortune.getFortune() === 'string');
    });
});
