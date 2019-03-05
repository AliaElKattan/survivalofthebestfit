/**
 * Module dependencies.
 */
const express = require("express");
const logger = require('morgan');
const path = require('path');

/**
 * Route handlers.
 */
const routes = require('./routes/routes');

/**
 * Create Express server. First line is required to compile Web assembly code for libsvm library.
 */
express.static.mime.types['wasm'] = 'application/wasm';
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
app.get('/', routes.HOME);
app.get('/about', routes.ABOUT);
app.get('/game', routes.GAME);
/**
 * Start Express server.
 */
app.listen(3000);
console.log('Express started on port 3000');

module.exports = app;
