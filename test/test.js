'use strict';

var expect = require('expect.js');
var diff = require('../');

describe('diff-json-structure', function () {
    describe('map-to-type', function () {
        it('should deep clone stuff during the process', function () {
            var obj = {
                some: 'prop',
                array: [1, 2, { other: 'prop' }],
                nested: {
                    foo: 'bar',
                },
                regexp: /foo/,
                bool: true,
                null: null,
                undefined: undefined,
            };

            diff.mapToType(obj);

            expect(obj.some).to.be('prop');
            expect(obj.array).to.eql([1, 2, { other: 'prop' }]);
        });

        it('should correctly map values to types', function () {
            var obj = {
                some: 'prop',
                array: [1, 2, { other: 'prop' }],
                nested: {
                    foo: 'bar',
                },
                regexp: /foo/,
                bool: true,
                null: null,
                undefined: undefined,
            };

            expect(diff.mapToType(obj)).to.eql({
                some: '<string>',
                array: ['<number>', '<number>', { other: '<string>' }],
                nested: {
                    foo: '<string>',
                },
                regexp: '<regexp>',
                bool: '<boolean>',
                null: '<null>',
                undefined: '<undefined>',
            });
        });

        it('should respect typeMapper option', function () {
            var obj = {
                some: 'prop',
                array: [1, 2, { other: 'prop' }],
                nested: {
                    foo: 'bar',
                },
                regexp: /foo/,
                bool: true,
                null: null,
                undefined: undefined,
            };

            expect(diff.mapToType(obj, {
                typeMapper: function (path) {
                    switch (path) {
                    case 'array[2]':
                        return 'object';
                    case 'nested.foo':
                        return 'any';
                    default:
                    }
                },
            })).to.eql({
                some: '<string>',
                array: ['<number>', '<number>', '<object>'],
                nested: {
                    foo: '<any>',
                },
                regexp: '<regexp>',
                bool: '<boolean>',
                null: '<null>',
                undefined: '<undefined>',
            });
        });
    });

    it('should return the correct parts array', function () {
        var oldObj = {
            environment: 'dev',
            googleAppId: 'UA-3234432-22',
            socialProviders: ['facebook'],
            libraries: {
                jquery: './node_modules/jquery',
            },
        };

        var newObj = {
            environment: 'dev',
            dbHost: '127.0.0.1:9000',
            socialProviders: ['facebook', 'twitter'],
            libraries: {
                jquery: './node_modules/jquery/jquery',
                moment: './node_modules/moment/moment',
            },
        };

        var parts = diff(oldObj, newObj);

        // Cleanup undefined values from the objects before we compare
        parts = JSON.parse(JSON.stringify(parts));

        expect(parts).to.eql([
            {
                count: 1,
                value: '{\n',
            },
            {
                count: 1,
                added: true,
                value: '  "dbHost": "<string>",\n',
            },
            {
                count: 1,
                value: '  "environment": "<string>",\n',
            },
            {
                count: 1,
                removed: true,
                value: '  "googleAppId": "<string>",\n',
            },
            {
                count: 2,
                value: '  "libraries": {\n    "jquery": "<string>",\n',
            },
            {
                count: 1,
                added: true,
                value: '    "moment": "<string>"\n',
            },
            {
                count: 3,
                value: '  },\n  "socialProviders": [\n    "<string>",\n',
            },
            {
                count: 1,
                added: true,
                value: '    "<string>"\n',
            },
            {
                count: 2,
                value: '  ]\n}',
            },
        ]);
    });

    it('should work with a custom typeMapper', function () {
        var oldObj = {
            environment: 'dev',
            googleAppId: 'UA-3234432-22',
            socialProviders: ['facebook'],
            libraries: {
                jquery: './node_modules/jquery',
            },
        };

        var newObj = {
            environment: 'dev',
            dbHost: '127.0.0.1:9000',
            socialProviders: ['facebook', 'twitter'],
            libraries: {
                jquery: './node_modules/jquery/jquery',
                moment: './node_modules/moment/moment',
            },
        };

        var parts = diff(oldObj, newObj, {
            typeMapper: function (path) {
                if (path === 'socialProviders') {
                    return 'array';
                }
            },
        });

        // Cleanup undefined values from the objects before we compare
        parts = JSON.parse(JSON.stringify(parts));

        expect(parts).to.eql([
            {
                count: 1,
                value: '{\n',
            },
            {
                count: 1,
                added: true,
                value: '  "dbHost": "<string>",\n',
            },
            {
                count: 1,
                value: '  "environment": "<string>",\n',
            },
            {
                count: 1,
                removed: true,
                value: '  "googleAppId": "<string>",\n',
            },
            {
                count: 2,
                value: '  "libraries": {\n    "jquery": "<string>",\n',
            },
            {
                count: 1,
                added: true,
                value: '    "moment": "<string>"\n',
            },
            {
                count: 3,
                value: '  },\n  \"socialProviders\": \"<array>\"\n}',
            },
        ]);
    });
});
