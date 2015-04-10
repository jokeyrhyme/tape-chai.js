'use strict';

// 3rd-party modules

var Backbone = require('backbone');

var test = require('tape');

// our modules

var err = require('./err');

// this module

test('deepEqual for issue #4', function(t) {
  t.plan(1);
  // https://github.com/jokeyrhyme/assertive-chai.js/issues/4
  err(t, function (ht) {
    ht.deepEqual(1, 3);
  }, "expected 1 and 3 to be deeply equal");
});

test('notDeepEqual for issue #4', function(t) {
  t.plan(1);
  // https://github.com/jokeyrhyme/assertive-chai.js/issues/4
  t.notDeepEqual(1, 3);
});

test('ok with a circular object', function (t) {
  var obj = {};
  t.plan(1);
  obj.a = obj;
  t.ok(obj);
});

test('ok with a circular Backbone.Model', function (t) {
  var Parent = Backbone.Model.extend({});
  var parent = new Parent();
  var Child = Parent.extend({});
  var child = new Child();
  t.plan(2);
  parent.set('child', child);
  child.set('parent', parent);
  t.ok(parent);
  t.ok(child);
});
