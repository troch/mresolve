'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _listDirectories = require('./list-directories');

var _listDirectories2 = _interopRequireDefault(_listDirectories);

var _fileExists = require('file-exists');

var _fileExists2 = _interopRequireDefault(_fileExists);

var defaultOpts = {
    basePath: process.cwd(),
    paths: ['node_modules'],
    extensions: ['.js'],
    exclude: [],
    ignore: [],
    moduleDirectory: 'node_modules'
};

function resolve() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? defaultOpts : arguments[0];

    var npmDependencies = [];
    var dependencyMains = {};

    try {
        var pkg = require(_path2['default'].join(opts.basePath, 'package.json'));
        npmDependencies = Object.keys(pkg.dependencies);
    } catch (e) {
        throw new Error('[mresolve] could not find package.json in \'' + opts.basePath + '\'');
    }

    var paths = opts.paths.map(function (p) {
        var list = (0, _listDirectories2['default'])(p, opts.basePath);
        list.dir = p;
        return list;
    });

    paths = paths.length > 1 ? paths.reduce(function (p1, p2) {
        return p1.concat(p2);
    }) : paths[0] || paths;

    return {
        resolveDependency: function resolveDependency(dependency) {
            // if (!dependency) return;
            // let names = dependency.split('/');
            console.log(paths);
            // if (npmDependencies.indexOf(names[0]) !== -1) {
            //     if (names.length === 1) {
            //         if (dependencyMains[names[0]]) return dependencyMains[0];
            //         return fileExists(dependency)
            //     } else {
            //         return fileExi
            //     }
            // }
        }
    };
};

exports['default'] = resolve;
module.exports = exports['default'];

