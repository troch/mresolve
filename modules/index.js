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

function resolve(opts = {}) {
    opts = {...defaultOpts, ...opts};
    let extensionRegex = new RegExp('\\.(?:' + opts.extensions.map(e => e.replace(/^\./, '')).join('|') + ')$');
    let npmDependencies = getDependencies(getPackage(opts.base));

    function result(dependencyName, possiblePaths, npmDependency = false) {
        return {
            base: opts.base,
            dependencyName,
            npmDependency,
            possiblePaths
        };
    }

    function getPossiblePaths(fromPath, directory = '', extensions) {
        if (extensionRegex.test(fromPath)) return [path.join(directory, fromPath)];

        let possiblePaths = [];

        (extensions || opts.extensions).forEach(ext => {
            if (!/(\\|\/)$/.test(fromPath)) {
                possiblePaths.push(path.join(directory, fromPath + ext));
            }
            possiblePaths.push(path.join(directory, fromPath, 'index' + ext));
        });

        return possiblePaths;
    }

    return {
        resolveDependency: function(dependency, relativeTo) {
            if (!dependency) throw new Error(`[mresolve] missing dependency string in resolve(dependency)`);
            let names = dependency.split('/');

            if (isRelative(dependency)) {
                if (!relativeTo) throw new Error(`[mresolve] missing relativeTo in resolve(dependency, relativeTo) for relative path ${dependency}`);
                dependency = path.relative(opts.base, path.join(opts.base, relativeTo, dependency));
                let possiblePaths = getPossiblePaths(dependency, '');
                return result(dependency, possiblePaths);
            } else if (npmDependencies.indexOf(names[0]) !== -1) {
                if (names.length === 1) {
                    let pkg = getPackage(path.join(opts.base, opts.moduleDirectory, names[0]));
                    return result(dependency, getPossiblePaths(path.join(dependency, getMain(pkg)), opts.moduleDirectory, ['.js']), true);
                } else {
                    let possiblePaths = getPossiblePaths(dependency, opts.moduleDirectory, ['.js']);
                    return result(dependency, possiblePaths, true);
                }
            } else {
                if (!opts.paths.length) {
                    throw new Error(`[mresolve] absolute path ${dependency} not found in package dependencies. Missing module or additional path?`);
                }
                let possiblePaths = [];
                opts.paths.forEach(directory => {
                    possiblePaths = possiblePaths.concat(getPossiblePaths(dependency, directory));
                });
                return result(dependency, possiblePaths);
            }
        }
    };
};

export default resolve;
