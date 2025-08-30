const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/payment.model");
const Boast = require("../models/boast.model");
const Subscription = require("../models/subscription.model");
const BoastService = require("../services/boast.service");


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_wlGn1ZKuLEEXHF",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "lEegYxEsmYYhhiE1sUsY5QI8",
});

exports.createOrder = async (req, res) => {
    try {
      const { amount, currency = "INR" } = req.body;
      const options = {
        amount: amount * 100, // Razorpay accepts amount in paise (1 INR = 100 paise)
        currency,
        receipt: `order_rcpt_${Date.now()}`,
      };
  
      const order = await razorpay.orders.create(options);
      res.json({ success: true, order });
    } catch (error) {
      res.status(500).json({ success: false, message: "Order creation failed", error: error.message });
    }
  };
  

// Verify payment and store details
exports.verifyPayment = async (req, res) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, planTypeId,propertyId } = req.body;
      const userId = req.user._id;
      // Signature verification
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "lEegYxEsmYYhhiE1sUsY5QI8" )
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
  
      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: "Invalid signature, payment verification failed" });
      }
      console.log(generatedSignature,"comp",razorpay_signature)
      // Store payment details
      const payment = new Payment({
        userId,
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        razorpaySignature: razorpay_signature,
        amount,
        status: "success",
      });
  
      const savedPayment = await payment.save();
      console.log(savedPayment)
    // Call service to create subscription after successful payment
    const boastData = {
      propertyId: propertyId,
      planTypeId:planTypeId, // or "BASIC", "STANDARD" 
      paymentId: razorpay_payment_id
    };
     await BoastService.createBoast(userId,boastData);

    res.json({ success: true, message: "Payment successful", payment: savedPayment });
    } catch (error) {
      res.status(500).json({ success: false, message: "Payment verification failed", error: error.message });
    }
  };

exports.getMyTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    const payments = await Payment.find({ userId }).sort({ createdAt: -1 });

    const groupedByDate = {};

    for (const payment of payments) {
      const boost = await Boast.findOne({ paymentId: payment.razorpayPaymentId });
      const subscription = await Subscription.findOne({ paymentId: payment._id });

      let title = "Payment";
      if (boost) {
        title = `Boost Property (${boost.duration} Day${boost.duration > 1 ? 's' : ''})`;
      } else if (subscription) {
        title = "Contact Purchase";
      }

      const createdAt = payment.createdAt || new Date();

      const formattedDate = createdAt.toLocaleDateString("en-GB", {
        day: '2-digit', month: 'short', year: 'numeric'
      });

      const transaction = {
        title,
        txnId: payment.razorpayPaymentId,
        amount: `₹${payment.amount}`,
        status: payment.status,
        time: createdAt.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })
      };

      if (!groupedByDate[formattedDate]) {
        groupedByDate[formattedDate] = [];
      }
      groupedByDate[formattedDate].push(transaction);
    }

    return res.status(200).json({ success: true, data: groupedByDate });

  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};