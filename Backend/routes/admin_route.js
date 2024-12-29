const express = require('express');
const { getPendingRequests, handleDeleteRequest, handleRequest, rejectRequest } = require('../controllers/admin_control');
const { authenticate } = require('../Middleware/auth');

const router = express.Router();

router.get('/getPendingRequests', authenticate, getPendingRequests);
router.put('/handleRequest/:requestID', authenticate, handleRequest);
router.delete('/handleDeleteRequest/:requestID', authenticate, handleDeleteRequest);
router.put('/rejectRequest/:requestID', authenticate, rejectRequest);

module.exports = router;