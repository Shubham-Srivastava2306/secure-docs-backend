const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, registerUser, getProfile } = require('../controllers/authController');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', registerUser);
router.get('/profile/:aadhaar', getProfile);

module.exports = router;
