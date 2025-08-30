const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
  occupationType: {
    type: String,
    enum: ["salaried", "self-emplyed", "businessman"],
    required: true,
  },
  employerName: {
    type: String,
    required: true,
  },
  income: {
    type: String,
    required: true,
  },
  panNumber: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
},{ timestamps: true });

const Loan = mongoose.model("Loan", LoanSchema);
module.exports = Loan;
