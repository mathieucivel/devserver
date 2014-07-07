/*!
 * DevServer
 * Copyright (c) 2014 Mathieu Civel <mathieu@civel.eu>
 * MIT Licensed
 */

var less  = require('less');
var compile = require('./compile-middleware');

module.exports = function(options) {

  //TODO handle options

  return compile({
    source_ext : '.less',
    target_ext : '.css',
    compile : function(cssCode, callback) {
      less.render(cssCode, callback);
    }
  });

};
