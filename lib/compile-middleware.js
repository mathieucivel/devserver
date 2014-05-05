/*!
 * DevServer
 * Copyright (c) 2014 Mathieu Civel <mathieu@civel.eu>
 * MIT Licensed
 */

//Middleware handling language compilation (coffee, stylus, less...)
//Implement caching based on file modification time

require('string.prototype.endswith');

var fs     = require('fs');
var url    = require('url');
var path   = require('path');

module.exports = function(options) {

  //cache rendered stylus, TODO
  var cache = {};

  //source file extension to look for (.coffee, .styl)
  var source_ext = options.source_ext || ''

  //will try to compile to the target matched extension (.js, .css)
  var target_ext = options.target_ext || ''

  //compile function
  var compile = options.compile || function(source_string, callback) {
    console.warn('[devserver] no compilation function given to the compilation middleware');
  };

  //middleware
  return function(req, res, next) {
    if ('GET' != req.method && 'HEAD' != req.method) return next();

    var urlpath = url.parse(req.url).pathname;

    //only handle requests that match the given extension
    if (!urlpath.endsWith(target_ext)) {
      return next();
    }

    var source_path = urlpath.replace(/^\//, '').replace(target_ext, source_ext);
    var source_path = path.resolve(process.cwd(), source_path);
    console.log('[devserver] Compile %s : try to read %s', source_ext, source_path);

    //try to read the source file
    //if it doesn't exist, call next() without error
    fs.readFile(source_path, 'utf8', function(err, source_string) {
      if (err) {
        if (err.code == 'ENOENT') {
          console.log('[devserver] Compile %s : no souce file found, fallback to serve %s', source_ext, target_ext);
          return next();
        }
        else {
          console.log('[devserver] Compile %s : error reading source file', source_ext, err.message);
          return next(err);
        }
      }

      //try to compile
      try {
        compile(source_string, function(err, compiled_str) {
          if (err) throw err;
          console.log('[devserver] Compile %s : successfully compiled %s', source_ext, source_path);
          res.type(target_ext.replace('.', ''));
          res.send(compiled_str);
        });

      }
      catch (err) {
        console.log('[devserver] Compile %s : failed to compile ', source_ext, err.name, err.message);
        return next(err);
      }
    });  //end readFile
  };  //end middleware
};  //end module
