'use strict';

var typeOf = require('typeof');
var cloneDeep = require('lodash.clonedeep');
var assign = require('lodash.assign');
var isPlainObject = require('is-plain-object');
var forEach = require('deep-for-each');
var jsdiff = require('diff');

function mapToType(value, options) {
    options = assign({
        typeMapper: null,
    }, options);

    value = cloneDeep(value);

    forEach(value, function (value, prop, subject, path) {
        var type = options.typeMapper && options.typeMapper(path, value, prop, subject);

        if (type) {
            subject[prop] = '<' + type + '>';
        } else if (!Array.isArray(value) && !isPlainObject(value)) {
            subject[prop] = '<' + typeOf(value) + '>';
        }
    });

    return value;
}

function diff(oldObj, newObj, options) {
    oldObj = mapToType(oldObj, options);
    newObj = mapToType(newObj, options);

    return jsdiff.diffJson(oldObj, newObj, options);
}

module.exports = diff;
module.exports.mapToType = mapToType;
