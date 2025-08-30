const mongoose = require("mongoose");
const {ROLE} = require("../utils/enum")
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, default: "" },
    profilePicture: {
      type: String,
      default: "/static/image.png",
    },
    aadharNumber: { type: String, default: "" },
    role: { type: String, enum:ROLE },
    lastLogin: { type: Date },
  },
  { timestamps: true }
); 

module.exports = mongoose.model("User", userSchema);
  