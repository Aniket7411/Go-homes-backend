const User = require("../models/User");
const { sendOTP, verifyOTP } = require("../utils/otpUtils");
const Otp = require("../models/Otp");
const sendOTPEmail = require("../services/emailService");

const jwt = require("jsonwebtoken");
const SECRET_KEY = "Tdrdfs@23fv4$ddfdf#@@993e3%%ssDadss";

const TEST_PHONE_NUMBER = "919999999999";
const FIXED_OTP = "123456";


exports.sendOTPController = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    console.log("pjhone",phoneNumber)

    if (!phoneNumber) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber });
      await user.save();
    }

    if (phoneNumber === TEST_PHONE_NUMBER) {
      return res.status(200).json({ message: "OTP sent successfully (test mode)" });
    }

    await sendOTP(phoneNumber);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

exports.verifyOTPController = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: "Phone number and OTP are required" });
    }

    // const isValid = await verifyOTP(phoneNumber, otp);
     if (phoneNumber === TEST_PHONE_NUMBER && otp === FIXED_OTP) {
      isValid = true;
    } else {
      isValid = await verifyOTP(phoneNumber, otp);
    }
    if (!isValid) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber });
      await user.save();
    }
 
    const token = jwt.sign({ userId: user._id, phoneNumber: user.phoneNumber }, SECRET_KEY, { expiresIn: "30d" });

    res.status(200).json({ message: "OTP verified successfully",token, user });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};


// Generate a random 4-digit OTP
const generateRandomOTP = () => Math.floor(1000 + Math.random() * 9000);

// 1️⃣ Send OTP to Email
exports.sendEmailOTP = async (req, res) => {
  const phoneNumber = req.user.phoneNumber
  const { email } = req.body;
  if (!phoneNumber || !email) {
    return res.status(400).json({ error: "Phone number and email are required" });
  }
  try {
    // 🔍 Check if User Exists
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.email) {
      return res.status(400).json({ error: "Email already verified" });
    }

    const existingOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (existingOtp) {
      const timeDiff = (Date.now() - existingOtp.createdAt.getTime()) / 1000; // in seconds
      if (timeDiff < 120) {
        return res.status(429).json({ error: "OTP already sent. Please wait before requesting again." });
      }
    }

    const otp = generateRandomOTP();

    console.log(`Generated OTP for ${email}: ${otp}`)

   await Otp.create({ email, otp });
    // Send OTP to email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// 2️⃣ Verify OTP
exports.verifyEmailOTP = async (req, res) => {
  const phoneNumber = req.user.phoneNumber
  const { email, otp } = req.body;
  if (!phoneNumber || !otp || !email) {
    return res.status(400).json({ error: "Phone number, OTP and Email are required" });
  }

  try {
    const otpEntry = await Otp.findOne({ email, otp });

    if (!otpEntry) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const timeDiff = (Date.now() - otpEntry.createdAt.getTime()) / 1000;
    if (timeDiff > 120) {
      return res.status(400).json({ error: "OTP expired" });
    }

    await User.updateOne({ phoneNumber }, { email });
    // Delete OTP after successful verification
    await Otp.deleteOne({ _id: otpEntry._id });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};
