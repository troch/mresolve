'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

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
    var opts = arguments.length <= 0 || arguments[0] === undefined ? defaultOpts : arguments[0];

    var npmDependencies = getDependencies(getPackage(opts.base));

    function result(dependencyName) {
        var directory = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

        return {
            base: opts.base,
            dependencyName: dependencyName,
            npmDependency: false,
            possiblePaths: getPossiblePaths(dependencyName, directory)
        };
    }

    function npmResult(dependencyName, main) {
        return {
            base: opts.base,
            dependencyName: dependencyName,
            npmDependency: true,
            possiblePaths: [main]
        };
    }

    function getPossiblePaths(fromPath) {
        var directory = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

        var possiblePaths = [];

        opts.extensions.forEach(function (ext) {
            possiblePaths.push(_path2['default'].join(directory, fromPath, 'index' + ext));
            if (!/(\\|\/)$/.test(fromPath)) {
                possiblePaths.push(_path2['default'].join(directory, fromPath + ext));
            }
        });

        return possiblePaths;
    }

    return {
        resolveDependency: function resolveDependency(dependency, dir) {
            // console.log(Object.keys(path), path.relative(opts.base, path.join(path.join(opts.base, 'modules'), '../dist/index.js')));
            // console.log(result('dist'));

            if (!dependency) throw new Error('[mresolve] missing dependency string in resolve(dependency)');
            var names = dependency.split('/');
            var possiblePaths = [];

            if (isRelative(dependency)) {
                if (!dir) throw new Error('[mresolve] missing directory in resolve(dependency, directory) for relative path ' + dependency);
                // opts.paths.forEach(p => {
                //     opts.extensions.forEach()
                // });
            } else if (npmDependencies.indexOf(names[0]) !== -1) {
                    if (names.length === 1) {
                        var pkg = getPackage(_path2['default'].join(opts.base, opts.moduleDirectory, names[0]));
                        return npmResult(dependency, getMain(pkg));
                    }
                    //         if (dependencyMains[names[0]]) return dependencyMains[0];
                    //         return fileExists(dependency)
                    //     } else {
                    //         return fileExi
                    //     }
                }
        }
    };
};

exports['default'] = resolve;
module.exports = exports['default'];

