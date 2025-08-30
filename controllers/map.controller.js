const axios = require('axios');

const tryFetchCoordinates = async (query) => {
  const response = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: {
      q: query,
      format: 'json',
      limit: 1
    },
    headers: {
      'User-Agent': 'Go-homes/1.0 (manish091102@gmail.com)'
    }
  });

  console.log("data", response)

  if (response.data && response.data.length > 0) {
    const { lat, lon } = response.data[0];
    return { lat, lon };
  }

  return null;
};

const getCoordinatesFromAddress = async (address) => {
    console.log("address", address)
  try {
    const variations = [];

    variations.push(address);

    const parts = address.split(',');
    for (let i = 1; i < parts.length; i++) {
      const trimmed = parts.slice(i).join(',').trim();
      if (trimmed.length > 0) {
        variations.push(trimmed);
      }
    }

    for (const variation of variations) {
      console.log(`Trying: ${variation}`);
      const coords = await tryFetchCoordinates(variation);
      if (coords) {
        console.log(`Success with: ${variation}`);
        return coords;
      }
    }

    console.error("No results found for any variation.");
    throw new Error('No results found');
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw error;
  }
};

const location = async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    const coordinates = await getCoordinatesFromAddress(address);
    res.status(200).json(coordinates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coordinates' });
  }
};

module.exports = {
  getCoordinatesFromAddress,
  location,
};
