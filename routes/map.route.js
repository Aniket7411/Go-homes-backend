const express = require("express");
const { location } = require('../controllers/map.controller');

const router = express.Router();

router.post('/geocode', location);

module.exports = router;
