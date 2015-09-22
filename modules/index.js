import path from 'path';
import listdirs from 'listdirs';

let defaultOpts = {
    basePath: process.cwd(),
    paths: [],
    extensions: ['.js'],
    exclude: [],
    ignore: [],
    moduleDirectory: 'node_modules'
};

export default function resolve(opts = defaultOpts) {
    let moduleDirectories = [];
    let moduleDeps = [];
    let dependencies = [];
    let paths = [];

    try {
        let pkg = require(path.resolve(opts.basePath, 'package.json'));
        dependencies = Object.keys(pkg.dependencies);
    } catch (e) {
        throw new Error(`[mresolve] could not find package.json in '${opts.basePath}'`);
    }

    let paths = [];

    return {
        resolveDependency: function() {
            console.log(dependencies);
        }
    };
};
