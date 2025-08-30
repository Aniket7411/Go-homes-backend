const cloudinary = require("cloudinary").v2;
const fs = require("fs"); 

// Ensure Cloudinary is configured correctly
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadFile = async (file, folder, resourceType = "auto") => {
    try {
        if (!file || !file.tempFilePath) {
            throw new Error("Invalid file: tempFilePath not found");
        }

        // Ensure audio files are uploaded correctly
        if (resourceType === "audio") {
            resourceType = "video";  // Cloudinary treats audio as "video"
        }


        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder,
            use_filename: true,
            resource_type: resourceType,  
        });

        // Delete temp file after upload
        fs.unlinkSync(file.tempFilePath);

        return result;

    } catch (error) {
        console.error(`Cloudinary Upload Error (${resourceType}):`, error);
        throw error;
    }
};


const uploadMultipleFiles = async (files, folder) => {
    try {
        if (!files || files.length === 0) {
            throw new Error("No images provided for upload");
        }

        const uploadPromises = files.map((file) => uploadFile(file, folder, "image"));
        return await Promise.all(uploadPromises);

    } catch (error) {
        console.error("Error uploading multiple images:", error);
        throw error;
    }
};

module.exports = {
    uploadFile,
    uploadMultipleFiles
};
