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

// log all requests to log file
app.use(morgan('tiny', {stream: logAccessStream}));

// log 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

app.get('/', function(req, res){
  res.send('Hello World');
  logger.info('Hello world get root');
});

app.listen(3000, function() {
  // console.log("Express server running");
  logger.info('Express server running - Hello world');
});