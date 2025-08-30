const mongoose = require("mongoose");
const { BOAST_TYPE } = require("../utils/enum");

const BoastSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true }, 
  planTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "BoastPlan", required: true },
  planType: { type: String, enum: BOAST_TYPE, required: true }, 
  duration: { type: Number, required: true },
  amount: { type: Number, required: true },
  paymentId: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  maxViews: { type: Number, required: true },
  viewedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Boast", BoastSchema);
