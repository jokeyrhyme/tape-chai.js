/*eslint-disable dot-notation, no-array-constructor, no-new-wrappers*/
'use strict';

var test = require('tape');

var ORIGINALS = {};
Object.keys(test.Test.prototype).forEach(function (prop) {
  ORIGINALS[prop] = test.Test.prototype[prop];
});

require('..');

test('tape-chai doesn\'t clobber original methods', function (t) {
  Object.keys(test.Test.prototype).forEach(function (prop) {
    if (!ORIGINALS[prop]) { return; }
    t.equal(ORIGINALS[prop], test.Test.prototype[prop], 'Test.prototype.' + prop);
    ORIGINALS[prop] = test.Test.prototype[prop];
  });
  t.end();
});

// require('events').EventEmitter.defaultMaxListeners = 100;

// https://github.com/chaijs/chai/blob/master/test/t.js

// https://github.com/chaijs/chai/blob/master/test/bootstrap/index.js

/*eslint-disable no-underscore-dangle*/
function err(t, fn, msg) {
  var htest = test.createHarness({ exit: false });
  var rows = [];
  var stream = htest.createStream({ objectMode: true });
  var rowFn = function (row) {
    rows.push(row);
  };
  var endFn = function () {
    stream.removeAllListeners('data');
    stream.removeAllListeners('end');
    stream = null;
    t.ok(rows.every(function (row) {
      return !row.ok;
    }), 'expected failure: ' + msg);
  };
  if (!t instanceof test.Test) {
    throw new TypeError('err expects 1st parameter to be a test');
  }
  stream.on('data', rowFn);
  stream.once('end', endFn);
  htest('fails: ' + msg, function (ht) {
    fn(ht);
    ht.end();
  });
}
/*eslint-enable no-underscore-dangle*/

test('isTrue', function (t) {
  t.plan(4);
  t.isTrue(true);

  err(t, function (ht) {
    ht.isTrue(false);
  }, 'expected false to be true');

  err(t, function (ht) {
    ht.isTrue(1);
  }, 'expected 1 to be true');

  err(t, function (ht) {
    ht.isTrue('test');
  }, 'expected \'test\' to be true');
});

test('ok', function (t) {
  t.plan(6);
  t.ok(true);
  t.ok(1);
  t.ok('test');

  err(t, function (ht) {
    ht.ok(false);
  }, 'expected false to be truthy');

  err(t, function (ht) {
    ht.ok(0);
  }, 'expected 0 to be truthy');

  err(t, function (ht) {
    ht.ok('');
  }, 'expected \'\' to be truthy');
});

test('notOk', function (t) {
  t.plan(6);
  t.notOk(false);
  t.notOk(0);
  t.notOk('');

  err(t, function (ht) {
    ht.notOk(true);
  }, 'expected true to be falsy');

  err(t, function (ht) {
    ht.notOk(1);
  }, 'expected 1 to be falsy');

  err(t, function (ht) {
    ht.notOk('test');
  }, 'expected \'test\' to be falsy');
});

test('isFalse', function (t) {
  t.plan(3);
  t.isFalse(false);

  err(t, function (ht) {
    ht.isFalse(true);
  }, 'expected true to be false');

  err(t, function (ht) {
    ht.isFalse(0);
  }, 'expected 0 to be false');
});

test('equal', function (t) {
  var foo;
  t.equal(foo, undefined);
  t.end();
});

test('typeof / notTypeOf', function (t) {
  t.plan(4);
  t.typeOf('test', 'string');
  t.typeOf(true, 'boolean');
  t.typeOf(5, 'number');

  err(t, function (ht) {
    ht.typeOf(5, 'string');
  }, 'expected 5 to be a string');
});

test('notTypeOf', function (t) {
  t.plan(2);
  t.notTypeOf('test', 'number');

  err(t, function (ht) {
    ht.notTypeOf(5, 'number');
  }, 'expected 5 not to be a number');
});

test('instanceOf', function(t) {
  t.plan(3);
  function Foo(){}
  t.instanceOf(new Foo(), Foo);

  err(t, function (ht) {
    ht.instanceOf(5, Foo);
  }, 'expected 5 to be an instance of Foo');

  function CrashyObject() {}
  CrashyObject.prototype.inspect = function () {
    throw new Error('Arg\'s inspect() called even though the test passed');
  };
  t.instanceOf(new CrashyObject(), CrashyObject);
});

