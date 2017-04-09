'use strict';

var linkCheck = require('link-check');

linkCheck('http://localhost:3000', function (err, result) {
    if (err) {
        console.error('Error', err);
        return;
    }
    console.log('%s is %s', result.link, result.status);
});