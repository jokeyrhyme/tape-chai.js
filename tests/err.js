'use strict';

// 3rd-party modules

var test = require('tape');

// this module

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

module.exports = err;
