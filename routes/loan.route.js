const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loan.controller');
const authMiddleware = require("../middlewares/auth");

router.post('/createLoanRequest',authMiddleware, loanController.createLoan);

module.exports = router;
