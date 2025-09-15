const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/city.json");
const filePathNew = path.join(__dirname, "../data/newcity.json");

const CityService = {
    // getAllCities: async (search) => {
    //     if (!fs.existsSync(filePath)) return [];

    //     let cities = JSON.parse(fs.readFileSync(filePath, "utf8"));

    //     if (search) {
    //         cities = cities.filter(city =>
    //             city.name.toLowerCase().startsWith(search.toLowerCase())
    //         );
    //     }

    //     return cities;
    // },

    getAllStates: async () => {
        if (!fs.existsSync(filePathNew)) return [];

        let cities = JSON.parse(fs.readFileSync(filePathNew, "utf8"));

        // Extract unique states
        const states = [...new Set(cities.map(city => city.state))];

        return states;
    },

    getAllCities: async (search, state) => {
        if (!fs.existsSync(filePathNew)) return [];

        let cities = JSON.parse(fs.readFileSync(filePathNew, "utf8"));

        if (state) {
            cities = cities.filter(
                city => city.state.toLowerCase() === state.toLowerCase()
            );
        }

        if (search) {
            cities = cities.filter(city =>
                city.name.toLowerCase().startsWith(search.toLowerCase())
            );
        }

        return cities;
    },

};

module.exports = CityService;
