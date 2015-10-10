'use strict';

let express = require('express');
let path = require('path');

let routes = require('./routes/index');

let app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Contents
app.use('/', routes);
app.use('/', express.static(path.join(__dirname, 'public')));

// 404
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 404 || 500
if (app.get('env') === 'development') {
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

module.exports = app;
