'use strict';

let express = require('express');
let path = require('path');

//let bodyParser = require('body-parser');    // Moved to route-specific

let routes = require('./routes/index');

let app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middlewares
//app.use(bodyParser.urlencoded({ extended: false }));    // Moved to route-specific
app.use('/', express.static(path.join(__dirname, 'public')));

// Contents
app.use('/', routes);

// 404
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 404 || 500
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

module.exports = app;
