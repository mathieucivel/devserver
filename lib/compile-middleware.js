/*!
 * DevServer
 * Copyright (c) 2014 Mathieu Civel <mathieu@civel.eu>
 * MIT Licensed
 */

//Middleware handling language compilation (coffee, stylus, less...).
//Does not write compiled file on the disk.
//Implement caching based on file modification time.

require('string.prototype.endswith');

var fs   = require('fs');
var url  = require('url');
var path = require('path');
var log  = require('./log');

module.exports = function(options) {

  //cache rendered target
  //  key   = target path
  //  value = {compiled : <string>, mtime : <int>}
  var cache = {};

  //source file extension to look for (.coffee, .styl)
  var source_ext = options.source_ext

  //will try to compile to the target matched extension (.js, .css)
  var target_ext = options.target_ext

  //compile function
  var compile = options.compile

  //middleware
  return function(req, res, next) {
    if (!source_ext || !target_ext || !compile) {
      log('missing options', 'red');
      next();
    }

    if ('GET' != req.method && 'HEAD' != req.method) {
      return next();
    }

    //get requested url
    var urlpath = url.parse(req.url).pathname;

    //only handle requests that match the language extension
    if (!urlpath.endsWith(target_ext)) {
      return next();
    }

    var source_path = urlpath.replace(/^\//, '').replace(target_ext, source_ext);
    var source_path = path.resolve(process.cwd(), source_path);

    //first look for source stats
    fs.stat(source_path, function(err, source_stat) {
      if (err) {
        if (err.code == 'ENOENT') {
          log(path.basename(source_path) + ' is not, will serve ' + target_ext);
          return next();
        }
        else {
          log('error reading source file', 'red');
          return next(err);
        }
      }

      //here the source exists and is accessible

      //check if it was cached
      if (cache[source_path]) {
        //compare modification times
        if (cache[source_path].mtime == +source_stat.mtime) {
          //not modified, serve cached file
          log(path.basename(source_path) + " has not changed, serve cache", 'blue');
          res.type(target_ext.replace('.', ''));
          res.send(cache[source_path].compiled);
          return;
        }
        else {
          log(path.basename(source_path) + " changed, recompile");
        }
      }

      //here the source is either not cached or modified, read the file
      fs.readFile(source_path, 'utf8', function(err, source_string) {
        if (err) {
          log('error reading source file', 'red');
          return next(err);
        }

        //compile and cache
        try {
          compile(source_string, function(err, compiled_str) {
            if (err) throw err;
            log(path.basename(source_path) + ' successfully compiled', 'green');
            cache[source_path] = {
              compiled : compiled_str,
              mtime    : +source_stat.mtime
            };
            res.type(target_ext.replace('.', ''));
            res.send(compiled_str);
          });

        }
        catch (err) {
          log('failed to compile', 'red');
          return next(err);
        }
      });  //end readFile

    });  //end fs.stat
  };  //end middleware
};  //end module
