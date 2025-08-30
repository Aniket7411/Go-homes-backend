const express = require('express');
const router = express.Router();
const userActionsController = require('../controllers/userAction.controller');
const authMiddleware = require("../middlewares/auth");


// Route to like a property
router.post('/like',authMiddleware, userActionsController.likeProperty);

// Route to save a property
router.post('/save',authMiddleware, userActionsController.saveProperty);

router.get('/liked-properties',authMiddleware, userActionsController.getLikedProperties); // New route
router.get('/saved-properties', authMiddleware,userActionsController.getSavedProperties);

// Route to unlike a property
router.post('/unlike', authMiddleware, userActionsController.unlikeProperty);

// Route to unsave a property
router.post('/unsave', authMiddleware, userActionsController.unsaveProperty);


module.exports = router;