test('notInstanceOf', function (t) {
  t.plan(2);
  function Foo(){}
  t.notInstanceOf(new Foo(), String);

  err(t, function (ht) {
    ht.notInstanceOf(new Foo(), Foo);
  }, 'expected {} to not be an instance of Foo');
});

test('isObject', function (t) {
  t.plan(5);
  function Foo(){}
  t.isObject({});
  t.isObject(new Foo());

  err(t, function (ht) {
    ht.isObject(true);
  }, 'expected true to be an object');

  err(t, function (ht) {
    ht.isObject(Foo);
  }, 'expected [Function: Foo] to be an object');

  err(t, function (ht) {
    ht.isObject('foo');
  }, 'expected \'foo\' to be an object');
});

test('isNotObject', function (t) {
  t.plan(2);
  t.isNotObject(5);

  err(t, function (ht) {
    ht.isNotObject({});
  }, 'expected {} not to be an object');
});

test('notEqual', function(t) {
  t.plan(2);
  t.notEqual(3, 4);

  err(t, function (ht) {
    ht.notEqual(5, 5);
  }, 'expected 5 to not equal 5');
});

test('strictEqual', function(t) {
  t.plan(2);
  t.strictEqual('foo', 'foo');

  err(t, function (ht) {
    ht.strictEqual('5', 5);
  }, 'expected \'5\' to equal 5');
});

test('notStrictEqual', function(t) {
  t.plan(2);
  t.notStrictEqual(5, '5');

  err(t, function (ht) {
    ht.notStrictEqual(5, 5);
  }, 'expected 5 to not equal 5');
});

test('deepEqual', function(t) {
  var obja, objb;
  // var obj1, obj2;
  t.plan(Object.create ? 3 : 2);
  t.deepEqual({tea: 'chai'}, {tea: 'chai'});

  err(t, function (ht) {
    ht.deepEqual({tea: 'chai'}, {tea: 'black'});
  }, 'expected { tea: \'chai\' } to deeply equal { tea: \'black\' }');

  if (Object.create) {
    obja = Object.create({ tea: 'chai' });
    objb = Object.create({ tea: 'chai' });

    t.deepEqual(obja, objb, 'Object.create() with the same props should deeply equal');

    // https://github.com/iojs/io.js/issues/620
    // https://github.com/joyent/node/issues/4523
    /* tape and Node don't deepEqual property with Object.create like this
    obj1 = Object.create({tea: 'chai'});
    obj2 = Object.create({tea: 'black'});

    err(t, function (ht) {
      ht.deepEqual(obj1, obj2);
    }, 'expected { tea: \'chai\' } to deeply equal { tea: \'black\' }');
    */
  }
});

test('deepEqual (ordering)', function(t) {
  var a = { a: 'b', c: 'd' }
    , b = { c: 'd', a: 'b' };
  t.deepEqual(a, b);
  t.end();
});

/* tape and Node don't deepEqual RegExp and Date like Chai does
test('deepEqual /regexp/', function(t) {
  t.deepEqual(/a/, /a/);
  t.notDeepEqual(/a/, /b/);
  t.notDeepEqual(/a/, {});
  t.deepEqual(/a/g, /a/g);
  t.notDeepEqual(/a/g, /b/g);
  t.deepEqual(/a/i, /a/i);
  t.notDeepEqual(/a/i, /b/i);
  t.deepEqual(/a/m, /a/m);
  t.notDeepEqual(/a/m, /b/m);
  t.end();
});

test('deepEqual (Date)', function(t) {
  var a = new Date(1, 2, 3)
    , b = new Date(4, 5, 6);
  t.deepEqual(a, a);
  t.notDeepEqual(a, b);
  t.notDeepEqual(a, {});
  t.end();
});
*/

/* tape and Node don't deal with circular structures
test('deepEqual (circular)', function(t) {
  var circularObject = {}
    , secondCircularObject = {};

  t.plan(2);
  circularObject.field = circularObject;
  secondCircularObject.field = secondCircularObject;

  t.deepEqual(circularObject, secondCircularObject);

  err(t, function (ht) {
    secondCircularObject.field2 = secondCircularObject;
    ht.deepEqual(circularObject, secondCircularObject);
  }, 'expected { field: [Circular] } to deeply equal { Object (field, field2) }');
});
*/

