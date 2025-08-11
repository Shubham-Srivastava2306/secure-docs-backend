const User = require('../models/User');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
// controllers/authController.js

// controllers/authController.js



// Send OTP (testing mode: return OTP in response)
// Send OTP (Login or Registration)
exports.sendOTP = async (req, res) => {
  try {
    const { aadhaar, purpose } = req.body;

    if (!aadhaar || aadhaar.length !== 12) {
      return res.status(400).json({ message: "Invalid Aadhaar number" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[aadhaar] = otp; // Store in memory or DB

    console.log(`✅ OTP for Aadhaar ${aadhaar}: ${otp}`);

    // Check if user exists
    const user = await User.findOne({ aadhaar });
    if (purpose === "login" && !user) {
      return res.status(404).json({ message: "User not registered" });
    }

    // ✅ Return OTP in response for testing
    res.status(200).json({
      message: "OTP sent successfully (testing mode)",
      otp // REMOVE THIS in production for security
    });

  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    res.status(500).json({ message: "Server error sending OTP" });
  }
};




// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { aadhaar, otp } = req.body;
  const user = await User.findOne({ aadhaar });

  if (!user || user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP or Aadhaar' });

  if (user.otpExpiresAt < new Date()) return res.status(400).json({ message: 'OTP has expired' });

  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  if (!user.name || !user.email || !user.dob) {
    return res.status(200).json({ message: 'OTP verified. Please complete registration.', registerRequired: true });
  }

  res.status(200).json({ message: 'Login successful', aadhaar });
};

// Register user after OTP
exports.registerUser = async (req, res) => {
  const { aadhaar, name, email, dob } = req.body;
  let user = await User.findOne({ aadhaar });

  if (!user) return res.status(400).json({ message: 'OTP verification required before registration' });

  user.name = name;
  user.email = email;
  user.dob = dob;
  await user.save();

  res.status(200).json({ message: 'Registration successful', aadhaar });
};

// Get profile
exports.getProfile = async (req, res) => {
  const { aadhaar } = req.params;
  const user = await User.findOne({ aadhaar }, '-otp -otpExpiresAt');

  if (!user) return res.status(404).json({ message: 'User not found' });

  res.status(200).json({ profile: user });
};
