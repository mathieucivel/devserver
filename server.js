#!/usr/bin/env node

/*!
 * DevServer
 * Copyright (c) 2014 Mathieu Civel <mathieu@civel.eu>
 * MIT Licensed
 */

var path        = require('path');
var program     = require('commander');
var express     = require('express');
var tinylr      = require('tiny-lr');
var Gaze        = require('gaze').Gaze;
var livereload  = require('connect-livereload');
var coffeemw    = require('./lib/coffee-middleware');
var stylusmw    = require('./lib/stylus-middleware');

program
  .version('0.0.1')
  .option('-r, --root <path>', 'root directory to serve, default to current directory')
  .option('-p, --port <n>', 'port number, default 8000', parseInt)
  .option('-l, --livereload <n>', 'LiveReload port, default 35729')
  .parse(process.argv);


port    = program.port || 8000;
root    = program.root || '';
lr_port = program.livereload || 35729
root    = path.resolve(process.cwd(), root);

app = express();

//livereload server
lr = tinylr();
lr.listen(lr_port);
console.log('[devserver] Started LiveReload server on port ' + lr_port);

//watch files
var gaze = new Gaze();
gaze.on('error', function(error) {
  console.log('[devserver] Error in watching files', error);
});
gaze.on('ready', function(watcher) {
  console.log('[devserver] Started watching files for changes');
});
gaze.on('all', function(event, filepath) {
  console.log('[devserver] Reload ' + filepath);
  lr.changed({
    body : {
      files : [filepath]
    }
  });
});
gaze.add('**/*');

//simple logger
app.use(function(req, res, next){
  console.log('[devserver] %s %s', req.method, req.url);
  next();
});

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



app.listen(port);
console.log('[devserver] Serve ' + root + ' on http://localhost:' + port);
