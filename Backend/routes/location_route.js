const express = require('express');
const { getLocations, getLocationDetails, getLocationReviews, getLocationServices, addLocationReview} = require('../controllers/location_control');
const {authenticate} = require('../Middleware/auth');
const router = express.Router();

router.get('/locations', getLocations);
router.get('/details', getLocationDetails);
router.get('/reviews', getLocationReviews);
router.get('/services', getLocationServices);
router.post('/addReview', authenticate, addLocationReview);

module.exports = router;