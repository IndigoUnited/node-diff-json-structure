# diff-json-structure [![Build Status](https://travis-ci.org/IndigoUnited/node-diff-json-structure.svg?branch=master)](https://travis-ci.org/IndigoUnited/node-diff-json-structure)

Get the structural diff of two JSON objects, returning the same result as [diff](https://github.com/kpdecker/jsdiff)'s `.diffJson()` method.


## Installation

`$ npm install diff-json-structure`


## Usage

`diff(oldObj, newObj, [options])`

Available options:

- typeMapper
- .. and any option that [diff](https://github.com/kpdecker/jsdif)'s `.diffJson()` method supports

### Examples

Simple usage:

```js
var diff = require('diff-json-structure');
var chalk = require('chalk');

function printDiff(parts) {
    parts.forEach(function (part) {
        var color;

        if (part.added) {
            color = 'green';
        } else if (part.removed) {
            color = 'red';
        } else {
            color = 'grey';
        }

        process.stdout.write(chalk[color](part.value));
    });

    process.stdout.write('\n');
}

printDiff(diff({
    environment: 'dev',
    googleAppId: 'UA-3234432-22',
    socialProviders: ['facebook'],
    libraries: {
        jquery: './node_modules/jquery',
    },
}, {
    environment: 'dev',
    dbHost: '127.0.0.1:9000',
    socialProviders: ['facebook', 'twitter'],
    libraries: {
        jquery: './node_modules/jquery/jquery',
        moment: './node_modules/moment/moment',
    },
}));
```

![basic](./screenshots/basic.png)


Usage with `options.typeMapper` to ignore differences of socialProvider items of the example above:

```js
printDiff(diff({
    environment: 'dev',
    googleAppId: 'UA-3234432-22',
    socialProviders: ['facebook'],
    libraries: {
        jquery: './node_modules/jquery',
    },
}, {
    environment: 'dev',
    dbHost: '127.0.0.1:9000',
    socialProviders: ['facebook', 'twitter'],
    libraries: {
        jquery: './node_modules/jquery/jquery',
        moment: './node_modules/moment/moment',
    },
}, {
    typeMapper: function (path, value, prop, subject) {
        // path is a string that contains the full path to this value
        // e.g.: libraries.jquery and socialProviders[0]
        // You may return custom types here.. if nothing is returned, the normal
        // flow of identifying the structure recursively will continue
        if (path === 'socialProviders') {
            return 'array';
        }
    },
}));
```

![basic](./screenshots/mapper.png)


## Tests

`$ npm test`


## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
