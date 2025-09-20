const Property = require("../models/property.model");
const UserActions = require("../models/userActions.model");
const { uploadFile, uploadMultipleFiles } = require("../utils/upload");

const createProperty = async (propertyData) => {
    const property = await Property.create(propertyData);
    return property;
};

const getAllProperties = async (query,userId) => {
    const { city,state,locality, minPrice, maxPrice, propertyType, userLocation_longitude, userLocation_latitude, nearbyRange, saleType,search } = query;
    const longitude = +parseFloat(userLocation_longitude).toFixed(6);
    const latitude = +parseFloat(userLocation_latitude).toFixed(6);
    const filter = { isDeleted: false };

    filter.status = "approved";

    if (city) {
        filter.city = city;
    }
    if (state) {
        filter.state = state;
    }
     if (locality) {
        filter.locality = locality;
    }
    if (saleType) {
        filter.saleType = saleType;
    }
    if (minPrice !== undefined && maxPrice !== undefined) {
        filter.propertyPrice = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice !== undefined) {
        filter.propertyPrice = { $gte: minPrice };
    } else if (maxPrice !== undefined) {
        filter.propertyPrice = { $lte: maxPrice };
    }

    if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
            { pincode: searchRegex },
            { landmark: searchRegex },
            { completeAddress: searchRegex },
            { bhkDetails: searchRegex },
            { propertyName: searchRegex },
            { propertySize: searchRegex },
            {locality:searchRegex}
        ];
    }

    if (propertyType) {
        filter.propertyType = propertyType;
        filter.propertyType = propertyType;
    }
    if (longitude && userLocation_latitude && nearbyRange) {
        filter.geoCoordinates = {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                $maxDistance: parseFloat(nearbyRange) * 1000 // Convert km to meters
            }
        };
    }
  const properties = await Property.find(filter).populate('backgroundMusic');

  let userActions = { savedProperties: [], likedProperties: [] };

  // If user is authenticated, fetch their saved and liked properties
  if (userId) {
      userActions = await UserActions.findOne({ userId }).select('savedProperties likedProperties').lean();
  }
  console.log(userActions)

  // Map properties to include isLiked and isSaved
  const updatedProperties = properties.map(property => {
      const isLiked = userActions?.likedProperties?.some(id => id.toString() === property._id.toString()) || false;
      const isSaved = userActions?.savedProperties?.some(id => id.toString() === property._id.toString()) || false;
      
      return {
          ...property.toObject(),
          isLiked,
          isSaved
      };
  });

  return updatedProperties;
};

const getProperties = async (query) => {
    return await Property.find(query);
};

const getPropertyById = async (id) => {
    return Property.findById(id);
};

const updateProperty = async (id, updateData) => {
    return Property.findByIdAndUpdate(id, updateData, { new: true });
};

const updatePropertyStatusById = async (propertyId, isSold) => {
    const updatedProperty = await Property.findByIdAndUpdate(
        propertyId, 
        { isSold: isSold },
        { new: true }
    );

    if (!updatedProperty) {
        throw new Error('Property not found');
    }
    return updatedProperty;
}


module.exports = {
    uploadFile,
    uploadMultipleFiles,
    createProperty,
    getAllProperties,
    getProperties,
    getPropertyById,
    updateProperty,
    updatePropertyStatusById
};
