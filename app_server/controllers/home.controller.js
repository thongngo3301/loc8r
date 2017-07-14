var request = require('request');
var apiOptions ={
    server: 'http://localhost:5000'
};
if(process.env.NODE_ENV === 'production'){
    apiOptions.server = 'https://salty-anchorage-74282.herokuapp.com';
};

var HomeList = {
    title: "Loc8r",
    pageHeader:{
      title:"List locations",
      strapline: "this is a strapline!"
    },
    locations : [],
    message : null
};
module.exports.homeList = function(req,res){
    var requestOptions, path;
    path = '/api/locations';
    requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        json: {},
        qs : {
            //lng : -0.969212,
            lng: 105.7879486,
            //lat : 51.45504102,
            lat: 21.0423793,
            maxDistance : 20
        }
    };

    request(requestOptions,function (err,response,body) {
        var i,data;
        data = body;
        if(response.statusCode === 200 && data.length){
            for(i=0; i<data.length; i++){
                data[i].distance = _formatDistance(data[i].distance);
            }
        }
        renderHomepage(req,res,data);
    })
}

var _formatDistance = function (distance) {
    var numDistance, unit;
    if(distance > 1){
        numDistance = parseFloat(distance).toFixed(1);
        unit = 'km';
    } else {
        numDistance = parseInt(distance * 1000 , 10);
        unit = 'm';
    }
    return numDistance + unit;
}

/*Rendering the Homepage*/
var  renderHomepage = function (req,res,responseBody) {
    var message;
    if(!(responseBody instanceof Array)){
        message = 'API lookup error';
        responseBody = [];
    }else{
        if(!responseBody.length){
            message = 'No places found nearby';
        }
    }
    HomeList.locations = responseBody;
    HomeList.message = message;
    res.render('home',HomeList);
}