test('notDeepEqual', function(t) {
  t.plan(2);
  t.notDeepEqual({tea: 'jasmine'}, {tea: 'chai'});

  err(t, function (ht) {
    ht.notDeepEqual({tea: 'chai'}, {tea: 'chai'});
  }, 'expected { tea: \'chai\' } to not deeply equal { tea: \'chai\' }');
});

/* tape and Node don't deal with circular structures
test('notDeepEqual (circular)', function(t) {
  var circularObject = {}
    , secondCircularObject = { tea: 'jasmine' };

  t.plan(2);
  circularObject.field = circularObject;
  secondCircularObject.field = secondCircularObject;

  t.notDeepEqual(circularObject, secondCircularObject);

  err(t, function (ht) {
    delete secondCircularObject.tea;
    t.notDeepEqual(circularObject, secondCircularObject);
  }, 'expected { field: [Circular] } to not deeply equal { field: [Circular] }');
});
*/

test('isNull', function(t) {
  t.plan(2);
  t.isNull(null);

  err(t, function (ht) {
    ht.isNull(undefined);
  }, 'expected undefined to equal null');
});

test('isNotNull', function(t) {
  t.plan(2);
  t.isNotNull(undefined);

  err(t, function (ht) {
    ht.isNotNull(null);
  }, 'expected null to not equal null');
});

test('isUndefined', function(t) {
  t.plan(2);
  t.isUndefined(undefined);

  err(t, function (ht) {
    ht.isUndefined(null);
  }, 'expected null to equal undefined');
});

test('isDefined', function(t) {
  t.plan(2);
  t.isDefined(null);

  err(t, function (ht) {
    ht.isDefined(undefined);
  }, 'expected undefined to not equal undefined');
});

test('isFunction', function(t) {
  var func = function () {};
  t.plan(2);
  t.isFunction(func);

  err(t, function (ht) {
    ht.isFunction({});
  }, 'expected {} to be a function');
});

test('isNotFunction', function (t) {
  t.plan(2);
  t.isNotFunction(5);

  err(t, function (ht) {
    ht.isNotFunction(function () {});
  }, 'expected [Function] not to be a function');
});

test('isArray', function(t) {
  t.plan(3);
  t.isArray([]);
  t.isArray(new Array());

  err(t, function (ht) {
    ht.isArray({});
  }, 'expected {} to be an array');
});

test('isNotArray', function (t) {
  t.plan(3);
  t.isNotArray(3);

  err(t, function (ht) {
    ht.isNotArray([]);
  }, 'expected [] not to be an array');

  err(t, function (ht) {
    ht.isNotArray(new Array());
  }, 'expected [] not to be an array');
});

test('isString', function(t) {
  t.plan(3);
  t.isString('Foo');
  t.isString(new String('foo'));

  err(t, function (ht) {
    ht.isString(1);
  }, 'expected 1 to be a string');
});

test('isNotString', function (t) {
  t.plan(3);
  t.isNotString(3);
  t.isNotString([ 'hello' ]);

  err(t, function (ht) {
    ht.isNotString('hello');
  }, 'expected \'hello\' not to be a string');
});

test('isNumber', function (t) {
  t.plan(3);
  t.isNumber(1);
  t.isNumber(Number('3'));

  err(t, function (ht) {
    ht.isNumber('1');
  }, 'expected \'1\' to be a number');
});

test('isNotNumber', function (t) {
  t.plan(3);
  t.isNotNumber('hello');
  t.isNotNumber([ 5 ]);

  err(t, function (ht) {
    ht.isNotNumber(4);
  }, 'expected 4 not to be a number');
});

test('isBoolean', function (t) {
  t.plan(3);
  t.isBoolean(true);
  t.isBoolean(false);

  err(t, function (ht) {
    ht.isBoolean('1');
  }, 'expected \'1\' to be a boolean');
});

test('isNotBoolean', function (t) {
  t.plan(3);
  t.isNotBoolean('true');

  err(t, function (ht) {
    ht.isNotBoolean(true);
  }, 'expected true not to be a boolean');

  err(t, function (ht) {
    ht.isNotBoolean(false);
  }, 'expected false not to be a boolean');
});

test('include', function (t) {
  t.plan(5);
  t.include('foobar', 'bar');
  t.include([ 1, 2, 3], 3);
  t.include({ a: 1, b: 2 }, { b: 2 });

  err(t, function (ht) {
    ht.include('foobar', 'baz');
  }, 'expected \'foobar\' to include \'baz\'');

  err(t, function (ht) {
    ht.include(undefined, 'bar');
  }, 'expected undefined to include \'bar\'');
});

