import path from 'path';
import listDirectories from './list-directories';
import fileExists from 'file-exists';

let defaultOpts = {
    basePath: process.cwd(),
    paths: ['node_modules'],
    extensions: ['.js'],
    exclude: [],
    ignore: [],
    moduleDirectory: 'node_modules'
};

function resolve(opts = defaultOpts) {
    let npmDependencies = [];
    let dependencyMains = {};

    try {
        let pkg = require(path.join(opts.basePath, 'package.json'));
        npmDependencies = Object.keys(pkg.dependencies);
    } catch (e) {
        throw new Error(`[mresolve] could not find package.json in '${opts.basePath}'`);
    }

    let paths = opts.paths
        .map(p => {
            let list = listDirectories(p, opts.basePath);
            list.dir = p;
            return list;
        });

    paths = paths.length > 1 ? paths.reduce((p1, p2) => p1.concat(p2)) : (paths[0] || paths);

    return {
        resolveDependency: function(dependency) {
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

export default resolve;
