# Passport-Hash

[Passport](http://passportjs.org/) strategy for authenticating with a hash
parameter provided by link.

This module lets you authenticate using a hash parameter provided by link in your Node.js
applications.  By plugging into Passport, hash authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Installation

    $ npm install passport-hash

## Usage

#### Configure Strategy

The hash authentication strategy authenticates users using a hash link.  The strategy requires a `verify` callback, which accepts this
hash and calls `done` providing a user.

    passport.use(new HashStrategy(
      function(hash, done) {
        User.findOne({ hash: hash }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          if (!user.isUnconfirmed()) { return done(null, false); }
          return done(null, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'hash'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/confirm/:hash', 
      passport.authenticate('hash', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/yuri-karadzhov/passport-hash/tree/master/examples/confirm).

## Tests

    $ npm install --dev
    $ make test

## Credits

  - [Yuri Karadzhov](https://github.com/yuri-karadzhov)

## License

(The MIT License)

Copyright (c) 2012 Yuri Karadzhov

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
