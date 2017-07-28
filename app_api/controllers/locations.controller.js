var mongoose = require('mongoose');
var User = mongoose.model('User');
//take Location models
Loc = mongoose.model('Location');

var sendJSONresponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

var unitTrans = {
  mToKm : function (distance) {
    return parseFloat(distance/1000);
  },
  kmToM : function (distance){
    return parseFloat(distance*1000);
  }
}

var theEarth = (function() {
  var earthRadius = 6371; // km, miles is 3959

  var getDistanceFromRads = function(rads) {
    return parseFloat(rads * earthRadius);
  };

  var getRadsFromDistance = function(distance) {
    return parseFloat(distance / earthRadius);
  };

  return {
    getDistanceFromRads: getDistanceFromRads,
    getRadsFromDistance: getRadsFromDistance
  };
})();

/*Get locations*/
module.exports.locationsListByDistance = function(req, res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var maxDistance = parseFloat(req.query.maxDistance);
  var point = {
    type: "Point",
    coordinates: [lng , lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: /*theEarth.getRadsFromDistance(maxDistance)*/ parseFloat(unitTrans.kmToM(maxDistance)),
    num: 10
  };
  if ((!lng && lng!==0) || (!lat && lat !== 0) || !maxDistance) {
    console.log('locationsListByDistance missing params');
    sendJSONresponse(res, 404, {
      "message": "lng, lat and maxDistance query parameters are all required"
    });
    return;
  }
  Loc.geoNear(point, geoOptions, function(err, results, stats) {
    var locations;
    console.log('Geo Results', results);
    console.log('Geo stats', stats);
    if (err) {
      console.log('geoNear error:', err);
      sendJSONresponse(res, 404, err);
    } else {
      locations = buildLocationList(req, res, results, stats);
      sendJSONresponse(res, 200, locations);
    }
  });
};

var buildLocationList = function(req, res, results, stats) {
  var locations = [];
  results.forEach(function(doc) {
    locations.push({
      distance: /*theEarth.getDistanceFromRads(doc.dis)*/ parseFloat(unitTrans.mToKm(doc.dis)),
      name: doc.obj.name,
      address: doc.obj.address,
      rating: doc.obj.rating,
      facilities: doc.obj.facilities,
      _id: doc.obj._id
    });
  });
  return locations;
};

/* GET a location by the id */
module.exports.locationsReadOne = function(req, res) {
  console.log('Finding location details', req.params);
  if (req.params && req.params.locationid) {
    Loc
      .findById(req.params.locationid)
      .exec(function(err, location) {
        if (!location) {
          sendJSONresponse(res, 404, {
            "message": "locationid not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(location);
        sendJSONresponse(res, 200, location);
      });
  } else {
    console.log('No locationid specified');
    sendJSONresponse(res, 404, {
      "message": "No locationid in request"
    });
  }
};
module.exports.locationsCreate = function (req,res) {
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(",")/*['foods','drinks']*/,
    coords: [parseFloat(req.body.lng /*-0.9690882*/), parseFloat(req.body.lat/*51.455043*/)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1/*false*/,
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2/*false*/,
    }]
  }, function(err, location) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(location);
      sendJSONresponse(res, 201, location);
    }
  });
};

/*Get reviews*/
module.exports.getReviewsOne = function(req,res){
  if(req.params && req.params.locationId){
    Loc
      .findById(req.params.locationId)
      .select('name reviews')
      .exec(function(err,location){
        var response,review;
         if(!location){
           sendJSONresponse(res, 404, {
             'message': 'locationid not found'
           });
           return;
         }else if(err){
           sendJSONresponse(res, 404, err);
           return;
         }
         if(location.reviews && location.reviews.length > 0){
           review = location.reviews.id(req.params.reviewId);
           if(!review){
             sendJSONresponse(res,404,{
               'message' : 'reviewId not found'
             });;
           } else{
             response = {
               location:{
                 name : location.name,
                 id : req.params.locationId
               },
               review: review
             };
             sendJSONresponse(res,200, response);
           }
         }else{
           sendJSONresponse(res,404,{
             'message' : 'No reviews found'
           })
         }
      })
  }else{
     sendJSONresponse(res,404,{
       'message':'No locationid in request'
     })
  }
}
/*Create new review*/
module.exports.reviewCreate = function(req,res){
  getAuthor(req, res, function (req, res, userName) {
    var locationid = req.params.locationId;
    if(locationid){
      Loc
        .findById(locationid)
        .select('reviews')
        .exec(function (err,location) {
          if(err){
            sendJSONresponse(res,400,err);
          }else{
            doAddReview(req, res, location, userName);
          }
      });
    }else{
      sendJSONresponse(res,404,{
        'message'  : 'Not found, locationid required'
      });
    }
  });
};

var getAuthor = function (req, res, callback) {
  if (req.payload && req.payload.email) {
    User
      .findOne ({ email: req.payload.email })
      .exec (function (err, user) {
        if (!user) {
          sendJSONresponse(res, 404, {
            "message": "User not found"
          });
          return;
        }
        else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        callback(req, res, user.name);
      });
  }
  else {
    sendJSONresponse(res, 404, {
      "message": "User not found"
    });
    return;
  }
};

function doAddReview (req, res, location, author) {
  if(!location){
    sendJSONresponse(res, 404, {
      'message': 'locationid not found'
    });
  }else{
    location.reviews.push({
      author : author,
      rating : req.body.rating,
      reviewText : req.body.reviewText
    });
    location.save(function (err,location) {
      var thisReview;
      if(err){
        sendJSONresponse(res,400,err);
      }else{
        updateAverageRating(location._id);
        thisReview = location.reviews[location.reviews.length -1];
        sendJSONresponse(res,201,thisReview);
      };
    });
  };
};

function updateAverageRating (locationid) {
  Loc
    .findById(locationid)
    .select('rating reviews')
    .exec(function (err,location) {
      if(err){
        sendJSONresponse(res,404,{
          'message':'locationid not found to calculate rating avg'
        });
      }else{
        doSetAverageRating(location);
      };
    });
};

function doSetAverageRating (location) {
  var i, reviewsCount, ratingAvg, ratingTotal;
  if(location.reviews && location.reviews.length > 0){
    reviewsCount = location.reviews.length;
    ratingTotal = 0;
    for(i=0 ; i<reviewsCount ; i++){
      ratingTotal += location.reviews[i].rating;
    }
    ratingAvg = parseInt(ratingTotal / reviewsCount,10);
    location.rating = ratingAvg;
    location.save(function (err) {
      if(err){
        console.log('ERROR when save avg rating'+err);
      }else{
        console.log('Average Rating updated to', ratingAvg);
      }
    });
  }
};