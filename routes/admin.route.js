const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

// GET /admin/users - Get all users
router.get("/users", adminController.getAllUsers);
router.get("/properties", adminController.getAllProperties);
router.get("/dashboard-stats", adminController.getDashboardStats);
router.get("/loan", adminController.getAllLoans);
router.patch("/properties/:id/status", adminController.updatePropertyStatus);
router.delete('/property/:id', adminController.deleteProperty);

module.exports = router;
