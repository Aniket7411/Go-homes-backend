const express = require("express");
const BoastController = require("../controllers/boast.controller");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/create", authMiddleware, BoastController.createBoast);
router.post("/view/:propertyId", authMiddleware, BoastController.addView);
router.get("/boostProperties", authMiddleware, BoastController.getAllAvailableBoasts);
router.get("/myboostedProperties", authMiddleware, BoastController.getMyBoostedProperties);
router.get("/myboostedPlanDetails", authMiddleware, BoastController.getMyALLBoastedProperties);
router.get("/boastPlan",authMiddleware, BoastController.getAllPlans);


module.exports = router;
