const express = require('express');
const router = express.Router();
const emiController = require('../controllers/emi.controller');
const authMiddleware = require("../middlewares/auth");

router.post('/calculate',authMiddleware, emiController.calculateEMI);

module.exports = router;
