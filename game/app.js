/**
 * Module dependencies.
 */
const express = require("express");
const logger = require('morgan');
const path = require('path');

/**
 * Route handlers.
 */
const home = require('./routes/home');
const about = require('./routes/about');

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */

//Some Middleware - log requests to the terminal console
app.use(logger('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/', express.static(path.join(__dirname, 'public')));

/**
 * Primary app routes.
 */
app.get('/', home.index);
app.get('/about', about.index);

/**
 * Start Express server.
 */
app.listen(3000);
console.log('Express started on port 3000');

module.exports = app;