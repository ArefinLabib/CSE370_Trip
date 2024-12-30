const express = require('express');
const { authenticate } = require('../Middleware/auth'); // Auth middleware
const {getUserBusinesses, deleteRequest, addRequest, editRequest} = require('../controllers/business_controller');

const router = express.Router();

// Get all businesses owned by the user
router.get('/getUserBusinesses', authenticate, getUserBusinesses);

// Request to add a business
router.post('/addRequest', authenticate, addRequest);

// Delete a business
router.delete('/deleteRequest/:serviceID', authenticate, deleteRequest);
// router.delete('/delete/:serviceID', authenticate, deleteBusiness);

// edit request
router.put('/editRequest/:serviceID', authenticate, editRequest);

module.exports = router;
