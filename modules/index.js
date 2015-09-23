import path from 'path';

let defaultOpts = {
    base: process.cwd(),
    paths: [''],
    extensions: ['.js'],
    moduleDirectory: 'node_modules'
};

let npmRegistry = {};

function getPackage(dir = '') {
    try {
        if (npmRegistry[dir]) return npmRegistry[dir];
        let pkg = require(path.join(dir, 'package.json'));
        npmRegistry[dir] = pkg;
        return pkg;
    } catch (e) {
        throw new Error(`[mresolve] could not find package.json in '${dir}'`);
    }
}

function getDependencies(pkg) {
    return Object.keys(pkg.dependencies || {});
}

function getMain(pkg) {
    return pkg.main || 'index.js';
}

function isRelative(path) {
    return /^\.{1,2}(?:\/|\\)/.test(path);
}

function resolve(opts = defaultOpts) {
    let npmDependencies = getDependencies(getPackage(opts.base));

    function result(dependencyName, directory = '') {
        return {
            base: opts.base,
            dependencyName,
            npmDependency: false,
            possiblePaths: getPossiblePaths(dependencyName, directory)
        }
    }

    function npmResult(dependencyName, main) {
        return {
            base: opts.base,
            dependencyName,
            npmDependency: true,
            possiblePaths: [main]
        }
    }

    function getPossiblePaths(fromPath, directory = '') {
        let possiblePaths = [];

        opts.extensions.forEach(ext => {
            possiblePaths.push(path.join(directory, fromPath, 'index' + ext));
            if (!/(\\|\/)$/.test(fromPath)) {
                possiblePaths.push(path.join(directory, fromPath + ext));
            }
        });

        return possiblePaths;
    }

    return {
        resolveDependency: function(dependency, dir) {
            // console.log(Object.keys(path), path.relative(opts.base, path.join(path.join(opts.base, 'modules'), '../dist/index.js')));
            // console.log(result('dist'));

            if (!dependency) throw new Error(`[mresolve] missing dependency string in resolve(dependency)`);
            let names = dependency.split('/');
            let possiblePaths = [];

            if (isRelative(dependency)) {
                if (!dir) throw new Error(`[mresolve] missing directory in resolve(dependency, directory) for relative path ${dependency}`);
                // opts.paths.forEach(p => {
                //     opts.extensions.forEach()
                // });
            } else if (npmDependencies.indexOf(names[0]) !== -1) {
                if (names.length === 1) {
                    let pkg = getPackage(path.join(opts.base, opts.moduleDirectory, names[0]));
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

export default resolve;
