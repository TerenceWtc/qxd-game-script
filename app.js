/*global process*/
var express = require('express');
var log4js = require('./config/log');

var indexRouter = require('./routes/index');

var app = express();

var loggerDebug = log4js.getLogger(process.env.NODE_ENV || 'default');

app.use((req, res, next) => {
  req.logger = loggerDebug
  next();
})

app.use('/', indexRouter);


module.exports = app;