test('notInclude', function (t) {
  t.plan(4);
  t.notInclude('foobar', 'baz');
  t.notInclude([ 1, 2, 3 ], 4);
  t.notInclude(undefined, 'bar');

  err(t, function (ht) {
    ht.notInclude('foobar', 'bar');
  }, 'expected \'foobar\' to not include \'bar\'');
});

test('lengthOf', function (t) {
  t.plan(4);
  t.lengthOf([1, 2, 3], 3);
  t.lengthOf('foobar', 6);

  err(t, function (ht) {
    ht.lengthOf('foobar', 5);
   }, 'expected \'foobar\' to have a length of 5 but got 6');

  err(t, function (ht) {
    ht.lengthOf(1, 5);
  }, 'expected 1 to have a property \'length\'');
});

test('match', function (t) {
  t.plan(4);
  t.match('foobar', /^foo/);
  t.notMatch('foobar', /^bar/);

  err(t, function (ht) {
    ht.match('foobar', /^bar/i);
  }, 'expected \'foobar\' to match /^bar/i');

  err(t, function (ht) {
    ht.notMatch('foobar', /^foo/i);
  }, 'expected \'foobar\' not to match /^foo/i');
});

test('property', function (t) {
  var obj = { foo: { bar: 'baz' } };
  var simpleObj = { foo: 'bar' };
  t.plan(15);
  t.property(obj, 'foo');
  t.deepProperty(obj, 'foo.bar');
  t.notProperty(obj, 'baz');
  t.notProperty(obj, 'foo.bar');
  t.notDeepProperty(obj, 'foo.baz');
  t.deepPropertyVal(obj, 'foo.bar', 'baz');
  t.deepPropertyNotVal(obj, 'foo.bar', 'flow');

  err(t, function (ht) {
    ht.property(obj, 'baz');
  }, 'expected { foo: { bar: \'baz\' } } to have a property \'baz\'');

  err(t, function (ht) {
    ht.deepProperty(obj, 'foo.baz');
  }, 'expected { foo: { bar: \'baz\' } } to have a deep property \'foo.baz\'');

  err(t, function (ht) {
    ht.notProperty(obj, 'foo');
  }, 'expected { foo: { bar: \'baz\' } } to not have property \'foo\'');

  err(t, function (ht) {
    ht.notDeepProperty(obj, 'foo.bar');
  }, 'expected { foo: { bar: \'baz\' } } to not have deep property \'foo.bar\'');

  err(t, function (ht) {
    ht.propertyVal(simpleObj, 'foo', 'ball');
  }, 'expected { foo: \'bar\' } to have a property \'foo\' of \'ball\', but got \'bar\'');

  err(t, function (ht) {
    ht.deepPropertyVal(obj, 'foo.bar', 'ball');
  }, 'expected { foo: { bar: \'baz\' } } to have a deep property \'foo.bar\' of \'ball\', but got \'baz\'');

  err(t, function (ht) {
    ht.propertyNotVal(simpleObj, 'foo', 'bar');
  }, 'expected { foo: \'bar\' } to not have a property \'foo\' of \'bar\'');

  err(t, function (ht) {
    ht.deepPropertyNotVal(obj, 'foo.bar', 'baz');
  }, 'expected { foo: { bar: \'baz\' } } to not have a deep property \'foo.bar\' of \'baz\'');
});

test('throws', function(t) {
  t.plan(8);
  t.throws(function () { throw new Error('foo'); });
  t.throws(function () { throw new Error('bar'); }, 'bar');
  t.throws(function () { throw new Error('bar'); }, /bar/);
  t.throws(function () { throw new Error('bar'); }, Error);
  t.throws(function () { throw new Error('bar'); }, Error, 'bar');

  err(t, function (ht) {
    ht.throws(function () { throw new Error('foo'); }, TypeError);
  }, 'expected [Function] to throw \'TypeError\' but \'Error: foo\' was thrown');

  // tape: throws(Function, Function|RegExp, String)
  // chai: throws(Function, Function|RegExp|String, RegExp|String, String)

  /* // sticking with tape's version for now
  err(t, function (ht) {
    ht.throws(function () { throw new Error('foo') }, 'bar');
  }, 'expected [Function] to throw error including 'bar' but got 'foo'');

  err(t, function (ht) {
    ht.throws(function () { throw new Error('foo') }, Error, 'bar');
  }, 'expected [Function] to throw error including 'bar' but got 'foo'');
  */

  err(t, function (ht) {
    ht.throws(function () { throw new Error('foo'); }, TypeError, 'bar');
  }, 'expected [Function] to throw \'TypeError\' but \'Error: foo\' was thrown');

  err(t, function (ht) {
    ht.throws(function () {});
  }, 'expected [Function] to throw an error');

  /* // sticking with tape's version for now
  err(t, function (ht) {
    ht.throws(function () { throw new Error('') }, 'bar');
  }, 'expected [Function] to throw error including 'bar' but got ''');

  err(t, function (ht) {
    ht.throws(function () { throw new Error('') }, /bar/);
  }, 'expected [Function] to throw error matching /bar/ but got ''');
  */
});

