const express = require("express");
const { sendOTPController, verifyOTPController,sendEmailOTP,verifyEmailOTP } = require("../controllers/authController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/send-otp", sendOTPController);

router.post("/verify-otp", verifyOTPController);

router.post("/send-email-otp",authMiddleware, sendEmailOTP);
router.post("/verify-email-otp", authMiddleware,verifyEmailOTP);
module.exports = router;
