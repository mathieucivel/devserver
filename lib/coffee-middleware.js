/*!
 * DevServer
 * Copyright (c) 2014 Mathieu Civel <mathieu@civel.eu>
 * MIT Licensed
 */

var coffee  = require('coffee-script');
var compile = require('./compile-middleware');

module.exports = function(options) {

  options = options || {bare : true};

  return compile({
    source_ext : '.coffee',
    target_ext : '.js',
    compile : function(jsCode, callback) {
      try {
        compiledJS = coffee.compile(jsCode, options);
      }
      catch (err) {
        return callback.call(this, err, compiledJS);
      }
      callback.call(this, null, compiledJS);
    }
  });

};
