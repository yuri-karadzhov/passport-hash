/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
  , util = require('util')
  , BadRequestError = require('./errors/badrequesterror');


/**
 * `Strategy` constructor.
 *
 * The hash authentication strategy authenticates requests based on the
 * hash link.
 *
 * Applications must supply a `verify` callback which accepts `hash`, and then
 * calls the `done` callback supplying a
 * `user`, which should be set to `false` if the hash is not valid.
 * If an exception occured, `err` should be set.
 *
 * Optionally, `options` can be used to change the parameter in which the
 * hash is found.
 *
 * Options:
 *   - `hashParam`  parameter name where the hash is found, defaults to _hash_
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 *
 * Examples:
 *
 *     passport.use(new HashStrategy(
 *       function(hash, done) {
 *         User.findOne({ hash: hash }, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) throw new Error('hash authentication strategy requires a verify function');

  this._hashParam = options.hashParam || 'hash';

  passport.Strategy.call(this);
  this.name = 'hash';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
  this._headerField = options.headerField || 'X-Auth-Hash';
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a hash link.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req) {
  var hash;

  if (req.params && req.params[this._hashParam]) {
    hash = req.params[this._hashParam];
  } else if (req.get && req.get(this._headerField)) {
    hash = req.get(this._headerField);
  } else if (req.headers && req.headers[this._headerField]) {
    hash = req.headers[this._headerField];
  }

  if (!hash) {
    return this.fail(new BadRequestError('Missing hash parameter'));
  }

  var verified = function(err, user, info) {
    if (err) { return this.error(err); }
    if (!user) { return this.fail(info); }
    this.success(user, info);
  }.bind(this);

  if (this._passReqToCallback) {
    this._verify(req, hash, verified);
  } else {
    this._verify(hash, verified);
  }
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
