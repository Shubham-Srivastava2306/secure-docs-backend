const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  aadhaar: { type: String, required: true, unique: true },
  dob: String,
  otp: String,
  otpExpiresAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
