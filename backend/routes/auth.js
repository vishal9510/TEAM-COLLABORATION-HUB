const express = require('express');
const { register, login, resetPassword, forgotPassword } = require('../controllers/auth.controller');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Forgot password - send reset token via email
router.post('/forgotpassword', forgotPassword);

// Reset password with token
router.put('/resetpassword/:token', resetPassword);

module.exports = router;

