'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = resolve;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var defaultOpts = {
    basePath: process.cwd(),
    paths: [],
    extensions: ['.js'],
    exclude: [],
    ignore: [],
    moduleDirectory: 'node_modules'
};

function resolve() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? defaultOpts : arguments[0];

    var moduleDirectories = [];
    var moduleDeps = [];

    var dependencies = [];
    try {
        var pkg = require(_path2['default'].resolve(opts.basePath, 'package.json'));
        dependencies = pkg.dependencies;
    } catch (e) {
        throw new Error('[mresolve] could not find package.json in \'' + opts.basePath + '\'');
    }

    return {
        resolveDependency: function resolveDependency() {
            console.log(dependencies);
        }
    };
}

;
module.exports = exports['default'];

