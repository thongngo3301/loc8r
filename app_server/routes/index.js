var express = require('express');
var router = express.Router(); 

var homeCtrl = require('../controllers/home.controller');
var locationInfoCtrl = require('../controllers/location-info.cotroller');

router.get("/",homeCtrl.homeList);
router.get("/location/:locationId",locationInfoCtrl.locationInfo);
router.get('/location/:locationId/reviews/new',locationInfoCtrl.addReview);
router.post('/location/:locationId/reviews/new',locationInfoCtrl.doAddReview);
router.get("/about", ctrlOthers.angularApp);

module.exports = router;
