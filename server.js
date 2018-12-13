'use strict';

var express = require('express');
var fs = require('fs');
var path = require('path');
var morgan = require('morgan');
var winston = require('winston');

// application log functions and settings
const logger = require('./config/logger').logger;
const logDirectory = require('./config/logger').logDirectory;
const logAccessStream = require('./config/logger').logAccessStream;

var app = express();

// log all requests to file
app.use(morgan('tiny', {stream: logAccessStream}));

// log 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}));


/* app.get('/', function(req, res){
  res.send('Hello World');
  logger.info('Hello world get root');
});
 */

/* --------------------------------------------------
 routes
 -------------------------------------------------- */
app.use("/", require("./routes/index.js"));
app.use("/about", require("./routes/about.js"));

/* --------------------------------------------------
 404
 -------------------------------------------------- */
app.use(function(req, res, next) {
  return res.status(404).send({ message: '404 '+req.url+' Not found.' });
});

/* --------------------------------------------------
 500 - server error
 -------------------------------------------------- */
app.use(function(err, req, res, next) {
  return res.status(500).send({ error: err });
});

app.listen(3000, function() {
  // console.log("Express server running");
  logger.info('Express server running - Hello world');
});