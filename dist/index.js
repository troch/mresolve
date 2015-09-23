'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var defaultOpts = {
    base: process.cwd(),
    paths: [''],
    extensions: ['.js'],
    moduleDirectory: 'node_modules'
};

var npmRegistry = {};

function getPackage() {
    var dir = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    try {
        if (npmRegistry[dir]) return npmRegistry[dir];
        var pkg = require(_path2['default'].join(dir, 'package.json'));
        npmRegistry[dir] = pkg;
        return pkg;
    } catch (e) {
        throw new Error('[mresolve] could not find package.json in \'' + dir + '\'');
    }
}

function getDependencies(pkg) {
    return Object.keys(pkg.dependencies || {});
}

function getMain(pkg) {
    return pkg.main || 'index.js';
}

function isRelative(path) {
    return (/^\.{1,2}(?:\/|\\)/.test(path)
    );
}

function resolve() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    opts = _extends({}, defaultOpts, opts);
    var extensionRegex = new RegExp('\\.(?:' + opts.extensions.map(function (e) {
        return e.replace(/^\./, '');
    }).join('|') + ')$');
    var npmDependencies = getDependencies(getPackage(opts.base));

    function result(dependencyName, possiblePaths) {
        var npmDependency = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        return {
            base: opts.base,
            dependencyName: dependencyName,
            npmDependency: npmDependency,
            possiblePaths: possiblePaths
        };
    }

    function getPossiblePaths(fromPath, directory, extensions) {
        if (directory === undefined) directory = '';

        if (extensionRegex.test(fromPath)) return [_path2['default'].join(directory, fromPath)];

        var possiblePaths = [];

        (extensions || opts.extensions).forEach(function (ext) {
            if (!/(\\|\/)$/.test(fromPath)) {
                possiblePaths.push(_path2['default'].join(directory, fromPath + ext));
            }
            possiblePaths.push(_path2['default'].join(directory, fromPath, 'index' + ext));
        });

        return possiblePaths;
    }

    return {
        resolveDependency: function resolveDependency(dependency, relativeTo) {
            if (!dependency) throw new Error('[mresolve] missing dependency string in resolve(dependency)');
            var names = dependency.split('/');

            if (isRelative(dependency)) {
                if (!relativeTo) throw new Error('[mresolve] missing relativeTo in resolve(dependency, relativeTo) for relative path ' + dependency);
                dependency = _path2['default'].relative(opts.base, _path2['default'].join(opts.base, relativeTo, dependency));
                var possiblePaths = getPossiblePaths(dependency);
                return result(dependency, possiblePaths);
            } else if (npmDependencies.indexOf(names[0]) !== -1) {
                if (names.length === 1) {
                    var pkg = getPackage(_path2['default'].join(opts.base, opts.moduleDirectory, names[0]));
                    return result(dependency, getPossiblePaths(_path2['default'].join(dependency, getMain(pkg)), opts.moduleDirectory, ['.js']), true);
                } else {
                    var possiblePaths = getPossiblePaths(dependency, opts.moduleDirectory, ['.js']);
                    return result(dependency, possiblePaths, true);
                }
            } else {
                var _ret = (function () {
                    if (!opts.paths.length) {
                        throw new Error('[mresolve] absolute path ' + dependency + ' not found in package dependencies. Missing module or additional path?');
                    }
                    var possiblePaths = [];
                    opts.paths.forEach(function (directory) {
                        possiblePaths = possiblePaths.concat(getPossiblePaths(dependency, directory));
                    });
                    return {
                        v: result(dependency, possiblePaths)
                    };
                })();

                if (typeof _ret === 'object') return _ret.v;
            }
        }
    };
};

exports['default'] = resolve;
module.exports = exports['default'];

