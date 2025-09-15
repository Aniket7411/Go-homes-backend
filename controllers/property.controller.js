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

const shareProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { shareType, shareData } = req.body;
        const userId = req.user._id;

        // Validate property exists and user has access
        const property = await Property.findById(propertyId);
        if (!property || property.isDeleted) {
            return res.status(404).json({ 
                success: false, 
                message: "Property not found" 
            });
        }

        // Check if user owns the property or if it's public
        if (String(property.userId) !== String(userId) && !property.isApproved) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized to share this property" 
            });
        }

        // Generate share data based on share type
        let shareResponse = {
            success: true,
            message: "Property shared successfully",
            data: {
                propertyId: property._id,
                propertyName: property.propertyName,
                propertyType: property.propertyType,
                city: property.city,
                propertyPrice: property.propertyPrice,
                shareType: shareType,
                shareUrl: null,
                shareCode: null
            }
        };

        switch (shareType) {
            case 'link':
                // Generate a shareable link
                const shareUrl = `${req.protocol}://${req.get('host')}/api/property/shared/${propertyId}`;
                shareResponse.data.shareUrl = shareUrl;
                break;

            case 'code':
                // Generate a share code (using property code)
                shareResponse.data.shareCode = property.propertyCode;
                break;

            case 'social':
                // Prepare data for social media sharing
                shareResponse.data.socialData = {
                    title: `${property.propertyName} - ${property.propertyType}`,
                    description: `${property.propertyType} in ${property.city} for ${property.propertyPrice ? `₹${property.propertyPrice}` : 'Contact for price'}`,
                    image: property.images && property.images.length > 0 ? property.images[0] : null,
                    url: `${req.protocol}://${req.get('host')}/api/property/shared/${propertyId}`
                };
                break;

            case 'whatsapp':
                // Generate WhatsApp share link
                const whatsappText = encodeURIComponent(
                    `Check out this ${property.propertyType} in ${property.city}!\n` +
                    `${property.propertyName}\n` +
                    `Price: ${property.propertyPrice ? `₹${property.propertyPrice}` : 'Contact for price'}\n` +
                    `View more: ${req.protocol}://${req.get('host')}/api/property/shared/${propertyId}`
                );
                shareResponse.data.shareUrl = `https://wa.me/?text=${whatsappText}`;
                break;

            case 'email':
                // Prepare email sharing data
                shareResponse.data.emailData = {
                    subject: `Property: ${property.propertyName}`,
                    body: `Hi,\n\nI found this interesting property:\n\n` +
                          `Property: ${property.propertyName}\n` +
                          `Type: ${property.propertyType}\n` +
                          `Location: ${property.city}\n` +
                          `Price: ${property.propertyPrice ? `₹${property.propertyPrice}` : 'Contact for price'}\n\n` +
                          `View details: ${req.protocol}://${req.get('host')}/api/property/shared/${propertyId}`
                };
                break;

            default:
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid share type. Supported types: link, code, social, whatsapp, email" 
                });
        }

        res.status(200).json(shareResponse);

    } catch (error) {
        console.error("Error sharing property:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

const getSharedProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;

        const property = await Property.findById(propertyId)
            .populate('userId', 'name email phone')
            .populate('backgroundMusic', 'title artist');

        if (!property || property.isDeleted) {
            return res.status(404).json({ 
                success: false, 
                message: "Property not found" 
            });
        }

        // Return public property data (without sensitive information)
        const publicPropertyData = {
            _id: property._id,
            propertyName: property.propertyName,
            propertyType: property.propertyType,
            furnitureType: property.furnitureType,
            construction_status: property.construction_status,
            rent_per_person: property.rent_per_person,
            bhkDetails: property.bhkDetails,
            propertyPrice: property.propertyPrice,
            propertySize: property.propertySize,
            city: property.city,
            pincode: property.pincode,
            landmark: property.landmark,
            locality: property.locality,
            completeAddress: property.completeAddress,
            geoCoordinates: property.geoCoordinates,
            includedDetails: property.includedDetails,
            saleType: property.saleType,
            PGorProperty: property.PGorProperty,
            auctionDetails: property.auctionDetails,
            propertyCode: property.propertyCode,
            images: property.images,
            video: property.video,
            backgroundMusic: property.backgroundMusic,
            ownerDetails: {
                name: property.ownerDetails?.name,
                email: property.ownerDetails?.email,
                reraNumber: property.ownerDetails?.reraNumber
            },
            createdAt: property.createdAt
        };

        res.status(200).json({ 
            success: true, 
            data: publicPropertyData 
        });

    } catch (error) {
        console.error("Error getting shared property:", error);
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
    updatePropertyStatusById,
    shareProperty,
    getSharedProperty
};
