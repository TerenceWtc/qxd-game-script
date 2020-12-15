const express = require('express');
const path = require('path');
const ejs = require('ejs');
const logger = require('./log');
const router = require('./routes');

const app = express();

app.use((req, res, next) => {
    req.logger = logger;
    next();
});

app.use('/', router);

app.set('views', path.join(__dirname, '/views'));
app.engine('html', ejs.renderFile);
app.set('view engine', '.html');
app.set('json spaces', 4);

module.exports = app;
