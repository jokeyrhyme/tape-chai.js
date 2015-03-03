/*eslint-disable no-underscore-dangle*/
'use strict';

// 3rd-party modules

var Test = require('tape').Test;

// this module

// https://github.com/chaijs/chai/blob/master/lib/chai/utils/type.js

var NATIVES = {
  '[object Arguments]': 'arguments',
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object Function]': 'function',
  '[object Number]': 'number',
  '[object RegExp]': 'regexp',
  '[object String]': 'string'
};

function typeOf(obj) {
  var str = Object.prototype.toString.call(obj);
  if (NATIVES[str]) { return NATIVES[str]; }
  if (obj === null) { return 'null'; }
  if (obj === undefined) { return 'undefined'; }
  if (obj === Object(obj)) { return 'object'; }
  return typeof obj;
}


/*eslint-disable curly, eqeqeq, no-else-return, no-extra-parens, vars-on-top, yoda*/
// https://github.com/chaijs/chai/blob/master/lib/chai/utils/getPathValue.js
function _getPathValue (parsed, obj) {
  var tmp = obj
    , res;
  for (var i = 0, l = parsed.length; i < l; i++) {
    var part = parsed[i];
    if (tmp) {
      if ('undefined' !== typeof part.p)
        tmp = tmp[part.p];
      else if ('undefined' !== typeof part.i)
        tmp = tmp[part.i];
      if (i == (l - 1)) res = tmp;
    } else {
      res = undefined;
    }
  }
  return res;
}

function parsePath (path) {
  var str = path.replace(/\[/g, '.[')
    , parts = str.match(/(\\\.|[^.]+?)+/g);
  return parts.map(function (value) {
    var re = /\[(\d+)\]$/
      , mArr = re.exec(value)
    if (mArr) return { i: parseFloat(mArr[1], 10) };
    else return { p: value };
  });
}

function getPathValue (path, obj) {
  var parsed = parsePath(path);
  return _getPathValue(parsed, obj);
}
/*eslint-enable curly, eqeqeq, no-else-return, no-extra-parens, vars-on-top, yoda*/

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
  this.equal(value, true, msg);
};

Test.prototype.isFalse = function (value, msg) {
  this.equal(value, false, msg);
};

Test.prototype.typeOf = function (value, type, msg) {
  this.equal(typeOf(value), type, msg);
};

Test.prototype.notTypeOf = function (value, type, msg) {
  this.notEqual(typeOf(value), type, msg);
};

Test.prototype.instanceOf = function (value, constructor, msg) {
  this.isTrue(value instanceof constructor, msg);
};

Test.prototype.notInstanceOf = function (value, constructor, msg) {
  this.isFalse(value instanceof constructor, msg);
};

Test.prototype.isObject = function (value, msg) {
  this.typeOf(value, 'object', msg);
};

Test.prototype.isNotObject = function (value, msg) {
  this.notTypeOf(value, 'object', msg);
};

Test.prototype.isNull = function (value, msg) {
  this.typeOf(value, 'null', msg);
};

Test.prototype.isNotNull = function (value, msg) {
  this.notTypeOf(value, 'null', msg);
};

Test.prototype.isUndefined = function (value, msg) {
  this.typeOf(value, 'undefined', msg);
};

Test.prototype.isDefined = function (value, msg) {
  this.notTypeOf(value, 'undefined', msg);
};

Test.prototype.isFunction = function (value, msg) {
  this.typeOf(value, 'function', msg);
};

Test.prototype.isNotFunction = function (value, msg) {
  this.notTypeOf(value, 'function', msg);
};

Test.prototype.isArray = function (value, msg) {
  this.isTrue(isArray(value), msg);
};

Test.prototype.isNotArray = function (value, msg) {
  this.isFalse(isArray(value), msg);
};

Test.prototype.isString = function (value, msg) {
  this.typeOf(value, 'string', msg);
};

Test.prototype.isNotString = function (value, msg) {
  this.notTypeOf(value, 'string', msg);
};

Test.prototype.isNumber = function (value, msg) {
  this.typeOf(value, 'number', msg);
};

Test.prototype.isNotNumber = function (value, msg) {
  this.notTypeOf(value, 'number', msg);
};

Test.prototype.isBoolean = function (value, msg) {
  this.typeOf(value, 'boolean', msg);
};

Test.prototype.isNotBoolean = function (value, msg) {
  this.notTypeOf(value, 'boolean', msg);
};

Test.prototype.notInclude = function (haystack, needle, msg) {
  var isValid = isArray(haystack) || typeOf(haystack) === 'string';
  if (isValid) {
    this.equal(haystack.indexOf(needle), -1, msg);
    return;
  }
  this.notOk(isValid, msg);
};

Test.prototype.include = function (haystack, needle, msg) {
  var prop, allEqual;
  var hasIndexOf = isArray(haystack) || typeOf(haystack) === 'string';
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
  if (obj && typeOf(obj.length) === 'number') {
    this.equal(obj.length, length, msg);
  }
};

Test.prototype.match = function (value, regexp, msg) {
  if (typeOf(regexp) === 'regexp') {
    this.isTrue(regexp.test(value), msg);
    return;
  }
  this.instanceOf(regexp, RegExp);
};

Test.prototype.notMatch = function (value, regexp, msg) {
  if (typeOf(regexp) === 'regexp') {
    this.isFalse(regexp.test(value), msg);
    return;
  }
  this.instanceOf(regexp, RegExp);
};

Test.prototype.property = function (object, property, msg) {
  var isValid = object instanceof Object && typeOf(property) === 'string';
  if (isValid) {
    this.isDefined(object[property], msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.notProperty = function (object, property, msg) {
  var isValid = object instanceof Object && typeOf(property) === 'string';
  if (isValid) {
    this.isUndefined(object[property], msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.deepProperty = function (object, property, msg) {
  var isValid = object instanceof Object && typeOf(property) === 'string';
  if (isValid) {
    this.isDefined(getPathValue(property, object), msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.notDeepProperty = function (object, property, msg) {
  var isValid = object instanceof Object && typeOf(property) === 'string';
  if (isValid) {
    this.isUndefined(getPathValue(property, object), msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.propertyVal = function (object, property, value, msg) {
  var isValid = object instanceof Object && typeOf(property) === 'string';
  if (isValid) {
    this.equal(object[property], value, msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.propertyNotVal = function (object, property, value, msg) {
  var isValid = object instanceof Object && typeOf(property) === 'string';
  if (isValid) {
    this.notEqual(object[property], value, msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.deepPropertyVal = function (object, property, value, msg) {
  var isValid = object instanceof Object && typeOf(property) === 'string';
  if (isValid) {
    this.equal(getPathValue(property, object), value, msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.deepPropertyNotVal = function (object, property, value, msg) {
  var isValid = object instanceof Object && typeOf(property) === 'string';
  if (isValid) {
    this.notEqual(getPathValue(property, object), value, msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.operator = function (val1, operator, val2, msg) {
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
  if (isValid) {
    this.isTrue(Math.abs(actual - expected) <= delta, msg);
    return;
  }
  this.ok(isValid, msg);
};

Test.prototype.sameMembers = function (set1, set2, msg) {
  var length;
  this.isArray(set1, msg);
  this.isArray(set2, msg);
  length = set1.length;
  this.equal(length, set2.length, msg);
  this.includeMembers(set1, set2, msg);
};

Test.prototype.includeMembers = function (superset, subset, msg) {
  var length;
  this.isArray(superset, msg);
  this.isArray(subset, msg);
  length = subset.length;
  while (length > 0) {
    length -= 1;
    this.include(superset, subset[length], msg);
  }
};
