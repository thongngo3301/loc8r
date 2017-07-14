var express = require('express');
var router = express.Router();
//controller
var locationCtrl = require('../controllers/locations.controller');

//locations
router.get('/locations',locationCtrl.locationsListByDistance);
router.get('/locations/:locationid',locationCtrl.locationsReadOne);
router.post('/locations',locationCtrl.locationsCreate);

//reviews
router.get('/locations/:locationId/reviews/:reviewId',locationCtrl.getReviewsOne);
router.post('/locations/:locationId/reviews',locationCtrl.reviewCreate);

//exports router
module.exports = router;
