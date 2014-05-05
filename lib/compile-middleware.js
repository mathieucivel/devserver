/*!
 * DevServer
 * Copyright (c) 2014 Mathieu Civel <mathieu@civel.eu>
 * MIT Licensed
 */

//Middleware handling language compilation (coffee, stylus, less...)
//Implement caching based on file modification time

require('string.prototype.endswith');

var fs   = require('fs');
var url  = require('url');
var path = require('path');

module.exports = function(options) {

  //cache rendered stylus, TODO
  var cache = {};

  //source file extension to look for (.coffee, .styl)
  var source_ext = options.source_ext

  //will try to compile to the target matched extension (.js, .css)
  var target_ext = options.target_ext

  //compile function
  var compile = options.compile

  var log = require('./log')('Compile ' + source_ext);

  //middleware
  return function(req, res, next) {
    if (!source_ext || !target_ext || !compile) {
      log('missing options', 'red');
      next();
    }

    if ('GET' != req.method && 'HEAD' != req.method) {
      return next();
    }

    var urlpath = url.parse(req.url).pathname;

    //only handle requests that match the given extension
    if (!urlpath.endsWith(target_ext)) {
      return next();
    }

    var source_path = urlpath.replace(/^\//, '').replace(target_ext, source_ext);
    var source_path = path.resolve(process.cwd(), source_path);
    log('try to read ' + path.basename(source_path));

    //try to read the source file
    //if it doesn't exist, call next() without error
    fs.readFile(source_path, 'utf8', function(err, source_string) {
      if (err) {
        if (err.code == 'ENOENT') {
          log('no souce file found, fallback to serve ' + target_ext);
          return next();
        }
        else {
          log('error reading source file', 'red');
          return next(err);
        }
      }

      //try to compile
      try {
        compile(source_string, function(err, compiled_str) {
          if (err) throw err;
          log('successfully compiled ' + path.basename(source_path), 'green');
          res.type(target_ext.replace('.', ''));
          res.send(compiled_str);
        });

      }
      catch (err) {
        log('failed to compile', 'red');
        return next(err);
      }
    });  //end readFile
  };  //end middleware
};  //end module
