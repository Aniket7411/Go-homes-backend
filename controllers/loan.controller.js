const loanService = require("../services/loan.service");

const createLoan = async (req, res) => {
  try {
    const userId = req.user._id;
    const loan = await loanService.createLoan(userId, req.body);
    res
      .status(201)
      .json({
        success: true,
        message: "Loan Request created successfully",
        loan,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createLoan,
};
