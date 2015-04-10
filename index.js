/*eslint-disable no-underscore-dangle*/
'use strict';

// 3rd-party modules

var Test = require('tape').Test;

var deepEql = require('deep-eql');
var pathval = require('pathval');
var typeOf = require('type-detect');

// this module

function isArray (value) {
  if (Array.isArray) {
    return Array.isArray(value);
  }
  return typeOf(value) === 'array';
}

Test.prototype.strictEqual = Test.prototype.equal;
Test.prototype.notStrictEqual = Test.prototype.notEqual;
Test.prototype.ifError = Test.prototype.error;

// implement Chai.JS's assertions

Test.prototype.isTrue = function (value, msg) {
  msg = msg || 'isTrue';
  this.equal(value, true, msg);
};

Test.prototype.isFalse = function (value, msg) {
  msg = msg || 'isFalse';
  this.equal(value, false, msg);
};

Test.prototype.typeOf = function (value, type, msg) {
  msg = msg || 'typeOf';
  this.equal(typeOf(value), type, msg);
};

Test.prototype.notTypeOf = function (value, type, msg) {
  msg = msg || 'notTypeOf';
  this.notEqual(typeOf(value), type, msg);
};

Test.prototype.instanceOf = function (value, constructor, msg) {
  msg = msg || 'instanceOf';
  this.isTrue(value instanceof constructor, msg);
};

Test.prototype.notInstanceOf = function (value, constructor, msg) {
  msg = msg || 'notInstanceOf';
  this.isFalse(value instanceof constructor, msg);
};

Test.prototype.isObject = function (value, msg) {
  msg = msg || 'isObject';
  this.typeOf(value, 'object', msg);
};

Test.prototype.isNotObject = function (value, msg) {
  msg = msg || 'isNotObject';
  this.notTypeOf(value, 'object', msg);
};

Test.prototype.isNull = function (value, msg) {
  msg = msg || 'isNull';
  this.typeOf(value, 'null', msg);
};

Test.prototype.isNotNull = function (value, msg) {
  msg = msg || 'isNotNull';
  this.notTypeOf(value, 'null', msg);
};

Test.prototype.isUndefined = function (value, msg) {
  msg = msg || 'isUndefined';
  this.typeOf(value, 'undefined', msg);
};

Test.prototype.isDefined = function (value, msg) {
  msg = msg || 'isDefined';
  this.notTypeOf(value, 'undefined', msg);
};

Test.prototype.isFunction = function (value, msg) {
  msg = msg || 'isFunction';
  this.typeOf(value, 'function', msg);
};

Test.prototype.isNotFunction = function (value, msg) {
  msg = msg || 'isNotFunction';
  this.notTypeOf(value, 'function', msg);
};

Test.prototype.isArray = function (value, msg) {
  msg = msg || 'isArray';
  this.isTrue(isArray(value), msg);
};

Test.prototype.isNotArray = function (value, msg) {
  msg = msg || 'isNotArray';
  this.isFalse(isArray(value), msg);
};

Test.prototype.isString = function (value, msg) {
  msg = msg || 'isString';
  this.typeOf(value, 'string', msg);
};

Test.prototype.isNotString = function (value, msg) {
  msg = msg || 'isNotString';
  this.notTypeOf(value, 'string', msg);
};

Test.prototype.isNumber = function (value, msg) {
  msg = msg || 'isNumber';
  this.typeOf(value, 'number', msg);
};

Test.prototype.isNotNumber = function (value, msg) {
  msg = msg || 'isNotNumber';
  this.notTypeOf(value, 'number', msg);
};

Test.prototype.isBoolean = function (value, msg) {
  msg = msg || 'isBoolean';
  this.typeOf(value, 'boolean', msg);
};

Test.prototype.isNotBoolean = function (value, msg) {
  msg = msg || 'isNotBoolean';
  this.notTypeOf(value, 'boolean', msg);
};

Test.prototype.notInclude = function (haystack, needle, msg) {
  var isValid = isArray(haystack) || typeOf(haystack) === 'string';
  msg = msg || 'notInclude';
  if (isValid) {
    this.equal(haystack.indexOf(needle), -1, msg);
    return;
  }
  this.notOk(isValid, msg);
};

Test.prototype.include = function (haystack, needle, msg) {
  var prop, allEqual;
  var hasIndexOf = isArray(haystack) || typeOf(haystack) === 'string';
  msg = msg || 'include';
  if (typeOf(haystack) === 'object' && typeOf(needle) === 'object') {
    allEqual = true;
    for (prop in needle) {
      if (needle.hasOwnProperty(prop) && haystack.hasOwnProperty(prop)) {
        if (haystack[prop] !== needle[prop]) {
          allEqual = false;
          break;
        }
      }
    }
    this.ok(allEqual, msg);
    return;
  }
  if (hasIndexOf) {
    this.notEqual(haystack.indexOf(needle), -1, msg);
    return;
  }
  this.ok(hasIndexOf, msg);
};

Test.prototype.notInclude = function (haystack, needle, msg) {
  var prop, allEqual;
  var hasIndexOf = isArray(haystack) || typeOf(haystack) === 'string';
  msg = msg || 'notInclude';
  if (typeOf(haystack) === 'object' && typeOf(needle) === 'object') {
    allEqual = false;
    for (prop in needle) {
      if (needle.hasOwnProperty(prop) && haystack.hasOwnProperty(prop)) {
        if (haystack[prop] !== needle[prop]) {
          allEqual = true;
          break;
        }
      }
    }
    this.notOk(allEqual, msg);
    return;
  }
  if (hasIndexOf) {
    this.equal(haystack.indexOf(needle), -1, msg);
    return;
  }
  this.notOk(hasIndexOf, msg);
};

