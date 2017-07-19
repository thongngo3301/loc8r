var request = require('request');
var apiOptions ={
    server: 'http://localhost:5000'
};
if(process.env.NODE_ENV === 'production'){
    apiOptions.server = 'https://loc8rr.herokuapp.com';
};

var HomeList = {
    title: "Loc8r",
    pageHeader:{
      title:"Loc8r",
      strapline: "Find your nearby places and get some work done"
    },
    locations : [],
    message : null
};
module.exports.homeList = function(req,res){
    // var requestOptions, path;
    // path = '/api/locations';
    // requestOptions = {
    //     url: apiOptions.server + path,
    //     method: 'GET',
    //     json: {},
    //     qs : {
    //         //lng : -0.969212,
    //         lng: 105.7879486,
    //         //lat : 51.45504102,
    //         lat: 21.0423793,
    //         maxDistance : 20
    //     }
    // };

    // request(requestOptions,function (err,response,body) {
    //     var i,data;
    //     data = body;
    //     if(response.statusCode === 200 && data.length){
    //         for(i=0; i<data.length; i++){
    //             data[i].distance = _formatDistance(data[i].distance);
    //         }
    //     }
        renderHomepage(req,res);
};

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
    res.render('home', {
        title: 'Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for."
    });
}