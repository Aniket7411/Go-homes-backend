const nodemailer = require("nodemailer");
require("dotenv").config();

EMAIL_USER="deepakinf30@gmail.com"
EMAIL_PASS= "slfs fcoq pygu aevz"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;
