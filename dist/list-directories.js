'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = listDirectories;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function listDirectories(directory, base) {
    directory = base ? _path2['default'].join(base, directory) : directory;
    return _fs2['default'].readdirSync(directory).filter(function (file) {
        return _fs2['default'].statSync(_path2['default'].join(directory, file)).isDirectory();
    });
}

module.exports = exports['default'];

