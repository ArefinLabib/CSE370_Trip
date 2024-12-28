const express = require('express');
const { getPendingRequests, handleRequest } = require('../controllers/admin_control');
const { authenticate } = require('../Middleware/auth');

const router = express.Router();

router.get('/getPendingRequests', authenticate, getPendingRequests);
router.put('/handleRequest/:requestID', authenticate, handleRequest);

module.exports = router;