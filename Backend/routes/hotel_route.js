const express = require('express');
const { getHotelDetails, addServiceReview, getServiceReviews } = require('../controllers/hotel_controller');
const { authenticate } = require('../Middleware/auth');
const router = express.Router();

router.get('/details', getHotelDetails);
router.post('/addreview', authenticate, addServiceReview);
router.get('/reviews', getServiceReviews);

module.exports = router;