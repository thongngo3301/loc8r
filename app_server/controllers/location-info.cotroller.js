var request = require('request');
var apiOptions ={
    server: 'http://localhost:5000'
};
if(process.env.NODE_ENV === 'production'){
    apiOptions.server = 'https://loc8rr.herokuapp.com';
};

var getLocationInfo = function(req,res,callback){
    var requestOptions,path;
    path = '/api/locations/' + req.params.locationId;

    requestOptions= {
        url: apiOptions.server + path,
        method: 'GET',
        json: {},
        qs: {}
    };

    request(requestOptions, function(err,response,body){
        if(response.statusCode === 200){
            callback(req,res,body);
        }else{
            _showError(req,res,response.statusCode);
        }
    });
}

var location = {
    title: "Loc8r",
    pageHeader:{
      title:"",
      strapline: ""
    },
    locationInfo:{}
}
module.exports.locationInfo = function(req,res){
    getLocationInfo(req,res,function(req,res,data){
        renderLocationInfo(req,res,data);
    });
}

/*Rendering the Homepage*/
var  renderLocationInfo = function (req,res,responseBody) {
    location.pageHeader.title = responseBody.name;
    location.locationInfo = responseBody;
    res.render('location-info',location);
}

var _showError = function (req,res,statusCode) {
    var title, content;
    if(statusCode === 404){
        title = '404, Page not found',
        content = "Oh dear. Looks like we can't find this page. Sorry." 
    }else{
        title = statusCode + ", something went wrong",
        content = 'Something, somewhere, has gone just a little bit wrong.'
    }
    res.status(statusCode);
    res.render('error',{
        title: 'Error',
        content: content,
        pageHeader: {
            title: title,
            strapline: ''
        }
    });
};

/*Add Review*/
module.exports.addReview = function(req,res){
    getLocationInfo(req,res,function (req,res,data) {
        renderReviewForm(req,res,data);
    })
}
/*Rendering review form*/
var renderReviewForm = function(req,res,location){
    res.render('location-review-form',{
        title: location.name,
        pageHeader:{
            title: 'Review ' + location.name,
            strapline: ''
        },
        error: req.query.err,
        url: req.originalUrl
    });
};
/*Post method to add new review*/
module.exports.doAddReview = function (req,res) {
    var requestOptions,path,locationId, postdata;
    locationId = req.params.locationId;
    path = '/api/locations/'+locationId+'/reviews';
    postdata = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: 'POST',
        json: postdata
    };
    if(!postdata.author || !postdata.rating || !postdata.reviewText){
        res.redirect('/location/'+locationId+'/reviews/new?err=val');
    }else{
        request(requestOptions,function (err,response,body) {
            if(!response){
                _showError(req,res,500);
            }
            if(response.statusCode === 201){
                res.redirect('/location/'+ locationId);
            }else{
                _showError(req,res,response.statusCode);
            }
        });
    };
}   