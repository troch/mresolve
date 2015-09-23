'use strict';

var path            = require('path');
var resolve         = require(path.join(__dirname, '..', process.env.npm_package_main));
var should          = require('should');

require('mocha');

describe('mresolve', function() {
    it('should resolve npm dependencies', function() {
        var resolver = resolve({
            base: path.join(process.cwd(), 'example'),
            paths: ['']
        });

        var dependencyInfo = resolver.resolveDependency('modA');

        dependencyInfo.dependencyName.should.equal('modA');
        dependencyInfo.npmDependency.should.be.true;
        dependencyInfo.possiblePaths.should.eql(['node_modules/modA/index.js']);

        dependencyInfo = resolver.resolveDependency('modB');

        dependencyInfo.dependencyName.should.equal('modB');
        dependencyInfo.npmDependency.should.be.true;
        dependencyInfo.possiblePaths.should.eql(['node_modules/modB/dist/index.js', 'node_modules/modB/dist/index/index.js']);

        dependencyInfo = resolver.resolveDependency('modA/component');

        dependencyInfo.dependencyName.should.equal('modA/component');
        dependencyInfo.npmDependency.should.be.true;
        dependencyInfo.possiblePaths.should.eql(['node_modules/modA/component.js', 'node_modules/modA/component/index.js']);
    });
});
