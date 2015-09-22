'use strict';

var path            = require('path');
var resolve         = require(path.join(__dirname, '..', process.env.npm_package_main));
var should          = require('should');

require('mocha');

describe('mresolve', function() {
    it('should initialise itself first', function() {
        var resolver = resolve();
        resolver.resolveDependency();
    });
});
