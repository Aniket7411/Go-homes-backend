const User = require("../models/User");
const { uploadFile } = require("../services/property.service"); 

exports.updateProfile = async (req, res) => {
    const userId = req.user._id;
    const { fullName } = req.body;
    const { profilePicture } = req.files || {};

    try {
        let updateData = { fullName };

        if (profilePicture) {
            const uploadResult = await uploadFile(profilePicture, "profile_pictures", "image");
            updateData.profilePicture = uploadResult.secure_url; 
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedUser });

    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


exports.getProfile = async (req, res) => {
    const userId = req.user._id

    try {
        const user = await User.findOne({_id: userId });

        console.log(user)
    
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    
        
        res.status(200).json({status: true, message: "User Found", data:user });
      } catch (error) {
        res.status(500).json({ error });
      }

}