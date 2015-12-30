'use strict';

var diff = require('../');
var chalk = require('chalk');

var oldObj;
var newObj;

function printDiff(parts) {
    parts.forEach(function (part) {
        part.value
        .split('\n')
        .filter(function (line) { return !!line; })
        .forEach(function (line) {
            if (part.added) {
                process.stdout.write(chalk.green('+  ' + line) + '\n');
            } else if (part.removed) {
                process.stdout.write(chalk.red('-  ' + line) + '\n');
            } else {
                process.stdout.write(chalk.dim('   ' + line) + '\n');
            }
        });
    });

    process.stdout.write('\n');
}

oldObj = {
    environment: 'dev',
    googleAppId: 'UA-3234432-22',
    socialProviders: ['facebook'],
    libraries: {
        jquery: './node_modules/jquery',
    },
};

newObj = {
    environment: 'prod',
    dbHost: '127.0.0.1:9000',
    socialProviders: ['facebook', 'twitter'],
    libraries: {
        jquery: './node_modules/jquery/jquery',
        moment: './node_modules/moment/moment',
    },
};

printDiff(diff(oldObj, newObj));
printDiff(diff(oldObj, newObj, {
    typeMapper: function (path) {
        if (path === 'socialProviders') {
            return 'array';
        }
    },
}));
