const express = require('express');
const ProfileController = require('../controllers/profile.Controller');
const authMiddleware = require("../middlewares/auth");


const router = express.Router();

router.get('/myProfile',authMiddleware, ProfileController.getProfile);
router.patch('/updateProfile',authMiddleware, ProfileController.updateProfile);





module.exports = router;