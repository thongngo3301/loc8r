var express = require("express");
var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
require('./app_api/models/db');
var app = express();

//views engine set up
app.set("view engine","jade");
app.set("views",path.join(__dirname,"app_server","views"));

//favicon
//app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));


var router = require('./app_server/routes/index');
app.use('/', router);
var routerAPI = require('./app_api/routes/index');
app.use('/api',routerAPI);

/*Error catching and handling*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
    		title: 'ERROR',
    		pageHeader:{
    			title: err.status,
    			strapline: 'Something went wrong.'
    		},
      	  content: 'ERROR message: ' + err.message,
      	  error: {}
   		});
    });
};

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
    	title: 'ERROR',
    	pageHeader:{
    		title: err.status,
    		strapline: ''
    	},
        content: err.message,
        error: {}
    });
});

module.exports = app;
