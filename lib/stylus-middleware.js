/*!
 * DevServer
 * Copyright (c) 2014 Mathieu Civel <mathieu@civel.eu>
 * MIT Licensed
 */

var stylus  = require('stylus');
var compile = require('./compile-middleware');

module.exports = function(options) {

  //TODO handle options

  return compile({
    source_ext : '.styl',
    target_ext : '.css',
    compile : function(cssCode, callback) {
      stylus(cssCode).render(callback);
    }
  });

};
