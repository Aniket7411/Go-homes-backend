const express = require("express");
const CityController = require("../controllers/city.controller");
const { getSublocalities,getAreasWithPincode } = require('../controllers/localityController');
const router = express.Router();

router.get("/cities", CityController.getCities);
// router.get("/cities", CityController.loadCitiesFromJSON);


router.get('/locality/:city', getAreasWithPincode);

module.exports = router;
