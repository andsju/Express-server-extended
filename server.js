'use strict';

var express = require('express');
var fs = require('fs');
var path = require('path');
var morgan = require('morgan');
var winston = require('winston');
var session = require('express-session');

// application log functions and settings
const logger = require('./configs/logger').logger;
const logDirectory = require('./configs/logger').logDirectory;
const logAccessStream = require('./configs/logger').logAccessStream;
const config = require('./configs/credentials');

var app = express();

/* --------------------------------------------------
 express middleware
 -------------------------------------------------- */

// log all requests to file
app.use(morgan('tiny', {
  stream: logAccessStream
}));

// log 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) {
    return res.statusCode < 400
  }
}));

// sessions
app.use(session({
  secret: config.session.sessionSecret,
  name: config.session.sessionName,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

// check sessions
app.get('*', function(req, res, next) {
  console.log(req.session);
  next();
})

/* --------------------------------------------------
 routes
 -------------------------------------------------- */
app.use("/", require("./routes/index.js"));
app.use("/about", require("./routes/about.js"));

/* --------------------------------------------------
 404 - not found
 Express has executed all middleware functions and routes, and found that none of them responded.
 -------------------------------------------------- */
app.use(function (req, res, next) {
  return res.status(404).send({
    message: '404 ' + req.url + ' Not found.'
  });
});

/* --------------------------------------------------
 500 - server error
 Express error handling takes a fourth argument as an error: (err, req, res, next)
 -------------------------------------------------- */
app.use(function (err, req, res, next) {
  logger.debug(err);
  return res.status(500).send({
    error: err
  });
});

app.listen(3000, function () {
  // console.log("Express server running");
  logger.info('Express server running - Hello world');
});