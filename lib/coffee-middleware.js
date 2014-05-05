/*!
 * DevServer
 * Copyright (c) 2014 Mathieu Civel <mathieu@civel.eu>
 * MIT Licensed
 */

var fs     = require('fs');
var url    = require('url');
var path   = require('path');
var coffee = require('coffee-script');

module.exports = function(options) {

  var cache = {};
  var compile = coffee.compile;

  //middleware
  return function(req, res, next) {
    if ('GET' != req.method && 'HEAD' != req.method) return next();

    var urlpath = url.parse(req.url).pathname;

    //only handle .js files
    if (!/\.js$/.test(urlpath)) {
      return next();
    }

    var coffeepath = path.resolve(process.cwd(), urlpath.replace(/^\//, '').replace('.js', '.coffee'));
    console.log('[devserver] Coffee : try to read ' + coffeepath);

    //try to read the .coffee equivalent file
    //if it doesn't exist, call next() without error
    fs.readFile(coffeepath, 'utf8', function(err, code) {
      if (err) {
        if (err.code == 'ENOENT') {
          console.log('[devserver] Coffee : no coffescript file found, fallback to serve js ');
          return next();
        }
        else {
          console.log('[devserver] Coffee : error reading coffeescript file', err.message);
          return next(err);
        }
      }

      //try to compile to js
      try {
        console.log('[devserver] Coffee : compile ' + coffeepath);
        var js = compile(code, {bare : true});

        res.type('js');
        res.send(js);
      }
      catch (err) {
        console.log('[devserver] Coffee : failed to compile ', err.name, err.message);
        return next(err);
      }
    });  //end readFile
  };  //end middleware
};  //end module
