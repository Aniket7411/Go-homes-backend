const PropertyService = require("../services/property.service");
const Property = require("../models/property.model");
const { getCoordinatesFromAddress } = require("./map.controller");
const Music = require("../models/music.model");

const createProperty = async (req, res) => {
    try {
        const { files } = req;
        const propertyData = req.body;

        const userId = req.user._id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID missing" });
        }

        propertyData.userId = userId;

        propertyData.includedDetails = {
            bedrooms: propertyData["includedDetails[bedrooms]"],
            bathrooms: propertyData["includedDetails[bathrooms]"],
            kitchen: propertyData["includedDetails[kitchen]"],
            balcony: propertyData["includedDetails[balcony]"],
            parking: propertyData["includedDetails[parking]"] || "",
        };

        propertyData.ownerDetails = {
            name: propertyData["ownerDetails[name]"],
            email: propertyData["ownerDetails[email]"],
            aadhar: propertyData["ownerDetails[aadhar]"],
            reraNumber: propertyData["ownerDetails[reraNumber]"] || "",
        };

        propertyData.auctionDetails = {
            auctionStartDateTime: propertyData["auctionDetails[auctionStartDateTime]"],
            auctionEndDateTime: propertyData["auctionDetails[auctionEndDateTime]"],
            auctionType: propertyData["auctionDetails[auctionType]"],
            minIncrementValue: propertyData["auctionDetails[minIncrementValue]"],
            startingBidAmount: propertyData["auctionDetails[startingBidAmount]"] || "",
        };

        if (propertyData["geoCoordinates[longitude]"] && propertyData["geoCoordinates[latitude]"]) {
            const longitude = +parseFloat(propertyData["geoCoordinates[longitude]"]).toFixed(6);
            const latitude = +parseFloat(propertyData["geoCoordinates[latitude]"]).toFixed(6);
        
            propertyData.geoCoordinates = {
                type: "Point",
                coordinates: [longitude, latitude]  // Ensure correct format: [longitude, latitude]
            };
        } else {
            delete propertyData.geoCoordinates; // Better than setting it to undefined
        }

    //     const { landmark, city, pincode } = propertyData;

    // if (!landmark || !city || !pincode) {
    //   return res.status(400).json({ success: false, message: "landmark, city, and pincode are required for coordinates" });
    // }

    // const fullAddress = `${landmark}, ${city}, ${pincode}`;
    // console.log("Looking up coordinates for:", fullAddress);

    // try {
    //   const coords = await getCoordinatesFromAddress(fullAddress);

    //   if (coords) {
    //     const longitude = +parseFloat(coords.lon).toFixed(6);
    //     const latitude = +parseFloat(coords.lat).toFixed(6);

    //     propertyData.geoCoordinates = {
    //       type: "Point",
    //       coordinates: [longitude, latitude]
    //     };
    //   }
    // } catch (geoErr) {
    //   console.warn("⚠️ Failed to fetch coordinates:", geoErr.message);
    //   return res.status(500).json({ success: false, message: "Could not resolve coordinates from address" });
    // }
        
        
        // if (files) {
        //     if (files.video) {
        //         const videoUpload = await PropertyService.uploadFile(files.video, "videos", "video");
        //         propertyData.video = videoUpload.secure_url;
        //     }
        //     if (files.images) {
        //         const imagesArray = Array.isArray(files.images) ? files.images : [files.images];

        //         const imagesUpload = await PropertyService.uploadMultipleFiles(imagesArray, "images");
        //         propertyData.images = imagesUpload.map((img) => img.secure_url);
        //     }
        // }

        if (propertyData.video) {
            propertyData.video = propertyData.video; // single video URL
        }

        if (propertyData.images) {
            try {
                // Ensure it's an array
                propertyData.images = Array.isArray(propertyData.images)
                    ? propertyData.images
                    : JSON.parse(propertyData.images);
            } catch (e) {
                console.warn("Images parsing error:", e.message);
                propertyData.images = [];
            }
        }

        const property = await Property.create(propertyData);        
        res.status(201).json({ success: true, data: property });

    } catch (error) {
        console.error("Error creating property:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};



const getAllProperties = async (req, res) => {
    try {
        const userId = req.user._id;
        const properties = await PropertyService.getAllProperties(req.query,userId);
        res.status(200).json({ success: true, data: properties });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getProperties = async (req, res) => {
    try {
        const { propertyId, ...filters } = req.query;
        const userId = req.user._id;

        let query = { isDeleted: false, userId };

        if (propertyId) query._id = propertyId;
        if (Object.keys(filters).length > 0) query = { ...query, ...filters };

        const properties = await PropertyService.getProperties(query);
        res.status(200).json({ success: true, data: properties });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const userId = req.user._id;

        // Optional: Ensure the user owns the property
        const property = await PropertyService.getPropertyById(propertyId);

        if (!property || property.isDeleted) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        if (String(property.userId) !== String(userId)) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await PropertyService.updateProperty(propertyId, { isDeleted: true });

        res.status(200).json({ success: true, message: "Property deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updatePropertyStatusById = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { isSold } = req.query;

        if (isSold !== 'true' && isSold !== 'false') {
            return res.status(400).json({ 
                success: false, 
                message: "Status must be 'true' or 'false'" 
            });
        }

        // const isSoldValue = status === 'true';

        const updatedProperty = await PropertyService.updatePropertyStatusById(propertyId, isSold);

        if (!updatedProperty) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Property status updated successfully', 
            data: updatedProperty 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};



module.exports = {
    createProperty,
    getAllProperties,
    getProperties,
    deleteProperty,
    updatePropertyStatusById
};
