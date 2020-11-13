const express = require('express');
const logger = require('./log');
const router = require('./routes');

const app = express();

app.use((req, res, next) => {
    req.logger = logger;
    next();
});

app.use('/', router);

module.exports = app;
