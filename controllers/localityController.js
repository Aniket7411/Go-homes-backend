const axios = require('axios');
const https = require("https");
const agent = new https.Agent({
  rejectUnauthorized: false // ⚠️ DON'T use this in production
});
const GOOGLE_API_KEY = 'AIzaSyDR1Uw4DnjzbnaHZdxfcNE8qoxA5mUmYOc';

exports.getSublocalities = async (req, res) => {
    const city = req.params.city;

    try {
        // Step 1: Get coordinates of the city
        const geoResp = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: city,
                key: GOOGLE_API_KEY
            }
        });

        const results = geoResp.data.results;
        if (!results.length) {
            return res.status(404).json({ message: 'City not found' });
        }

        const location = results[0].geometry.location;

        // Step 2: Search nearby places for sublocalities
        const placesResp = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
            params: {
                location: `${location.lat},${location.lng}`,
                radius: 10000,
                type: 'neighborhood',
                key: GOOGLE_API_KEY
            }
        });

        const localities = placesResp.data.results.map(place => place.name);
        res.json({ city, localities });

    } catch (error) {
        console.error('Google API Error:', error.message);
        res.status(500).json({ message: 'Error fetching data from Google API' });
    }
};

exports.getAreasWithPincode = async (req, res) => {
  const city = req.params.city; // e.g., "Ahmedabad"

  try {
 const response = await axios.get(`https://api.postalpincode.in/postoffice/${city}`, {
  httpsAgent: agent
});
    const data = response.data[0];

    if (data.Status !== "Success") {
      return res.status(404).json({ message: "No data found for this city" });
    }

    const localities = data.PostOffice.map((office) => ({
      area: office.Name,
      pincode: office.Pincode
    }));

    res.json({ city, localities });

  } catch (error) {
    console.error("Error fetching pincode data:", error.message);
    res.status(500).json({ message:error});
  }
};
