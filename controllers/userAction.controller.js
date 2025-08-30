const UserActions = require('../models/userActions.model');

// Like a property
exports.likeProperty = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { propertyId } = req.body;

    let userAction = await UserActions.findOne({ userId });

    if (!userAction) {
      userAction = new UserActions({ userId, likedProperties: [propertyId] });
      await userAction.save();
      return res.status(200).json({ message: "Property liked" });
    }

    const updateResult = await UserActions.updateOne(
      { userId },
      { $addToSet: { likedProperties: propertyId } }
    );

    const message = updateResult.modifiedCount > 0 
      ? "Property liked" 
      : "Property was already liked";

    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Save a property
exports.saveProperty = async (req, res) => {
  try {
    const userId = req.user._id; 
    const {propertyId } = req.body;
    console.log(userId)
    let userAction = await UserActions.findOne({ userId });

    if (!userAction) {
      userAction = new UserActions({ userId, savedProperties: [propertyId] });
      await userAction.save();
      return res.status(200).json({ message: "Property saved" });
    }

    const updateResult = await UserActions.updateOne(
      { userId },
      { $addToSet: { savedProperties: propertyId } }
    );

    const message = updateResult.modifiedCount > 0 
      ? "Property saved" 
      : "Property was already saved";

    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLikedProperties = async (req, res) => {
    try {
    const userId = req.user._id;  
    console.log(userId)
      const userAction = await UserActions.findOne({ userId })
        .populate('likedProperties'); // Populate property details
  
      if (!userAction || userAction.likedProperties.length === 0) {
        return res.status(200).json({success: false, message: "No liked properties found" });
      }
  
      res.status(200).json({ success:true, data: userAction.likedProperties });
    } catch (error) {
      res.status(500).json({ success: false, message:error.message });
    }
  };
  
  // Get saved properties
  exports.getSavedProperties = async (req, res) => {
    try {
        const userId = req.user._id; // Get userId from URL params
  
      const userAction = await UserActions.findOne({ userId })
        .populate('savedProperties'); // Populate property details
  
      if (!userAction || userAction.savedProperties.length === 0) {
        return res.status(200).json({ success: false, message: "No saved properties found" });
      }
  
      res.status(200).json({ success:true,data: userAction.savedProperties });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };


  // Unlike a property
exports.unlikeProperty = async (req, res) => {
  try {
    const userId = req.user._id;
    const { propertyId } = req.body;

    const updateResult = await UserActions.updateOne(
      { userId },
      { $pull: { likedProperties: propertyId } }
    );

    const message = updateResult.modifiedCount > 0
      ? "Property unliked"
      : "Property was not in liked list";

    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unsave a property
exports.unsaveProperty = async (req, res) => {
  try {
    const userId = req.user._id;
    const { propertyId } = req.body;

    const updateResult = await UserActions.updateOne(
      { userId },
      { $pull: { savedProperties: propertyId } }
    );

    const message = updateResult.modifiedCount > 0
      ? "Property unsaved"
      : "Property was not in saved list";

    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
