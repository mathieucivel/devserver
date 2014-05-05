/*!
 * DevServer
 * Copyright (c) 2014 Mathieu Civel <mathieu@civel.eu>
 * MIT Licensed
 */

var fs     = require('fs');
var url    = require('url');
var path   = require('path');
var stylus = require('stylus');

module.exports = function(options) {

  var cache = {};
  var compile = stylus;

  //middleware
  return function(req, res, next) {
    if ('GET' != req.method && 'HEAD' != req.method) return next();

    var urlpath = url.parse(req.url).pathname;

    //only handle .css files
    if (!/\.css$/.test(urlpath)) {
      return next();
    }

    var styluspath = path.resolve(process.cwd(), urlpath.replace(/^\//, '').replace('.css', '.styl'));
    console.log('[devserver] Stylus : try to read ' + styluspath);

    //try to read the .styl equivalent file
    //if it doesn't exist, call next() without error
    fs.readFile(styluspath, 'utf8', function(err, code) {
      if (err) {
        if (err.code == 'ENOENT') {
          console.log('[devserver] Stylus : no stylus file found, fallback to serve css ');
          return next();
        }
        else {
          console.log('[devserver] Stylus : error reading stylus file', err.message);
          return next(err);
        }
      }

      //try to compile to css
      try {
        compile(code).render(function(err, css) {
          if (err) {
            console.log('[devserver] Stylus : failed to compile ', err.name, err.message);
            return next(err);
          }
          console.log('[devserver] Stylus : render %s', styluspath);
          res.type('css');
          res.send(css);
        });

      }
      catch (err) {
        console.log('[devserver] Stylus : failed to compile ', err.name, err.message);
        return next(err);
      }
    });  //end readFile
  };  //end middleware
};  //end module
