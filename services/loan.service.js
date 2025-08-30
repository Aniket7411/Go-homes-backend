const Loan = require("../models/loan.model");

/**
 * Create a new loan entry for a user
 * @param {String} userId - ID of the user creating the loan
 * @param {Object} loanData - The loan data from the request body
 * @returns {Promise<Object>} - Created loan document
 */
const createLoan = async (userId, loanData) => {
  loanData.user = userId;

  const newLoan = new Loan(loanData);
  return await newLoan.save();
};

module.exports = {
  createLoan,
};
