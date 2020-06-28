var express = require('express');
var path = require('path');
var log4js = require('./config/log');

var indexRouter = require('./routes/index');

var app = express();

// log
// var logger = log4js.getLogger()
// app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO}))
// log for debug
var loggerDebug = log4js.getLogger(process.env.NODE_ENV || 'prod');

app.use((req, res, next) => {
  req.logger = loggerDebug
  next();
})

app.use('/', indexRouter);


module.exports = app;
