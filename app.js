var express = require("express");
var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
require('./app_api/models/db');
var uglifyJs = require('uglify-js');
var fs = require('fs');
var app = express();

//views engine set up
app.set("views",path.join(__dirname,"app_server","views"));
app.set("view engine","jade");
var appClientFiles ={ 
    'app.js': fs.readFileSync('app_client/app.js','utf8'),
    'home.controller.js': fs.readFileSync('./app_client/home/home.controller.js','utf8'),
    'geolocation.service.js': fs.readFileSync('./app_client/common/services/geolocation.service.js','utf8'),
    'loc8rData.service.js': fs.readFileSync('./app_client/common/services/loc8rData.service.js','utf8'),
    'formatDistance.filter.js': fs.readFileSync('./app_client/common/filters/formatDistance.filter.js','utf8'),
    'ratingStars.directive.js': fs.readFileSync('./app_client/common/directives/ratingStars/ratingStars.directive.js','utf8'),
    'footerGeneric.directive.js' : fs.readFileSync('./app_client/common/directives/footerGeneric/footerGeneric.directive.js','utf8'),
    'navigation.directive.js' : fs.readFileSync('./app_client/common/directives/navigation/navigation.directive.js','utf8'),
    'pageHeader.directive.js' : fs.readFileSync('./app_client/common/directives/pageHeader/pageHeader.directive.js','utf8')
};
var uglified = uglifyJs.minify(appClientFiles, { compress : false });
//var a = uglifyJs.minify({  'app.js': fs.readFileSync('./app_client/app.js','utf8')  });  console.log(a.code);
fs.writeFile('public/angular/loc8r.min.js', uglified.code, function(err) {
    if(err) {
        console.log(err);
    }
    else {
        console.log('Script generated and saved: loc8r.min.js');
    }
});

//favicon
//app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.static(path.join(__dirname,"app_client")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));


//var router = require('./app_server/routes/index');
//app.use('/', router);
var routerAPI = require('./app_api/routes/index');
app.use('/api',routerAPI);

app.use(function(req, res) {
    res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});

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
