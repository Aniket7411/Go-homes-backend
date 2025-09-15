const express = require('express');
const PropertyController = require('../controllers/property.controller');
const authMiddleware = require("../middlewares/auth");


const router = express.Router();

router.post('/createProperty',authMiddleware, PropertyController.createProperty);
router.get('/allProperties',authMiddleware, PropertyController.getAllProperties);
router.get('/myProperties',authMiddleware, PropertyController.getProperties);
router.delete('/deleteProperty/:id', authMiddleware, PropertyController.deleteProperty);
router.patch('/status/:propertyId', authMiddleware, PropertyController.updatePropertyStatusById);

// Property sharing routes
router.post('/share/:propertyId', authMiddleware, PropertyController.shareProperty);
router.get('/shared/:propertyId', PropertyController.getSharedProperty);

module.exports = router;