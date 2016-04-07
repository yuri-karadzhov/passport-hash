/**
 * Module dependencies.
 */
var Strategy = require('./strategy')
  , BadRequestError = require('./errors/badrequesterror');

/**
 * Framework version.
 */
exports.version = require('../../package.json').version;

/**
 * Expose constructors.
 */
exports.Strategy = Strategy;

exports.BadRequestError = BadRequestError;
