const CityService = require("../services/city.service");

const CityController = {
    getCities: async (req, res) => {
        try {
            const search = req.query.search || "";
            const cities = await CityService.getAllCities(search);
            res.json({ success: true, message: "City found successfully", data: cities });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // loadCitiesFromJSON: (req, res) => {
    //     try {
    //         const cities = CityService.loadCitiesFromJSON();
    //         res.json({ success: true, data: cities });
    //     } catch (error) {
    //         res.status(500).json({ success: false, message: error.message });
    //     }
    // },
};

module.exports = CityController;
