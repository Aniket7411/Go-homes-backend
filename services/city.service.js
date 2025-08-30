const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/city.json");

const CityService = {
    getAllCities: async (search) => {
        if (!fs.existsSync(filePath)) return [];

        let cities = JSON.parse(fs.readFileSync(filePath, "utf8"));

        if (search) {
            cities = cities.filter(city =>
                city.name.toLowerCase().startsWith(search.toLowerCase())
            );
        }

        return cities;
    },

    // loadCitiesFromJSON: () => {
    //     if (fs.existsSync(filePath)) {
    //         return JSON.parse(fs.readFileSync(filePath, "utf8"));
    //     }
    //     return [];
    // },
};

module.exports = CityService;
