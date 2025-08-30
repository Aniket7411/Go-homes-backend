const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  razorpayPaymentId: { type: String, required: true },
  razorpayOrderId: { type: String, required: true },
  razorpaySignature: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["success", "failed", "pending"],
    default: "pending"          
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model("Payment", PaymentSchema);