Test.prototype.lengthOf = function (obj, length, msg) {
  msg = msg || 'lengthOf';
  if (obj && typeOf(obj.length) === 'number') {
    this.equal(obj.length, length, msg);
  }
};

Test.prototype.match = function (value, regexp, msg) {
  msg = msg || 'match';
  if (typeOf(regexp) === 'regexp') {
    this.isTrue(regexp.test(value), msg);
    return;
  }
  this.instanceOf(regexp, RegExp);
};

Test.prototype.notMatch = function (value, regexp, msg) {
  msg = msg || 'notMatch';
  if (typeOf(regexp) === 'regexp') {
    this.isFalse(regexp.test(value), msg);
    return;
  }
  this.instanceOf(regexp, RegExp);
};

Test.prototype.property = function (object, property, msg) {
  var isValid = object instanceof Object && typeOf(property) === 'string';
  msg = msg || 'property';
  if (isValid) {
    this.isDefined(object[property], msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.notProperty = function (object, property, msg) {
  var isValid = object instanceof Object && typeOf(property) === 'string';
  msg = msg || 'notProperty';
  if (isValid) {
    this.isUndefined(object[property], msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.deepProperty = function (object, property, msg) {
  var isValid = object instanceof Object && typeOf(property) === 'string';
  msg = msg || 'deepProperty';
  if (isValid) {
    this.isDefined(pathval.get(object, property), msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.notDeepProperty = function (object, property, msg) {
  var isValid = object instanceof Object && typeOf(property) === 'string';
  msg = msg || 'notDeepProperty';
  if (isValid) {
    this.isUndefined(pathval.get(object, property), msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.propertyVal = function (object, property, value, msg) {
  var isValid = object instanceof Object && typeOf(property) === 'string';
  msg = msg || 'propertyVal';
  if (isValid) {
    this.equal(object[property], value, msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.propertyNotVal = function (object, property, value, msg) {
  var isValid = object instanceof Object && typeOf(property) === 'string';
  msg = msg || 'propertyNotVal';
  if (isValid) {
    this.notEqual(object[property], value, msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.deepPropertyVal = function (object, property, value, msg) {
  var isValid = object instanceof Object && typeOf(property) === 'string';
  msg = msg || 'deepPropertyVal';
  if (isValid) {
    this.equal(pathval.get(object, property), value, msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.deepPropertyNotVal = function (object, property, value, msg) {
  var isValid = object instanceof Object && typeOf(property) === 'string';
  msg = msg || 'deepPropertyNotVal';
  if (isValid) {
    this.notEqual(pathval.get(object, property), value, msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.operator = function (val1, operator, val2, msg) {
  msg = msg || 'operator ' + operator;
  if (typeOf(operator) === 'string') {
    switch (operator) {
      case '<':
        this.isTrue(val1 < val2, msg);
        break;
      case '<=':
        this.isTrue(val1 <= val2, msg);
        break;
      case '>':
        this.isTrue(val1 > val2, msg);
        break;
      case '>=':
        this.isTrue(val1 >= val2, msg);
        break;
      /*eslint-disable eqeqeq*/
      case '==':
        this.isTrue(val1 == val2, msg);
        break;
      case '!=':
        this.isTrue(val1 != val2, msg);
        break;
      /*eslint-enable eqeqeq*/
      case '===':
        this.equal(val1, val2, msg);
        break;
      case '!==':
        this.notEqual(val1, val2, msg);
        break;
      default:
        this.fail('unsupported operator');
    }
    return;
  }
  this.isString(operator);
};

Test.prototype.closeTo = function (actual, expected, delta, msg) {
  var isValid = [actual, expected, delta].every(function (value) {
    return typeOf(value) === 'number';
  });
  msg = msg || 'closeTo';
  if (isValid) {
    this.isTrue(Math.abs(actual - expected) <= delta, msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.sameMembers = function (set1, set2, msg) {
  var length, allIncluded;
  var isValid = [set1, set2].every(function (value) {
    return typeOf(value) === 'array';
  });
  msg = msg || 'sameMembers';
  if (isValid) {
    if (set1.length !== set2.length) {
      this.lengthOf(set1, set2.length, msg);
      return;
    }
    length = set2.length;
    allIncluded = true;
    while (length > 0) {
      length -= 1;
      if (set1.indexOf(set2[length]) === -1) {
        allIncluded = false;
        break;
      }
    }
    this.isTrue(allIncluded, msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.includeMembers = function (superset, subset, msg) {
  var length, allIncluded;
  var isValid = [superset, subset].every(function (value) {
    return typeOf(value) === 'array';
  });
  msg = msg || 'includeMembers';
  if (isValid) {
    length = subset.length;
    allIncluded = true;
    while (length > 0) {
      length -= 1;
      if (superset.indexOf(subset[length]) === -1) {
        allIncluded = false;
        break;
      }
    }
    this.isTrue(allIncluded, msg);
    return;
  }
  this.ok(isValid, msg);
};

// override Tape's assertions

Test.prototype.deepEqual = function (actual, expected, msg) {
  msg = msg || 'deepEqual';
  this.isTrue(deepEql(actual, expected), msg);
};

Test.prototype.notDeepEqual = function (actual, expected, msg) {
  var isTypesEqual = typeOf(actual) === typeOf(expected);
  msg = msg || 'notDeepEqual';
  if (!isTypesEqual) {
    this.isFalse(isTypesEqual, msg);
  } else {
    this.isFalse(deepEql(actual, expected), msg);
  }
};
