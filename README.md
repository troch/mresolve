[![npm version](https://badge.fury.io/js/mresolve.svg)](http://badge.fury.io/js/mresolve)
[![Build Status](https://travis-ci.org/troch/mresolve.svg)](https://travis-ci.org/troch/mresolve?branch=master)
[![Coverage Status](https://coveralls.io/repos/troch/mresolve/badge.svg?branch=master&service=github)](https://coveralls.io/github/troch/mresolve?branch=master)

# mresolve

_Resolve module dependencies to a list of possible paths_.

```sh
npm install --save mresolve
```

> This module doesn't access files directly and doesn't check if a file exists. It only access `package.json` files
from your application and its dependants.

## API

#### mresolve(opts)

Create a new resolver with the specified options:
- `base`: your application / repository base path (default to `process.cwd()`)
- `extensions`: the list of possible extensions for a file (default to `['.js']`)
- `moduleDirectory`: the directory name where npm dependencies are located (default to `node_modules`)
- `paths`: a lists of additional paths where files can be located (default to `[]`). This is handy if you don't want
to use relative paths when importing / requiring modules.


#### resolver.resolveDependency(dependency[, relativeTo])

Returns an object containing the following properties:
- `base`: the base path specified in options
- `dependencyName`: the name of your dependency as passed to the function (resolved if relative)
- `npmDepdendency`: `true` or `false` depending if the dependency is external (located in `opts.moduleDependency`)
- `possiblePaths`: a list of possible paths where this module could be found

If `dependency` is relative, do not forget to pass to the function the directory of the module where the dependency was found (relative to base path).

## Usage

```javascript
import mresolve from 'mresolve'

let resolver = resolve({
    base: process.cwd(),
    extensions: ['js'],
    moduleDirectory: 'node_modules',
    paths: []
});

resolver.resolveDependency('../components/dropdown', 'views');

// Will output:
// =>
// {
//     base: <your base path>,
//     dependencyName: components/dropdown,
//     npmDependency: false,
//     possiblePaths: ['components/dropdown.js', 'components/dropdown/index.js']
// }
```
