const User = require('../models/User');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
// controllers/authController.js

// controllers/authController.js



// Send OTP (testing mode: return OTP in response)
exports.sendOTP = async (req, res) => {
  try {
    const { aadhaar, purpose } = req.body;

    if (!aadhaar) {
      return res.status(400).json({ message: "Aadhaar is required" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min validity

    // Check if user exists
    let user = await User.findOne({ aadhaar });

    if (purpose === "register") {
      if (user) return res.status(400).json({ message: "User already registered" });

      user = new User({ aadhaar, otp, otpExpiresAt });
      await user.save();
    } else if (purpose === "login") {
      if (!user) return res.status(404).json({ message: "User not registered" });

      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();
    } else {
      return res.status(400).json({ message: "Invalid purpose" });
    }

    console.log(`📩 OTP for ${aadhaar}: ${otp}`); // still logs to backend console

    // ✅ Send OTP back in API response for testing
    res.json({ message: "OTP sent successfully", otp });

  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error" });
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