test('doesNotThrow', function(t) {
  t.plan(4);
  function CustomError(message) {
      this.name = 'CustomError';
      this.message = message;
  }
  CustomError.prototype = Error.prototype;

  t.doesNotThrow(function () { });
  t.doesNotThrow(function () { }, 'foo');

  err(t, function (ht) {
    ht.doesNotThrow(function () { throw new Error('foo'); });
  }, 'expected [Function] to not throw an error but \'Error: foo\' was thrown');

  err(t, function (ht) {
      ht.doesNotThrow(function () { throw new CustomError('foo'); });
  }, 'expected [Function] to not throw an error but \'CustomError: foo\' was thrown');
});

test('ifError', function(t) {
  t.plan(4);
  t.ifError(false);
  t.ifError(null);
  t.ifError(undefined);

  err(t, function (ht) {
    ht.ifError('foo');
  }, 'expected \'foo\' to be falsy');
});

test('operator', function(t) {
  t.plan(15);
  t.operator(1, '<', 2);
  t.operator(2, '>', 1);
  t.operator(1, '==', 1);
  t.operator(1, '<=', 1);
  t.operator(1, '>=', 1);
  t.operator(1, '!=', 2);
  t.operator(1, '!==', 2);
  t.operator(1, '!==', '1');

  err(t, function (ht) {
    ht.operator(1, '=', 2);
  }, 'Invalid operator \'=\'');

  err(t, function (ht) {
    ht.operator(2, '<', 1);
   }, 'expected 2 to be < 1');

  err(t, function (ht) {
    ht.operator(1, '>', 2);
   }, 'expected 1 to be > 2');

  err(t, function (ht) {
    ht.operator(1, '==', 2);
   }, 'expected 1 to be == 2');

  err(t, function (ht) {
    ht.operator(2, '<=', 1);
   }, 'expected 2 to be <= 1');

  err(t, function (ht) {
    ht.operator(1, '>=', 2);
   }, 'expected 1 to be >= 2');

  err(t, function (ht) {
    ht.operator(1, '!=', 1);
   }, 'expected 1 to be != 1');
});

test('closeTo', function(t) {
  t.plan(5);
  t.closeTo(1.5, 1.0, 0.5);
  t.closeTo(10, 20, 20);
  t.closeTo(-10, 20, 30);

  err(t, function (ht) {
    ht.closeTo(2, 1.0, 0.5);
  }, 'expected 2 to be close to 1 +/- 0.5');

  err(t, function (ht) {
    ht.closeTo(-10, 20, 29);
  }, 'expected -10 to be close to 20 +/- 29');
});

test('members', function(t) {
  t.plan(5);
  t.includeMembers([1, 2, 3], [2, 3]);
  t.includeMembers([1, 2, 3], []);
  t.includeMembers([1, 2, 3], [3]);

  err(t, function (ht) {
    ht.includeMembers([5, 6], [7, 8]);
  }, 'expected [ 5, 6 ] to be a superset of [ 7, 8 ]');

  err(t, function (ht) {
    ht.includeMembers([5, 6], [5, 6, 0]);
  }, 'expected [ 5, 6 ] to be a superset of [ 5, 6, 0 ]');
});

test('memberEquals', function(t) {
  t.plan(5);
  t.sameMembers([], []);
  t.sameMembers([1, 2, 3], [3, 2, 1]);
  t.sameMembers([4, 2], [4, 2]);

  err(t, function (ht) {
    ht.sameMembers([], [1, 2]);
  }, 'expected [] to have the same members as [ 1, 2 ]');

  err(t, function (ht) {
    ht.sameMembers([1, 54], [6, 1, 54]);
  }, 'expected [ 1, 54 ] to have the same members as [ 6, 1, 54 ]');
});
