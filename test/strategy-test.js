var vows = require('vows');
var assert = require('assert');
var util = require('util');
var HashStrategy = require('passport-hash/strategy');
var BadRequestError = require('passport-hash/errors/badrequesterror');


vows.describe('HashStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new HashStrategy(function(){});
    },
    
    'should be named session': function (strategy) {
      assert.equal(strategy.name, 'hash');
    },
  },
  
  'strategy handling a request': {
    topic: function() {
      var strategy = new HashStrategy(function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(null, user);
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        
        strategy._verify = function(hash, done) {
          done(null, { hash: hash });
        }
        
        req.params = {};
        req.params.hash = '894391393b25136b808500347bcac763';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should not generate an error' : function(err, user) {
        assert.isNull(err);
      },
      'should authenticate' : function(err, user) {
        assert.equal(user.hash, '894391393b25136b808500347bcac763');
      },
    },
  },
  
  'strategy handling a request with req argument to callback': {
    topic: function() {
      var strategy = new HashStrategy({passReqToCallback: true}, function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        req.foo = 'bar';
        strategy.success = function(user) {
          self.callback(null, user);
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        
        strategy._verify = function(req, hash, done) {
          done(null, { foo: req.foo, hash: hash });
        }
        
        req.params = {};
        req.params.hash = '894391393b25136b808500347bcac763';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should not generate an error' : function(err, user) {
        assert.isNull(err);
      },
      'should authenticate' : function(err, user) {
        assert.equal(user.hash, '894391393b25136b808500347bcac763');
      },
      'should have request details' : function(err, user) {
        assert.equal(user.foo, 'bar');
      },
    },
  },
  
  'strategy handling a request with parameter options set': {
    topic: function() {
      var strategy = new HashStrategy({ hashParam: 'link' }, function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(null, user);
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        
        strategy._verify = function(hash, done) {
          done(null, { hash: hash });
        }
        
        req.params = {};
        req.params.link = '894391393b25136b808500347bcac763';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should not generate an error' : function(err, user) {
        assert.isNull(err);
      },
      'should authenticate' : function(err, user) {
        assert.equal(user.hash, '894391393b25136b808500347bcac763');
      },
    },
  },
  
  'strategy handling a request with additional info': {
    topic: function() {
      var strategy = new HashStrategy(function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user, info) {
          self.callback(null, user, info);
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        
        strategy._verify = function(hash, done) {
          done(null, { hash: hash }, { message: 'Welcome' });
        }
        
        req.params = {};
        req.params.hash = '894391393b25136b808500347bcac763';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should not generate an error' : function(err, user, info) {
        assert.isNull(err);
      },
      'should authenticate' : function(err, user) {
        assert.equal(user.hash, '894391393b25136b808500347bcac763');
      },
      'should pass additional info' : function(err, user, info) {
        assert.equal(info.message, 'Welcome');
      },
    },
  },
  
  'strategy handling a request that is not verified': {
    topic: function() {
      var strategy = new HashStrategy(function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.fail = function() {
          self.callback();
        }
        
        strategy._verify = function(hash, done) {
          done(null, false);
        }
        
        req.params = {};
        req.params.hash = '894391393b25136b808500347bcac760';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should fail authentication' : function(err, user) {
        // fail action was called, resulting in test callback
        assert.isNull(err);
      },
    },
  },
  
  'strategy handling a request that is not verified with additional info': {
    topic: function() {
      var strategy = new HashStrategy(function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.fail = function(info) {
          self.callback(null, info);
        }
        
        strategy._verify = function(hash, done) {
          done(null, false, { message: 'Wrong hash' });
        }
        
        req.params = {};
        req.params.hash = '894391393b25136b808500347bcac760';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should fail authentication' : function(err, info) {
        // fail action was called, resulting in test callback
        assert.isNull(err);
      },
      'should pass additional info' : function(err, info) {
        assert.equal(info.message, 'Wrong hash');
      },
    },
  },
  
  'strategy handling a request that encounters an error during verification': {
    topic: function() {
      var strategy = new HashStrategy(function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.error = function(err) {
          self.callback(null, err);
        }
        
        strategy._verify = function(hash, done) {
          done(new Error('something-went-wrong'));
        }
        
        req.params = {};
        req.params.hash = '894391393b25136b808500347bcac763';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should not call success or fail' : function(err, e) {
        assert.isNull(err);
      },
      'should call error' : function(err, e) {
        assert.instanceOf(e, Error);
      },
    },
  },
  
  'strategy handling a request without a params': {
    topic: function() {
      var strategy = new HashStrategy(function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.fail = function(info) {
          self.callback(null, info);
        }
        
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should fail authentication' : function(err, info) {
        // fail action was called, resulting in test callback
        assert.isTrue(true);
      },
      'should pass BadReqestError as additional info' : function(err, info) {
        assert.instanceOf(info, Error);
        assert.instanceOf(info, BadRequestError);
      },
    },
  },
  
  'strategy handling a request with params, but no hash': {
    topic: function() {
      var strategy = new HashStrategy(function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.fail = function(info) {
          self.callback(null, info);
        }
        
        req.params = {};
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should fail authentication' : function(err) {
        // fail action was called, resulting in test callback
        assert.isTrue(true);
      },
      'should pass BadReqestError as additional info' : function(err, info) {
        assert.instanceOf(info, Error);
        assert.instanceOf(info, BadRequestError);
      },
    },
  },
  
  'strategy constructed without a verify callback': {
    'should throw an error': function (strategy) {
      assert.throws(function() { new HashStrategy() });
    },
  },

}).export(module);
