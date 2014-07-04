#!/usr/bin/env node

/*!
 * DevServer
 * Copyright (c) 2014 Mathieu Civel <mathieu@civel.eu>
 * MIT Licensed
 */

var path       = require('path');
var program    = require('commander');
var express    = require('express');
var request    = require('request');
var tinylr     = require('tiny-lr');
var Gaze       = require('gaze').Gaze;
var livereload = require('connect-livereload');
var coffeemw   = require('./lib/coffee-middleware');
var stylusmw   = require('./lib/stylus-middleware');
var log        = require('./lib/log');

var proxylist = function(values) {
  return values.split(',');
};

program
  .version('0.0.1')
  .option('-r, --root <path>', 'root directory to serve, default to current directory')
  .option('-p, --port <n>', 'port number, default 8000', parseInt)
  .option('-d, --domain <domain_or_ip>', 'domain or ip to listen to, default localhost')
  .option('-l, --livereload <n>', 'LiveReload port, default 35729')
  .option('-P, --proxy <http://domain:port,path1,path2,...>', 'The given list of path will be forwarded to the given url', proxylist)
  .parse(process.argv);


port    = program.port || 8000;
root    = program.root || '';
domain  = program.domain || 'localhost';
lr_port = program.livereload || 35729
root    = path.resolve(process.cwd(), root);

app = express();

//livereload server
lr = tinylr();
lr.listen(lr_port);
log('Started LiveReload server on port ' + lr_port);

//watch files
var gaze = new Gaze();
gaze.on('error', function(error) {
  log('Error in watching files', 'red');
});
gaze.on('ready', function(watcher) {
  log('Started watching files for changes');
});
gaze.on('all', function(event, filepath) {
  log('------------------------------');
  log('Reload ' + filepath);
  lr.changed({
    body : {
      files : [filepath]
    }
  });
});
gaze.add(['**/*.*', '!vendor/**/*', '!node_modules/**/*', '!bower_components/**/*']);
/*
gaze.watched(function(err, files) {
  console.log(files);
})
*/

//simple logger
/* * /
app.use(function(req, res, next){
  log(req.method + ' ' + req.url);
  next();
});
/* */

//livereload
app.use(livereload({
  port : lr_port
}));

//coffeescript
app.use(coffeemw());

//stylus
app.use(stylusmw());

//static
app.use(express.static(root));

//error handler
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

//proxy
if (program.proxy) {
  //console.log(program.proxy);
  target_url = program.proxy.splice(0, 1);
  for (var i = 0; i < program.proxy.length; i++) {
    app.get(program.proxy[i], function (req, res) {
      log("Proxying to " + target_url + req.url, 'yellow');
      req.pipe(request(target_url + req.url)).pipe(res);
    });

  }
}


app.listen(port, domain);
console.log('[devserver] '.grey + 'Serve ' + root.italic + ' on ' + ('http://' + domain + ':' + port).underline);
