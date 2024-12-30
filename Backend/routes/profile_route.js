const express = require('express');
const { getUserProfile } = require('../controllers/profile_control');
const { authenticate } = require('../Middleware/auth');

const router = express.Router();

router.get('/profile', authenticate, getUserProfile);

module.exports = router;