var express = require("express");
var logger = require('morgan');
var app = express();

//Some Middleware - log requests to the terminal console
app.use(logger('dev'));
app.use(express.static(__dirname + '/static-website-content'));

app.get("*", function(request, response){
	response.render('static-website-content/index.html');
});

app.listen(3000);
console.log('Express started on port 3000');
