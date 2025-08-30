const express = require("express");
const { createOrder, verifyPayment, getMyTransactions } = require("../controllers/payment.controller");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/order",authMiddleware, createOrder);
router.post("/verify",authMiddleware, verifyPayment);
router.get("/my-transactions", authMiddleware, getMyTransactions);

module.exports = router;
