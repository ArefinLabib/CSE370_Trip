const express = require('express');
const { getLocations } = require('../controllers/location_control');
const router = express.Router();

router.get('/locations', getLocations);

module.exports = router;