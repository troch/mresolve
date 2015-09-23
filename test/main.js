'use strict';

var path            = require('path');
var resolve         = require(path.join(__dirname, '..', process.env.npm_package_main));
var should          = require('should');

require('mocha');

describe('mresolve', function () {
    var resolver = resolve({
        base: path.join(__dirname, '..', 'example'),
        paths: ['']
    });

    it('should throw an error if no dependency is given', function () {
        (function() {
            resolver.resolveDependency();
        }).should.throw();
    });

    it('should throw an error if no relative directory is given for a relative dependency', function () {
        (function() {
            resolver.resolveDependency('../a');
        }).should.throw();
    });

    it('should throw an error if no relative directory is given for a relative dependency', function () {
        (function() {
            resolver.resolveDependency('../a');
        }).should.throw();
    });

    it('should throw an error if it cannot access package info of an npm dependency', function () {
        (function() {
            resolver.resolveDependency('mod-c');
        }).should.throw();
    });

    it('should throw an error if a dependency is not found and no additional path was configured', function () {
        var resolver = resolve({
            base: path.join(process.cwd(), 'example'),
            paths: []
        });

        (function() {
            resolver.resolveDependency('modD');
        }).should.throw();
    });

    it('should resolve npm dependencies', function () {

        var dependencyInfo = resolver.resolveDependency('mod-a');

        dependencyInfo.dependencyName.should.equal('mod-a');
        dependencyInfo.npmDependency.should.be.true;
        dependencyInfo.possiblePaths.should.eql(['node_modules/mod-a/index.js']);


        dependencyInfo = resolver.resolveDependency('mod-b');

        dependencyInfo.dependencyName.should.equal('mod-b');
        dependencyInfo.npmDependency.should.be.true;
        dependencyInfo.possiblePaths.should.eql(['node_modules/mod-b/dist/index.js', 'node_modules/mod-b/dist/index/index.js']);


        dependencyInfo = resolver.resolveDependency('mod-a/component');

        dependencyInfo.dependencyName.should.equal('mod-a/component');
        dependencyInfo.npmDependency.should.be.true;
        dependencyInfo.possiblePaths.should.eql(['node_modules/mod-a/component.js', 'node_modules/mod-a/component/index.js']);


        dependencyInfo = resolver.resolveDependency('mod-a/component.js');

        dependencyInfo.dependencyName.should.equal('mod-a/component.js');
        dependencyInfo.npmDependency.should.be.true;
        dependencyInfo.possiblePaths.should.eql(['node_modules/mod-a/component.js']);
    });

    it('should resolve relative dependencies', function () {
        var dependencyInfo = resolver.resolveDependency('../app/components/dropdown', 'b');

        dependencyInfo.dependencyName.should.equal('app/components/dropdown');
        dependencyInfo.npmDependency.should.be.false;
        dependencyInfo.possiblePaths.should.eql(['app/components/dropdown.js', 'app/components/dropdown/index.js']);

        var dependencyInfo = resolver.resolveDependency('../view/home', 'app/components');

        dependencyInfo.dependencyName.should.equal('app/view/home');
        dependencyInfo.npmDependency.should.be.false;
        dependencyInfo.possiblePaths.should.eql(['app/view/home.js', 'app/view/home/index.js']);
    });

    it('should resolve absolute dependencies', function () {
        var resolver = resolve({
            base: path.join(process.cwd(), 'example'),
            paths: ['app']
        });

        var dependencyInfo = resolver.resolveDependency('components/dropdown');

        dependencyInfo.dependencyName.should.equal('components/dropdown');
        dependencyInfo.npmDependency.should.be.false;
        dependencyInfo.possiblePaths.should.eql(['app/components/dropdown.js', 'app/components/dropdown/index.js']);

        var dependencyInfo = resolver.resolveDependency('view/home');

        dependencyInfo.dependencyName.should.equal('view/home');
        dependencyInfo.npmDependency.should.be.false;
        dependencyInfo.possiblePaths.should.eql(['app/view/home.js', 'app/view/home/index.js']);
    });
});
