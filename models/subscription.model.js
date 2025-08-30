const mongoose = require("mongoose");
const {PLAN_TYPE} = require("../utils/enum")

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  planType: {
    type: String,
    enum:PLAN_TYPE,
    required: true
  },
  
  
  expiryTime: {
    type: Date,
    default: null
  },
  propertyContactAvailable: {
    type: Number,
    // required: true
  },
  status: {
    type: String,   
    enum: ["active", "expired"],
    default: "active"
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true
  }
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
