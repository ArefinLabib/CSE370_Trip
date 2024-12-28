const express = require('express');
const { register, login } = require('../controllers/user_auth_control'); // object destruture assignment to get registration and login functions

const router = express.Router();

// Access "exports.registration from the controller file"
router.post('/register', register);

// Access "exports.login from the controller file"
router.post('/login', login);

module.exports = router;