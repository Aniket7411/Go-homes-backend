// models/BoastPlan.js

const mongoose = require("mongoose");

const BoastPlanSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["BASIC", "STANDARD", "PREMIUM"],
    unique: true,
    required: true,
  },
  duration: { type: Number, required: true }, // in days
  maxViews: { type: Number, required: true },
  amount: { type: Number, required: true }, // in your currency
}, { timestamps: true });

module.exports = mongoose.model("BoastPlan", BoastPlanSchema);
