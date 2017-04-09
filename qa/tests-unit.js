var fortune = require('../lib/fortune');
var expect = require('../public/vendor/chai').expect;

suite('Fortune cookie tests', function(){
    test('getFortune() shuld return a fortune', function(){
        expect(typeof fortune.getFortune() === 'string');
    });
});
