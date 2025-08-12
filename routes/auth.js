const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/register', authController.registerUser);
router.get('/profile/:aadhaar', authController.getProfile);

module.exports = router;
