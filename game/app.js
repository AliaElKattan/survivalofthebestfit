const express = require('express');
const logger = require('morgan');
const path = require('path');
const textFile = require('../public/game/assets/text/textTemplate.js');

// EXPRESS
const app = express();
app.use(logger('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/', express.static(path.join(__dirname, 'public')));

// ROUTES
app.get('/', res.render('pages/game', textFile));

// START
app.listen(process.env.PORT || 3000, '0.0.0.0', function() {
    console.log('Listening to port:  ' + 3000);
});

module.exports = app;
