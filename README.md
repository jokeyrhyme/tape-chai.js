# Tape Chai.js

[Chai.JS](http://chaijs.com/) Assertions for [Tape](https://github.com/substack/tape)

## What?

This is just the [Assert API](http://chaijs.com/api/assert/) from
Chai.JS.
This builds upon my [Assertive Chai](https://github.com/jokeyrhyme/assertive-chai.js)
project, and tailors it for use with Tape.

I borrowed the unit tests from Chai.JS. :)


## Why?

- [Chai.JS requires ECMAScript 5](https://github.com/chaijs/chai/issues/117),
  making it a poor choice for projects that need to span a wide variety of
  browsers

- I don't feel BDD-style assertions are worth the hassle of having to
  learn what is frequently an inconsistent API

- BDD makes more sense at the test framework level, and it's easy to
  integrate Chai.JS (and this library) with any test framework you like


## How?

Tape Chai.js modifies the `Test` prototype provided by Tape.

### Browser

Use [Browserify](http://browserify.org/)

### Node.JS

```sh
npm install tape --save-dev
npm install tape-chai --save-dev
```

```javascript
var test = require('tape');
require('tape-chai');
```
