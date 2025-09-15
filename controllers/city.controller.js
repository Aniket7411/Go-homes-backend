const CityService = require("../services/city.service");

const CityController = {
    // getCities: async (req, res) => {
    //     try {
    //         const search = req.query.search || "";
    //         const cities = await CityService.getAllCities(search);
    //         res.json({ success: true, message: "City found successfully", data: cities });
    //     } catch (error) {
    //         res.status(500).json({ success: false, message: error.message });
    //     }
    // },

    getCities: async (req, res) => {
        try {
            const { search, state } = req.query;

            const cities = await CityService.getAllCities(search, state);

            res.json({
                success: true,
                message: "Cities fetched successfully",
                data: cities
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get all unique states
    getStates: async (req, res) => {
        try {
            const states = await CityService.getAllStates();
            res.json({
                success: true,
                message: "States fetched successfully",
                data: states
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    

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
